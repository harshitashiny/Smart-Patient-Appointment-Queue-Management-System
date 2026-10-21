import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * GET /api/doctors - List all approved doctors
 */
export const getDoctors = async (req, res) => {
  try {
    const { specialization, search, clinic, department, available } = req.query;
    
    // Find approved doctor user accounts
    const approvedDoctorUsers = await User.find({
      role: 'doctor',
      isApproved: true,
      isActive: true,
    }).select('_id');

    const approvedUserIds = approvedDoctorUsers.map((u) => u._id);
    const filter = { user: { $in: approvedUserIds } };

    // Filter by specialization if given
    if (specialization && specialization.trim()) {
      const cleanSpec = specialization.trim();
      // Handle variations like 'Obs & Gynecology' vs 'Obstetrics & Gynecology'
      const specPattern = cleanSpec
        .replace(/obs\b|obstetrics/gi, '(?:Obs|Obstetrics)')
        .replace(/&|and/gi, '(?:&|and)');
      filter.specialization = { $regex: new RegExp(specPattern, 'i') };
    }

    if (clinic && clinic.trim()) {
      filter.clinicName = { $regex: clinic.trim(), $options: 'i' };
    }

    if (department && department.trim()) {
      filter.department = department.trim();
    }

    let doctors = await Doctor.find(filter)
      .populate('user', 'name email phone avatar')
      .populate('department', 'name')
      .sort({ rating: -1, experience: -1 });

    // If search query is provided, search across name, specialization, clinicName, clinicAddress, and bio
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      doctors = doctors.filter((doc) => {
        const userName = doc.user?.name?.toLowerCase() || '';
        const spec = doc.specialization?.toLowerCase() || '';
        const qual = doc.qualification?.toLowerCase() || '';
        const desig = doc.designation?.toLowerCase() || '';
        const expText = doc.expertise?.toLowerCase() || '';
        const clinicName = doc.clinicName?.toLowerCase() || '';
        const clinicAddress = doc.clinicAddress?.toLowerCase() || '';
        const bio = doc.bio?.toLowerCase() || '';
        const deptName = doc.department?.name?.toLowerCase() || '';

        return (
          userName.includes(q) ||
          spec.includes(q) ||
          qual.includes(q) ||
          desig.includes(q) ||
          expText.includes(q) ||
          clinicName.includes(q) ||
          clinicAddress.includes(q) ||
          bio.includes(q) ||
          deptName.includes(q)
        );
      });
    }

    return sendSuccess(res, { doctors, total: doctors.length });
  } catch (error) {
    console.error('Get doctors error:', error);
    return sendError(res, 'Failed to fetch doctors', 500);
  }
};

/**
 * GET /api/doctors/:id - Get doctor detail
 */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('department', 'name');

    if (!doctor) {
      return sendError(res, 'Doctor not found', 404);
    }

    return sendSuccess(res, { doctor });
  } catch (error) {
    return sendError(res, 'Failed to fetch doctor', 500);
  }
};

/**
 * PUT /api/doctors/:id - Update doctor profile (doctor themselves)
 */
export const updateDoctor = async (req, res) => {
  try {
    const {
      specialization, qualification, experience,
      consultationFee, appointmentDuration, bio,
      clinicName, clinicAddress, department,
    } = req.body;

    const updates = {};
    if (specialization) updates.specialization = specialization;
    if (qualification) updates.qualification = qualification;
    if (experience !== undefined) updates.experience = experience;
    if (consultationFee !== undefined) updates.consultationFee = consultationFee;
    if (appointmentDuration) updates.appointmentDuration = appointmentDuration;
    if (bio) updates.bio = bio;
    if (clinicName) updates.clinicName = clinicName;
    if (clinicAddress) updates.clinicAddress = clinicAddress;
    if (department) updates.department = department;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone avatar');

    if (!doctor) {
      return sendError(res, 'Doctor profile not found', 404);
    }

    return sendSuccess(res, { doctor }, 'Profile updated');
  } catch (error) {
    return sendError(res, 'Failed to update profile', 500);
  }
};

export const STANDARD_APPOINTMENT_SLOTS = [
  { start: '09:30', end: '10:30', label: '9:30 AM – 10:30 AM' },
  { start: '10:30', end: '11:30', label: '10:30 AM – 11:30 AM' },
  { start: '11:30', end: '12:30', label: '11:30 AM – 12:30 PM' },
  { start: '13:30', end: '14:30', label: '1:30 PM – 2:30 PM' },
  { start: '14:30', end: '15:30', label: '2:30 PM – 3:30 PM' },
  { start: '15:30', end: '16:30', label: '3:30 PM – 4:30 PM' },
  { start: '16:30', end: '17:00', label: '4:30 PM – 5:00 PM' },
  { start: '17:30', end: '18:30', label: '5:30 PM – 6:30 PM' },
  { start: '18:30', end: '19:30', label: '6:30 PM – 7:30 PM' },
  { start: '19:30', end: '20:30', label: '7:30 PM – 8:30 PM' },
  { start: '20:30', end: '21:30', label: '8:30 PM – 9:30 PM' },
];

export const STANDARD_BREAK_SLOTS = [
  { start: '12:30', end: '13:30', label: '12:30 PM – 1:30 PM', type: 'lunch', name: 'Lunch Break', icon: '🥗' },
  { start: '17:00', end: '17:30', label: '5:00 PM – 5:30 PM', type: 'break', name: 'Break', icon: '☕' },
];

/**
 * GET /api/doctors/:id/availability - Get available slots for a date
 */
export const getDoctorAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return sendError(res, 'Date is required', 400);
    }

    const doctor = await Doctor.findById(req.params.id).populate('user', 'name phone');
    if (!doctor) {
      return sendError(res, 'Doctor not found', 404);
    }

    const requestedDate = new Date(date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[requestedDate.getDay()];

    // Sunday is off
    if (dayName === 'sunday') {
      return sendSuccess(res, { slots: [], breaks: [], message: 'Doctor is not available on Sundays' });
    }

    // Check schedule for the day
    const daySchedule = doctor.schedule?.find((s) => s.day === dayName);
    if (daySchedule && daySchedule.isAvailable === false) {
      return sendSuccess(res, { slots: [], breaks: [], message: 'Doctor is not available on this day' });
    }

    // Check if date is in unavailable dates
    const isUnavailable = (doctor.unavailableDates || []).some(
      (ud) => new Date(ud.date).toDateString() === requestedDate.toDateString()
    );
    if (isUnavailable) {
      return sendSuccess(res, { slots: [], breaks: [], message: 'Doctor is unavailable on this date' });
    }

    // Standard slots: 10 patients max per slot
    const maxPerSlot = doctor.maxPatientsPerSlot || 10;

    // Get existing appointments for that date
    const dateStart = new Date(requestedDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(requestedDate);
    dateEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      doctor: doctor.user._id,
      date: { $gte: dateStart, $lte: dateEnd },
      status: { $nin: ['cancelled', 'no-show'] },
    });

    // Count bookings per slot
    const bookingCounts = {};
    existingAppointments.forEach((a) => {
      const key = a.timeSlot.start;
      bookingCounts[key] = (bookingCounts[key] || 0) + 1;
    });

    // Build slots with capacity info
    const slotsWithCapacity = STANDARD_APPOINTMENT_SLOTS.map((s) => {
      const booked = bookingCounts[s.start] || 0;
      const available = Math.max(0, maxPerSlot - booked);
      const isFull = booked >= maxPerSlot;
      return {
        start: s.start,
        end: s.end,
        label: s.label,
        booked,
        maxPatients: maxPerSlot,
        available,
        isFull,
        status: isFull ? 'Slot Full' : 'Available',
      };
    });

    return sendSuccess(res, {
      slots: slotsWithCapacity,
      breaks: STANDARD_BREAK_SLOTS,
      doctor: {
        _id: doctor._id,
        name: doctor.user?.name,
        specialization: doctor.specialization,
        designation: doctor.designation,
        consultationFee: doctor.consultationFee,
        appointmentDuration: doctor.appointmentDuration || 60,
        maxPatientsPerSlot: maxPerSlot,
        hospitalPhone: doctor.hospitalPhone || '+91 44 42002288',
        emergencyPhone: doctor.emergencyPhone || '105710',
        clinicName: doctor.clinicName,
        clinicAddress: doctor.clinicAddress,
      },
    });
  } catch (error) {
    console.error('Get availability error:', error);
    return sendError(res, 'Failed to get availability', 500);
  }
};

/**
 * PUT /api/doctors/schedule - Update doctor schedule
 */
export const updateSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    if (!schedule || !Array.isArray(schedule)) {
      return sendError(res, 'Schedule data is required', 400);
    }

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { schedule },
      { new: true }
    );

    if (!doctor) {
      return sendError(res, 'Doctor profile not found', 404);
    }

    return sendSuccess(res, { schedule: doctor.schedule }, 'Schedule updated');
  } catch (error) {
    return sendError(res, 'Failed to update schedule', 500);
  }
};

/**
 * PUT /api/doctors/unavailable-dates - Add unavailable dates
 */
export const updateUnavailableDates = async (req, res) => {
  try {
    const { unavailableDates } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { unavailableDates },
      { new: true }
    );

    if (!doctor) {
      return sendError(res, 'Doctor profile not found', 404);
    }

    return sendSuccess(res, { unavailableDates: doctor.unavailableDates }, 'Unavailable dates updated');
  } catch (error) {
    return sendError(res, 'Failed to update unavailable dates', 500);
  }
};

// Helper functions
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}
