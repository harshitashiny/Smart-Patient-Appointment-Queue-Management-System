import User from '../models/User.js';
import Patient from '../models/Patient.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GET /api/users/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, { user });
  } catch (error) {
    return sendError(res, 'Failed to get profile', 500);
  }
};

/**
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, age, gender, avatar, preferredLang } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (age) updates.age = age;
    if (gender) updates.gender = gender;
    if (avatar) updates.avatar = avatar;
    if (preferredLang) updates.preferredLang = preferredLang;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, { user }, 'Profile updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update profile', 500);
  }
};

/**
 * PUT /api/users/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current and new password are required', 400);
    }
    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    return sendError(res, 'Failed to change password', 500);
  }
};

/**
 * POST /api/users/avatar
 * Upload user avatar image
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 'Please upload an image file', 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'User not found', 404);

    // Delete old avatar file if it exists
    if (user.avatar) {
      const oldFilename = user.avatar.split('/').pop();
      const oldPath = path.join(__dirname, '../../uploads/avatars', oldFilename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new avatar URL (relative path served by express.static)
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    return sendSuccess(res, { avatar: avatarUrl }, 'Avatar uploaded successfully');
  } catch (error) {
    return sendError(res, 'Failed to upload avatar', 500);
  }
};

/**
 * DELETE /api/users/avatar
 * Remove user avatar
 */
export const removeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'User not found', 404);

    // Delete the avatar file
    if (user.avatar) {
      const filename = user.avatar.split('/').pop();
      const filePath = path.join(__dirname, '../../uploads/avatars', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.avatar = '';
    await user.save();

    return sendSuccess(res, null, 'Avatar removed successfully');
  } catch (error) {
    return sendError(res, 'Failed to remove avatar', 500);
  }
};
