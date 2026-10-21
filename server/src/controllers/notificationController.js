import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * GET /api/notifications - Get user notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const filter = { user: req.user._id };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const total = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .populate('relatedAppointment', 'appointmentId date timeSlot status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return sendSuccess(res, {
      notifications,
      unreadCount,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch notifications', 500);
  }
};

/**
 * PUT /api/notifications/:id/read - Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    return sendSuccess(res, { notification }, 'Marked as read');
  } catch (error) {
    return sendError(res, 'Failed to update notification', 500);
  }
};

/**
 * PUT /api/notifications/read-all - Mark all as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    return sendSuccess(res, null, 'All notifications marked as read');
  } catch (error) {
    return sendError(res, 'Failed to update notifications', 500);
  }
};
