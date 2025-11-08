import express from 'express';
import { body, validationResult } from 'express-validator';
import Donation from '../models/Donation.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('type').isIn(['monetary', 'non_monetary']),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, amount, itemName, itemDescription, quantity, quantityUnit, phoneNumber } = req.body;

      if (type === 'monetary' && (!amount || !phoneNumber)) {
        return res.status(400).json({ error: 'Amount and phone number required for monetary donations' });
      }

      if (type === 'non_monetary' && (!itemName || !quantity)) {
        return res.status(400).json({ error: 'Item name and quantity required for non-monetary donations' });
      }

      const donation = new Donation({
        donorId: req.user.id,
        type,
        amount: type === 'monetary' ? amount : null,
        itemName,
        itemDescription,
        quantity,
        quantityUnit,
        status: 'pending',
      });

      await donation.save();

      res.status(201).json(donation);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'donor') {
      query.donorId = req.user.id;
    }

    const donations = await Donation.find(query)
      .populate('donorId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId', 'fullName email');

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (req.user.role === 'donor' && donation.donorId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(donation);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'supplied', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    next(error);
  }
});

export default router;
