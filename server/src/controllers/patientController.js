import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * GET /api/patients/dashboard - Get patient dashboard data
 */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // Upcoming appointments (today and future, non-cancelled/completed)
    const upcomingAppointments = await Appointment.find({
      patient: userId,
      date: { $gte: todayStart },
      status: { $in: ['pending', 'confirmed', 'checked-in', 'waiting'] },
    })
      .populate('doctor', 'name email phone avatar')
      .sort({ date: 1, 'timeSlot.start': 1 });

    // Enrich with doctor profile data (phone, specialization, etc.)
    const enrichedAppointments = [];
    for (const appt of upcomingAppointments) {
      const doctorProfile = await Doctor.findOne({ user: appt.doctor._id });
      enrichedAppointments.push({
        _id: appt._id,
        appointmentId: appt.appointmentId,
        date: appt.date,
        timeSlot: appt.timeSlot,
        status: appt.status,
        reason: appt.reason,
        tokenNumber: appt.tokenNumber,
        doctor: {
          _id: appt.doctor._id,
          name: appt.doctor.name,
          email: appt.doctor.email,
          phone: appt.doctor.phone,
          avatar: appt.doctor.avatar,
          specialization: doctorProfile?.specialization || '',
          designation: doctorProfile?.designation || '',
          hospitalPhone: doctorProfile?.hospitalPhone || '',
          clinicName: doctorProfile?.clinicName || '',
        },
      });
    }

    // Medical records count
    const recordsCount = await MedicalRecord.countDocuments({ patient: userId });

    // Past appointments count
    const pastCount = await Appointment.countDocuments({
      patient: userId,
      status: 'completed',
    });

    // Recent activity — last 10 appointments (all statuses)
    const recentActivity = await Appointment.find({ patient: userId })
      .populate('doctor', 'name avatar')
      .sort({ updatedAt: -1 })
      .limit(10);

    // Reminders: appointments happening today or tomorrow
    const tomorrowEnd = new Date(todayStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 2);
    tomorrowEnd.setHours(0, 0, 0, 0);

    const reminders = enrichedAppointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      return apptDate < tomorrowEnd;
    }).map((appt) => {
      const apptDate = new Date(appt.date);
      const isToday = apptDate.toDateString() === now.toDateString();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow = apptDate.toDateString() === tomorrow.toDateString();
      return {
        ...appt,
        reminderType: isToday ? 'today' : isTomorrow ? 'tomorrow' : 'upcoming',
        reminderText: isToday
          ? `You have an appointment today at ${appt.timeSlot.start} with ${appt.doctor.name}`
          : isTomorrow
          ? `Reminder: You have an appointment tomorrow at ${appt.timeSlot.start} with ${appt.doctor.name}`
          : `Upcoming appointment on ${apptDate.toLocaleDateString()} at ${appt.timeSlot.start}`,
      };
    });

    return sendSuccess(res, {
      upcomingCount: enrichedAppointments.length,
      recordsCount,
      pastCount,
      upcomingAppointments: enrichedAppointments,
      recentActivity,
      reminders,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return sendError(res, 'Failed to fetch dashboard data', 500);
  }
};

/**
 * GET /api/patients/:id - Get patient profile
 */
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id }).populate(
      'user',
      'name email phone avatar'
    );

    if (!patient) {
      return sendError(res, 'Patient not found', 404);
    }

    // Authorization: patient can see their own; doctor/admin can see any
    if (
      req.user.role === 'patient' &&
      req.user._id.toString() !== req.params.id
    ) {
      return sendError(res, 'Not authorized', 403);
    }

    return sendSuccess(res, { patient });
  } catch (error) {
    return sendError(res, 'Failed to fetch patient', 500);
  }
};

/**
 * PUT /api/patients/:id - Update patient profile
 */
export const updatePatient = async (req, res) => {
  try {
    // Patient can only update their own profile
    if (
      req.user.role === 'patient' &&
      req.user._id.toString() !== req.params.id
    ) {
      return sendError(res, 'Not authorized', 403);
    }

    const {
      dateOfBirth, gender, bloodGroup, address,
      emergencyContact, medicalInfo, insuranceId,
    } = req.body;

    const updates = {};
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (gender) updates.gender = gender;
    if (bloodGroup) updates.bloodGroup = bloodGroup;
    if (address) updates.address = address;
    if (emergencyContact) updates.emergencyContact = emergencyContact;
    if (medicalInfo) updates.medicalInfo = medicalInfo;
    if (insuranceId) updates.insuranceId = insuranceId;

    const patient = await Patient.findOneAndUpdate(
      { user: req.params.id },
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    if (!patient) {
      return sendError(res, 'Patient not found', 404);
    }

    return sendSuccess(res, { patient }, 'Patient profile updated');
  } catch (error) {
    return sendError(res, 'Failed to update patient', 500);
  }
};

/**
 * GET /api/patients/:id/history - Get patient medical history
 */
export const getPatientHistory = async (req, res) => {
  try {
    // Authorization
    if (req.user.role === 'patient' && req.user._id.toString() !== req.params.id) {
      return sendError(res, 'Not authorized', 403);
    }

    // For doctors, only show records from their consultations
    const filter = { patient: req.params.id };
    if (req.user.role === 'doctor') {
      filter.doctor = req.user._id;
    }

    const records = await MedicalRecord.find(filter)
      .populate('doctor', 'name')
      .populate('appointment', 'appointmentId date timeSlot')
      .sort({ createdAt: -1 });

    const appointments = await Appointment.find({
      patient: req.params.id,
      status: 'completed',
      ...(req.user.role === 'doctor' ? { doctor: req.user._id } : {}),
    })
      .populate('doctor', 'name')
      .sort({ date: -1 });

    return sendSuccess(res, { records, appointments });
  } catch (error) {
    return sendError(res, 'Failed to fetch history', 500);
  }
};
