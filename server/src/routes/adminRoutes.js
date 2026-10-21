import express from 'express';
import {
  getDashboardStats, getUsers, approveDoctor, toggleUserActive,
  getAllAppointments, getDepartments, createDepartment, updateDepartment, deleteDepartment,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/approve', approveDoctor);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/appointments', getAllAppointments);
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

export default router;
