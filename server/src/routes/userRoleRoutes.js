import { protect, requireRole } from '../middleware/authMiddleware.js';
import express from 'express';
import { getUserRoles, createUserRole } from '../controllers/userRoleController.js';
const router = express.Router();
router.get('/', getUserRoles);
router.post('/', protect, requireRole('admin'), createUserRole);
export default router;
