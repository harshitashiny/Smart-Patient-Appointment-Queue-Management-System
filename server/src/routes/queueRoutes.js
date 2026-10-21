import express from 'express';
import { getQueue, callNextPatient, updateQueueStatus } from '../controllers/queueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/:doctorId', protect, getQueue);
router.post('/:doctorId/next', protect, authorize('doctor', 'admin'), callNextPatient);
router.put('/:appointmentId/status', protect, authorize('doctor', 'admin'), updateQueueStatus);

export default router;
