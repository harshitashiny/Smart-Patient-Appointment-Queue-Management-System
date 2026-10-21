import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Queue from '../models/Queue.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { generateAppointmentId } from '../utils/tokenGenerator.js';
import { getIO } from '../config/socket.js';

/**
 * POST /api/appointments - Create appointment
 */
export const createAppointment = async (req, res) => {
  try {
    const { doctor: doctorInput, date, timeSlot, reason } = req.body;

    // Validate date is in the future
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return sendError(res, 'Cannot book appointments in the past', 400);
    }

    const dateStart = new Date(appointmentDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(appointmentDate);
    dateEnd.setHours(23, 59, 59, 999);

    // doctorInput may be a Doctor profile _id OR a user _id — resolve both
    let doctorProfile = await Doctor.findById(doctorInput).populate('user', '_id');
    if (!doctorProfile) {
      doctorProfile = await Doctor.findOne({ user: doctorInput });
    }
    if (!doctorProfile) {
      return sendError(res, 'Doctor not found', 404);
    }
    // Always use the User._id as the canonical doctor identifier in appointments
    const doctor = doctorProfile.user._id ? doctorProfile.user._id : doctorProfile.user;

    const maxPerSlot = doctorProfile.maxPatientsPerSlot || 10;

    // Count existing bookings in the requested slot
    const slotBookingCount = await Appointment.countDocuments({
      doctor,
      date: { $gte: dateStart, $lte: dateEnd },
      'timeSlot.start': timeSlot.start,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    if (slotBookingCount >= maxPerSlot) {
      // Slot is full — find alternative slots with availability
      const requestedDate = new Date(date);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[requestedDate.getDay()];
      
      const daySchedule = doctorProfile.schedule.find((s) => s.day === dayName);
      
      let recommendedSlots = [];
      if (daySchedule && daySchedule.isAvailable) {
        const duration = doctorProfile.appointmentDuration || 60;
        const timeToMins = (t) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
        const minsToTime = (m) => `${Math.floor(m/60).toString().padStart(2,'0')}:${(m%60).toString().padStart(2,'0')}`;

        for (const slot of daySchedule.slots) {
          let current = timeToMins(slot.start);
          const end = timeToMins(slot.end);
          
          while (current + duration <= end) {
            const startStr = minsToTime(current);
            const isBreak = daySchedule.breakSlots.some(b => current >= timeToMins(b.start) && current < timeToMins(b.end));
            if (!isBreak && startStr !== timeSlot.start) {
              const count = await Appointment.countDocuments({
                doctor,
                date: { $gte: dateStart, $lte: dateEnd },
                'timeSlot.start': startStr,
                status: { $nin: ['cancelled', 'no-show'] },
              });
              if (count < maxPerSlot) {
                recommendedSlots.push({ time: startStr, available: maxPerSlot - count });
                if (recommendedSlots.length === 3) break;
              }
            }
            current += duration;
          }
          if (recommendedSlots.length === 3) break;
        }
      }
      
      let errorMsg = `This slot (${timeSlot.start}) is full (${maxPerSlot}/${maxPerSlot} booked).`;
      if (recommendedSlots.length > 0) {
        const formatAmPm = (t) => {
          let [h, m] = t.split(':').map(Number);
          const ampm = h >= 12 ? 'PM' : 'AM';
          h = h % 12 || 12;
          return `${h}:${m.toString().padStart(2,'0')} ${ampm}`;
        };
        const formattedSlots = recommendedSlots.map(s => `${formatAmPm(s.time)} (${s.available} available)`).join(', ');
        errorMsg += ` Try: ${formattedSlots}`;
      }
      return sendError(res, errorMsg, 409);
    }

    // Check for duplicate appointment by same patient on same day with same doctor
    const duplicateCheck = await Appointment.findOne({
      patient: req.user._id,
      doctor,
      date: { $gte: dateStart, $lte: dateEnd },
      status: { $nin: ['cancelled', 'no-show', 'completed'] },
    });

    if (duplicateCheck) {
      return sendError(res, 'You already have an appointment with this doctor on this date', 400);
    }

    // Generate unique appointment ID
    const appointmentId = generateAppointmentId();

    // Count existing appointments for token number
    const existingCount = await Appointment.countDocuments({
      doctor,
      date: { $gte: dateStart, $lte: dateEnd },
      status: { $nin: ['cancelled', 'no-show'] },
    });

    const appointment = await Appointment.create({
      appointmentId,
      patient: req.user._id,
      doctor,
      date: appointmentDate,
      timeSlot,
      reason: reason || '',
      status: 'confirmed',
      tokenNumber: existingCount + 1,
    });

    // Create notification for patient
    await Notification.create({
      user: req.user._id,
      title: 'Appointment Confirmed',
      message: `Your appointment (${appointmentId}) has been confirmed for ${appointmentDate.toDateString()} at ${timeSlot.start}.`,
      type: 'appointment-confirmed',
      relatedAppointment: appointment._id,
    });

    // Create notification for doctor
    await Notification.create({
      user: doctor,
      title: 'New Appointment',
      message: `A new appointment (${appointmentId}) has been booked for ${appointmentDate.toDateString()} at ${timeSlot.start}.`,
      type: 'appointment-confirmed',
      relatedAppointment: appointment._id,
    });

    // Emit socket event
    try {
      const io = getIO();
      io.to(`user:${req.user._id}`).emit('notification:new', {
        title: 'Appointment Confirmed',
        message: `Your appointment has been confirmed.`,
      });
      io.to(`user:${doctor}`).emit('notification:new', {
        title: 'New Appointment',
        message: `A new appointment has been booked.`,
      });
      // Notify doctor dashboard of new appointment
      io.to(`user:${doctor}`).emit('appointment:created', { appointmentId: appointment._id });
      // Broadcast real-time slot booking event so all clients update slot counts dynamically
      io.emit('slot:booked', {
        doctor: doctor.toString(),
        doctorId: doctorInput.toString(),
        date: appointmentDate.toISOString().split('T')[0],
        timeSlot,
      });
    } catch (e) {
      // Socket may not be initialized in tests
    }

    const populated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name email')
      .populate('patient', 'name email');

    return sendSuccess(res, { appointment: populated }, 'Appointment booked successfully', 201);
  } catch (error) {
    console.error('Create appointment error:', error);
    return sendError(res, 'Failed to book appointment', 500);
  }
};

/**
 * GET /api/appointments - Get appointments
 */
export const getAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      filter.doctor = req.user._id;
    }
    // Admin can see all

    if (status) filter.status = status;

    if (date) {
      const d = new Date(date);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name email phone avatar')
      .sort({ date: -1, 'timeSlot.start': 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, {
      appointments,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch appointments', 500);
  }
};

/**
 * GET /api/appointments/:id - Get single appointment
 */
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name email phone avatar');

    if (!appointment) {
      return sendError(res, 'Appointment not found', 404);
    }

    // Authorization
    if (
      req.user.role === 'patient' &&
      appointment.patient._id.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 'Not authorized', 403);
    }
    if (
      req.user.role === 'doctor' &&
      appointment.doctor._id.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 'Not authorized', 403);
    }

    return sendSuccess(res, { appointment });
  } catch (error) {
    return sendError(res, 'Failed to fetch appointment', 500);
  }
};

/**
 * PUT /api/appointments/:id - Update appointment (reschedule, cancel, etc.)
 */
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return sendError(res, 'Appointment not found', 404);
    }

    const { status, date, timeSlot, reason, notes, cancellationReason } = req.body;

    // Handle cancellation
    if (status === 'cancelled') {
      if (['completed', 'in-consultation'].includes(appointment.status)) {
        return sendError(res, 'Cannot cancel a completed or in-progress appointment', 400);
      }
      appointment.status = 'cancelled';
      appointment.cancelledBy = req.user.role;
      appointment.cancellationReason = cancellationReason || '';
      await appointment.save();

      // Notify the other party
      const notifyUserId =
        req.user.role === 'patient' ? appointment.doctor : appointment.patient;
      await Notification.create({
        user: notifyUserId,
        title: 'Appointment Cancelled',
        message: `Appointment ${appointment.appointmentId} has been cancelled.`,
        type: 'appointment-cancelled',
        relatedAppointment: appointment._id,
      });

      try {
        const io = getIO();
        io.to(`user:${notifyUserId}`).emit('notification:new', {
          title: 'Appointment Cancelled',
          message: `Appointment ${appointment.appointmentId} has been cancelled.`,
        });
      } catch (e) {}

      return sendSuccess(res, { appointment }, 'Appointment cancelled');
    }

    // Handle reschedule
    if (date && timeSlot) {
      const newDate = new Date(date);
      const dateStart = new Date(newDate);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(newDate);
      dateEnd.setHours(23, 59, 59, 999);

      // Check slot availability
      const conflict = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctor: appointment.doctor,
        date: { $gte: dateStart, $lte: dateEnd },
        'timeSlot.start': timeSlot.start,
        status: { $nin: ['cancelled', 'no-show'] },
      });

      if (conflict) {
        return sendError(res, 'The selected slot is no longer available. Please select another time.', 409);
      }

      appointment.date = newDate;
      appointment.timeSlot = timeSlot;
    }

    if (status) appointment.status = status;
    if (reason) appointment.reason = reason;
    if (notes) appointment.notes = notes;

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email');

    return sendSuccess(res, { appointment: populated }, 'Appointment updated');
  } catch (error) {
    console.error('Update appointment error:', error);
    return sendError(res, 'Failed to update appointment', 500);
  }
};

/**
 * DELETE /api/appointments/:id - Delete appointment
 */
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return sendError(res, 'Appointment not found', 404);
    }

    // Only admin or the patient who created it can delete
    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 'Not authorized', 403);
    }

    await Appointment.findByIdAndDelete(req.params.id);
    return sendSuccess(res, null, 'Appointment deleted');
  } catch (error) {
    return sendError(res, 'Failed to delete appointment', 500);
  }
};

/**
 * POST /api/appointments/:id/check-in - Patient check-in
 */
export const checkIn = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return sendError(res, 'Appointment not found', 404);
    }

    if (!['confirmed', 'pending'].includes(appointment.status)) {
      return sendError(res, 'Cannot check in for this appointment', 400);
    }

    // Check if already checked in or in queue
    const existingQueue = await Queue.findOne({ appointment: appointment._id });
    if (existingQueue) {
      return sendSuccess(res, {
        queueEntry: existingQueue,
        position: existingQueue.position,
        estimatedWaitTime: existingQueue.estimatedWaitTime,
      }, 'Already checked in');
    }

    appointment.status = 'checked-in';
    await appointment.save();

    // Add to queue
    const dateStart = new Date(appointment.date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(appointment.date);
    dateEnd.setHours(23, 59, 59, 999);

    // Get current queue count for position
    const queueCount = await Queue.countDocuments({
      doctor: appointment.doctor,
      date: { $gte: dateStart, $lte: dateEnd },
      status: { $in: ['waiting', 'next', 'in-consultation'] },
    });

    // Get doctor for average consultation time
    const doctorProfile = await Doctor.findOne({ user: appointment.doctor });
    const avgDuration = doctorProfile ? doctorProfile.appointmentDuration : 15;

    const queueEntry = await Queue.create({
      appointment: appointment._id,
      patient: appointment.patient,
      doctor: appointment.doctor,
      tokenNumber: appointment.tokenNumber,
      position: queueCount + 1,
      status: 'waiting',
      date: appointment.date,
      estimatedWaitTime: queueCount * avgDuration,
    });

    appointment.queuePosition = queueCount + 1;
    await appointment.save();

    // Notify via socket
    try {
      const io = getIO();
      io.to(`queue:${appointment.doctor}`).emit('queue:updated', {
        doctorId: appointment.doctor,
        message: 'A patient has checked in',
      });
    } catch (e) {}

    return sendSuccess(res, {
      queueEntry,
      position: queueCount + 1,
      estimatedWaitTime: queueCount * avgDuration,
    }, 'Checked in successfully');
  } catch (error) {
    console.error('Check-in error:', error);
    return sendError(res, 'Failed to check in', 500);
  }
};
