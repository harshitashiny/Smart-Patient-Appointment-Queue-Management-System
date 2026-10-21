import { sendError } from '../utils/responseHandler.js';
import { isValidEmail } from '../utils/validators.js';

/**
 * Validate registration body
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (role && !['patient', 'doctor'].includes(role)) {
    errors.push('Invalid role');
  }

  if (errors.length > 0) {
    return sendError(res, errors.join('. '), 400, errors);
  }
  next();
};

/**
 * Validate login body
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email');
  }
  if (!password) {
    errors.push('Please provide a password');
  }

  if (errors.length > 0) {
    return sendError(res, errors.join('. '), 400, errors);
  }
  next();
};

/**
 * Validate appointment creation body
 */
export const validateAppointment = (req, res, next) => {
  const { doctor, date, timeSlot } = req.body;
  const errors = [];

  if (!doctor) errors.push('Doctor is required');
  if (!date) errors.push('Date is required');
  if (!timeSlot || !timeSlot.start) {
    errors.push('Time slot is required');
  } else if (!timeSlot.end) {
    // Auto-calculate end time 15 minutes after start if not explicitly passed
    const [h, m] = timeSlot.start.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      const totalMins = h * 60 + m + 15;
      const endH = Math.floor(totalMins / 60) % 24;
      const endM = totalMins % 60;
      timeSlot.end = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    } else {
      timeSlot.end = timeSlot.start;
    }
  }

  if (errors.length > 0) {
    return sendError(res, errors.join('. '), 400, errors);
  }
  next();
};
