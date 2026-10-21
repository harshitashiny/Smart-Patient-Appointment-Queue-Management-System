/**
 * Basic validation helpers (complement frontend validation)
 */

export const isValidEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^[0-9]{10,15}$/.test(phone);
};

export const isValidTime = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

export const isValidDate = (dateStr) => {
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d);
};

/**
 * Check if a date is today or in the future
 */
export const isFutureDate = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};
