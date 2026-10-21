import crypto from 'crypto';

/**
 * Generate a unique appointment ID like "APT-20261002-A1B2"
 */
export const generateAppointmentId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `APT-${dateStr}-${randomPart}`;
};

/**
 * Generate a daily token number for a doctor's queue
 * @param {number} lastToken - The last token number issued today
 * @returns {number} Next token number
 */
export const generateTokenNumber = (lastToken = 0) => {
  return lastToken + 1;
};
