import express from 'express';
import { body, validationResult } from 'express-validator';
import Distribution from '../models/Distribution.js';
import Donation from '../models/Donation.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  [
    body('donationId').notEmpty(),
    body('childrenHomeId').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { donationId, childrenHomeId, notes } = req.body;

      const distribution = new Distribution({
        donationId,
        childrenHomeId,
        distributedBy: req.user.id,
        notes,
      });

      await distribution.save();

      await Donation.findByIdAndUpdate(donationId, { status: 'supplied' });

      res.status(201).json(distribution);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const distributions = await Distribution.find()
      .populate('donationId')
      .populate('childrenHomeId')
      .populate('distributedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(distributions);
  } catch (error) {
    next(error);
    }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const distribution = await Distribution.findById(req.params.id)
      .populate('donationId')
      .populate('childrenHomeId')
      .populate('distributedBy', 'fullName email');

    if (!distribution) {
      return res.status(404).json({ error: 'Distribution not found' });
    }

    res.json(distribution);
  } catch (error) {
    next(error);
  }
});

export default router;
