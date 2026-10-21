import express from 'express';
import { getDashboard, getPatient, updatePatient, getPatientHistory } from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.get('/:id', protect, getPatient);
router.put('/:id', protect, updatePatient);
router.get('/:id/history', protect, getPatientHistory);

export default router;
