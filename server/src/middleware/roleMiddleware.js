import { sendError } from '../utils/responseHandler.js';

/**
 * Restrict to specific roles
 * Usage: authorize('admin', 'doctor')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Not authorized to access this resource', 403);
    }
    next();
  };
};
