import express from 'express';
import {
  createAppointment, getAppointments, getAppointmentById,
  updateAppointment, deleteAppointment, checkIn,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateAppointment } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', protect, validateAppointment, createAppointment);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);
router.post('/:id/check-in', protect, checkIn);

export default router;
