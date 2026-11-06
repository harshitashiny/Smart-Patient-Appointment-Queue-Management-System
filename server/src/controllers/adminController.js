import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Queue from '../models/Queue.js';
import Department from '../models/Department.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Notification from '../models/Notification.js';
import { getIO } from '../config/socket.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * GET /api/admin/dashboard - Dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const dateStart = new Date(today);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(today);
    dateEnd.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todaysAppointments,
      completedToday,
      cancelledToday,
      waitingQueue,
      pendingDoctors,
      rejectedDoctors,
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor', isApproved: true }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ date: { $gte: dateStart, $lte: dateEnd } }),
      Appointment.countDocuments({ date: { $gte: dateStart, $lte: dateEnd }, status: 'completed' }),
      Appointment.countDocuments({ date: { $gte: dateStart, $lte: dateEnd }, status: 'cancelled' }),
      Queue.countDocuments({ date: { $gte: dateStart, $lte: dateEnd }, status: { $in: ['waiting', 'next'] } }),
      User.countDocuments({ role: 'doctor', isApproved: false, approvalStatus: { $ne: 'rejected' } }),
      User.countDocuments({ role: 'doctor', approvalStatus: 'rejected' }),
    ]);

    // Weekly data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStart = new Date(d);
      dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(d);
      dEnd.setHours(23, 59, 59, 999);

      const count = await Appointment.countDocuments({
        date: { $gte: dStart, $lte: dEnd },
      });
      weeklyData.push({
        date: d.toISOString().slice(0, 10),
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        appointments: count,
      });
    }

    // Status distribution
    const statusDistribution = await Appointment.aggregate([
      { $match: { date: { $gte: dateStart, $lte: dateEnd } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Monthly data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const count = await Appointment.countDocuments({
        date: { $gte: mStart, $lte: mEnd },
      });
      monthlyData.push({
        month: mStart.toLocaleDateString('en', { month: 'short', year: 'numeric' }),
        appointments: count,
      });
    }

    return sendSuccess(res, {
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todaysAppointments,
        completedToday,
        cancelledToday,
        waitingQueue,
        pendingDoctors,
        rejectedDoctors,
      },
      weeklyData,
      monthlyData,
      statusDistribution,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return sendError(res, 'Failed to fetch dashboard data', 500);
  }
};

/**
 * GET /api/admin/pending-doctors - Get all pending/rejected doctor registration requests
 */
export const getPendingDoctors = async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const userFilter = { role: 'doctor' };

    if (status === 'pending') {
      userFilter.$or = [
        { isApproved: false, approvalStatus: { $ne: 'rejected' } },
        { approvalStatus: 'pending' },
      ];
    } else if (status === 'rejected') {
      userFilter.approvalStatus = 'rejected';
    } else if (status === 'approved') {
      userFilter.isApproved = true;
    } else {
      // 'all' pending or rejected
      userFilter.$or = [
        { isApproved: false },
        { approvalStatus: { $in: ['pending', 'rejected'] } },
      ];
    }

    const users = await User.find(userFilter)
      .select('-password')
      .sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const doctors = await Doctor.find({ user: { $in: userIds } })
      .populate('department', 'name');

    const doctorByUserId = {};
    doctors.forEach((doc) => {
      doctorByUserId[doc.user.toString()] = doc;
    });

    const requests = users.map((u) => ({
      _id: u._id,
      user: u,
      doctor: doctorByUserId[u._id.toString()] || null,
      status: u.approvalStatus || (u.isApproved ? 'approved' : 'pending'),
      rejectionReason: u.rejectionReason || '',
      createdAt: u.createdAt,
    }));

    return sendSuccess(res, { requests });
  } catch (error) {
    console.error('getPendingDoctors error:', error);
    return sendError(res, 'Failed to fetch pending doctor registrations', 500);
  }
};

/**
 * GET /api/admin/users - Get all users
 */
export const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, {
      users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch users', 500);
  }
};

/**
 * PUT /api/admin/users/:id/approve or /api/admin/doctors/:id/approve
 */
export const approveDoctor = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      const doc = await Doctor.findById(req.params.id);
      if (doc) user = await User.findById(doc.user);
    }

    if (!user) return sendError(res, 'User or doctor not found', 404);
    if (user.role !== 'doctor') return sendError(res, 'User is not a doctor', 400);

    user.isApproved = true;
    user.approvalStatus = 'approved';
    user.rejectionReason = '';
    await user.save({ validateBeforeSave: false });

    // Send notification to the doctor
    try {
      await Notification.create({
        user: user._id,
        title: 'Registration Approved!',
        message: 'Congratulations! Your doctor registration has been approved by the administrator. You can now log in and access your dashboard.',
        type: 'doctor-approved',
        data: {
          approvedAt: new Date(),
        },
      });
    } catch (notifErr) {
      console.error('Error creating approval notification:', notifErr);
    }

    // Socket notification
    try {
      const io = getIO();
      io.to(`user:${user._id}`).emit('doctor:approved', {
        userId: user._id,
        name: user.name,
      });
      io.emit('doctor:status-updated', {
        userId: user._id,
        status: 'approved',
      });
    } catch (socketErr) {
      // Socket may not have listeners
    }

    return sendSuccess(res, { user }, 'Doctor approved successfully');
  } catch (error) {
    console.error('Approve doctor error:', error);
    return sendError(res, 'Failed to approve doctor', 500);
  }
};

/**
 * PUT /api/admin/users/:id/reject or /api/admin/doctors/:id/reject
 */
export const rejectDoctor = async (req, res) => {
  try {
    const { reason = 'Registration request declined by hospital administrator.' } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
      const doc = await Doctor.findById(req.params.id);
      if (doc) user = await User.findById(doc.user);
    }

    if (!user) return sendError(res, 'User or doctor not found', 404);
    if (user.role !== 'doctor') return sendError(res, 'User is not a doctor', 400);

    user.isApproved = false;
    user.approvalStatus = 'rejected';
    user.rejectionReason = reason;
    await user.save({ validateBeforeSave: false });

    // Send notification to the doctor
    try {
      await Notification.create({
        user: user._id,
        title: 'Registration Request Declined',
        message: `Your doctor registration was not approved: ${reason}`,
        type: 'doctor-rejected',
        data: {
          rejectedAt: new Date(),
          reason,
        },
      });
    } catch (notifErr) {
      console.error('Error creating rejection notification:', notifErr);
    }

    // Socket notification
    try {
      const io = getIO();
      io.to(`user:${user._id}`).emit('doctor:rejected', {
        userId: user._id,
        reason,
      });
      io.emit('doctor:status-updated', {
        userId: user._id,
        status: 'rejected',
      });
    } catch (socketErr) {
      // Socket may not have listeners
    }

    return sendSuccess(res, { user }, 'Doctor registration rejected');
  } catch (error) {
    console.error('Reject doctor error:', error);
    return sendError(res, 'Failed to reject doctor', 500);
  }
};

/**
 * DELETE /api/admin/doctors/:id/registration - Delete registration request
 */
export const deleteDoctorRegistration = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      const doc = await Doctor.findById(req.params.id);
      if (doc) user = await User.findById(doc.user);
    }

    if (!user) return sendError(res, 'User not found', 404);
    if (user.role !== 'doctor') return sendError(res, 'User is not a doctor', 400);

    await Doctor.deleteOne({ user: user._id });
    await Notification.deleteMany({ user: user._id });
    await User.findByIdAndDelete(user._id);

    return sendSuccess(res, null, 'Doctor registration record deleted');
  } catch (error) {
    console.error('Delete registration error:', error);
    return sendError(res, 'Failed to delete registration record', 500);
  }
};

/**
 * PUT /api/admin/users/:id/toggle-active - Activate/deactivate user
 */
export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, { user }, `User ${user.isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    return sendError(res, 'Failed to toggle user status', 500);
  }
};

/**
 * GET /api/admin/appointments - All appointments with filters
 */
export const getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctor, patient, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;
    if (date) {
      const d = new Date(date);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, {
      appointments,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch appointments', 500);
  }
};

/**
 * CRUD for Departments
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('headDoctor', 'name');
    return sendSuccess(res, { departments });
  } catch (error) {
    return sendError(res, 'Failed to fetch departments', 500);
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return sendError(res, 'Department name is required', 400);

    const department = await Department.create({ name, description, icon });
    return sendSuccess(res, { department }, 'Department created', 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'Department already exists', 400);
    }
    return sendError(res, 'Failed to create department', 500);
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!department) return sendError(res, 'Department not found', 404);
    return sendSuccess(res, { department }, 'Department updated');
  } catch (error) {
    return sendError(res, 'Failed to update department', 500);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    return sendSuccess(res, null, 'Department deleted');
  } catch (error) {
    return sendError(res, 'Failed to delete department', 500);
  }
};
