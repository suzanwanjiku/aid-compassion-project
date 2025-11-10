import { protect } from '../middleware/authMiddleware.js';
import express from 'express';
import { getDonations, createDonation } from '../controllers/donationController.js';
const router = express.Router();
router.get('/', getDonations);
router.post('/', protect, createDonation);
export default router;
