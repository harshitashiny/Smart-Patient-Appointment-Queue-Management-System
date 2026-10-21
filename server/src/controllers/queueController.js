import Queue from '../models/Queue.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { getIO } from '../config/socket.js';

import mongoose from 'mongoose';

/**
 * Helper to resolve doctor's user ID from either doctor profile ID or user ID
 */
const resolveDoctorUserId = async (id) => {
  if (!mongoose.isValidObjectId(id)) return id;
  const docProfile = await Doctor.findById(id);
  if (docProfile && docProfile.user) {
    return docProfile.user.toString();
  }
  return id;
};

/**
 * GET /api/queue/:doctorId - Get current queue for a doctor
 */
export const getQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const targetUserId = await resolveDoctorUserId(doctorId);

    const queryDate = req.query.date ? new Date(req.query.date) : new Date();
    const dateStart = new Date(queryDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(queryDate);
    dateEnd.setHours(23, 59, 59, 999);

    const queue = await Queue.find({
      doctor: targetUserId,
      date: { $gte: dateStart, $lte: dateEnd },
    })
      .populate('patient', 'name email phone avatar')
      .populate('appointment', 'appointmentId timeSlot reason')
      .sort({ position: 1 });

    const currentlyConsulting = queue.find((q) => q.status === 'in-consultation');
    const waitingPatients = queue.filter((q) => q.status === 'waiting');
    const completedCount = queue.filter((q) => q.status === 'completed').length;
    const nextPatient = queue.find((q) => q.status === 'next');

    // Calculate average wait time
    const completedEntries = queue.filter(
      (q) => q.status === 'completed' && q.consultationStartTime && q.consultationEndTime
    );
    let avgConsultationTime = 15; // default
    if (completedEntries.length > 0) {
      const totalTime = completedEntries.reduce((sum, entry) => {
        return sum + (entry.consultationEndTime - entry.consultationStartTime) / 60000;
      }, 0);
      avgConsultationTime = Math.round(totalTime / completedEntries.length);
    }

    return sendSuccess(res, {
      queue,
      summary: {
        currentlyConsulting,
        nextPatient,
        totalWaiting: waitingPatients.length,
        completedCount,
        avgConsultationTime,
      },
    });
  } catch (error) {
    console.error('Get queue error:', error);
    return sendError(res, 'Failed to fetch queue', 500);
  }
};

/**
 * POST /api/queue/:doctorId/next - Call next patient
 */
export const callNextPatient = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const targetUserId = await resolveDoctorUserId(doctorId);

    const today = new Date();
    const dateStart = new Date(today);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(today);
    dateEnd.setHours(23, 59, 59, 999);

    // Complete current consultation if any
    const currentConsultation = await Queue.findOne({
      doctor: targetUserId,
      date: { $gte: dateStart, $lte: dateEnd },
      status: 'in-consultation',
    });

    if (currentConsultation) {
      currentConsultation.status = 'completed';
      currentConsultation.consultationEndTime = new Date();
      await currentConsultation.save();

      // Update appointment
      await Appointment.findByIdAndUpdate(currentConsultation.appointment, {
        status: 'completed',
        consultationEndTime: new Date(),
      });

      // Notify completed patient
      await Notification.create({
        user: currentConsultation.patient,
        title: 'Consultation Completed',
        message: 'Your consultation has been completed.',
        type: 'consultation-completed',
        relatedAppointment: currentConsultation.appointment,
      });
    }

    // Find the "next" patient or first waiting patient
    let nextInQueue = await Queue.findOne({
      doctor: targetUserId,
      date: { $gte: dateStart, $lte: dateEnd },
      status: 'next',
    });

    if (!nextInQueue) {
      nextInQueue = await Queue.findOne({
        doctor: targetUserId,
        date: { $gte: dateStart, $lte: dateEnd },
        status: 'waiting',
      }).sort({ position: 1 });
    }

    if (!nextInQueue) {
      return sendSuccess(res, { message: 'No more patients in the queue' });
    }

    // Move next patient to in-consultation
    nextInQueue.status = 'in-consultation';
    nextInQueue.consultationStartTime = new Date();
    await nextInQueue.save();

    // Update appointment
    await Appointment.findByIdAndUpdate(nextInQueue.appointment, {
      status: 'in-consultation',
      consultationStartTime: new Date(),
    });

    // Set the following patient as "next"
    const followingPatient = await Queue.findOne({
      doctor: targetUserId,
      date: { $gte: dateStart, $lte: dateEnd },
      status: 'waiting',
    }).sort({ position: 1 });

    if (followingPatient) {
      followingPatient.status = 'next';
      await followingPatient.save();

      // Notify "next" patient
      await Notification.create({
        user: followingPatient.patient,
        title: 'You Are Next!',
        message: 'You are next in the queue. Please be ready.',
        type: 'queue-next',
        relatedAppointment: followingPatient.appointment,
      });

      try {
        const io = getIO();
        io.to(`user:${followingPatient.patient}`).emit('notification:new', {
          title: 'You Are Next!',
          message: 'You are next in the queue.',
        });
      } catch (e) {}
    }

    // Recalculate wait times for remaining patients using dynamic average
    const doctorProfile = await Doctor.findOne({ user: targetUserId });
    let avgDuration = doctorProfile ? doctorProfile.appointmentDuration : 15;

    // Calculate dynamic average based on today's completed consultations
    const completedEntries = await Queue.find({
      doctor: targetUserId,
      date: { $gte: dateStart, $lte: dateEnd },
      status: 'completed',
      consultationStartTime: { $exists: true },
      consultationEndTime: { $exists: true }
    });

    if (completedEntries.length > 0) {
      const totalTime = completedEntries.reduce((sum, entry) => {
        return sum + (entry.consultationEndTime - entry.consultationStartTime) / 60000;
      }, 0);
      avgDuration = Math.round(totalTime / completedEntries.length);
      // Fallback to static if dynamic is too low (e.g. testing)
      if (avgDuration < 3) avgDuration = doctorProfile ? doctorProfile.appointmentDuration : 15;
    }

    const remainingQueue = await Queue.find({
      doctor: targetUserId,
      date: { $gte: dateStart, $lte: dateEnd },
      status: 'waiting',
    }).sort({ position: 1 });

    for (let i = 0; i < remainingQueue.length; i++) {
      remainingQueue[i].estimatedWaitTime = (i + 1) * avgDuration;
      await remainingQueue[i].save();
    }

    // Notify via socket — all patients in this queue room
    try {
      const io = getIO();
      io.to(`queue:${doctorId}`).emit('queue:updated', {
        doctorId,
        currentToken: nextInQueue.tokenNumber,
        message: 'Queue has been updated',
      });
      io.to(`user:${nextInQueue.patient}`).emit('queue:called', {
        message: 'It is your turn for consultation.',
      });
    } catch (e) {}

    const populated = await nextInQueue.populate('patient', 'name email phone');

    return sendSuccess(res, { currentPatient: populated }, 'Next patient called');
  } catch (error) {
    console.error('Call next error:', error);
    return sendError(res, 'Failed to call next patient', 500);
  }
};

/**
 * PUT /api/queue/:appointmentId/status - Update queue entry status
 */
export const updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['waiting', 'next', 'in-consultation', 'completed', 'skipped', 'no-show'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const entry = await Queue.findOne({ appointment: req.params.appointmentId });
    if (!entry) {
      return sendError(res, 'Queue entry not found', 404);
    }

    entry.status = status;
    if (status === 'in-consultation') {
      entry.consultationStartTime = new Date();
    }
    if (status === 'completed') {
      entry.consultationEndTime = new Date();
    }
    await entry.save();

    // Update appointment status to match
    const appointmentStatusMap = {
      'waiting': 'waiting',
      'in-consultation': 'in-consultation',
      'completed': 'completed',
      'no-show': 'no-show',
      'skipped': 'waiting',
    };
    if (appointmentStatusMap[status]) {
      await Appointment.findByIdAndUpdate(entry.appointment, {
        status: appointmentStatusMap[status],
      });
    }

    // Socket notification
    try {
      const io = getIO();
      io.to(`queue:${entry.doctor}`).emit('queue:updated', {
        doctorId: entry.doctor,
        message: 'Queue status updated',
      });
    } catch (e) {}

    return sendSuccess(res, { entry }, 'Queue status updated');
  } catch (error) {
    return sendError(res, 'Failed to update queue status', 500);
  }
};
