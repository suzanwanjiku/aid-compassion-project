import { protect, requireRole } from '../middleware/authMiddleware.js';
import express from 'express';
import { getDistributions, createDistribution } from '../controllers/distributionController.js';
const router = express.Router();
router.get('/', getDistributions);
router.post('/', protect, requireRole('admin'), createDistribution);
export default router;
