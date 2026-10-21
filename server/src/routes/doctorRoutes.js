import express from 'express';
import {
  getDoctors, getDoctorById, updateDoctor,
  getDoctorAvailability, updateSchedule, updateUnavailableDates,
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getDoctors); // Public
router.get('/:id', getDoctorById); // Public
router.get('/:id/availability', getDoctorAvailability); // Public

// Doctor only
router.put('/profile', protect, authorize('doctor'), updateDoctor);
router.put('/schedule', protect, authorize('doctor'), updateSchedule);
router.put('/unavailable-dates', protect, authorize('doctor'), updateUnavailableDates);

export default router;
