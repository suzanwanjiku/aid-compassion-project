import express from 'express';
import { body, validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('donationId').notEmpty(),
    body('amount').isNumeric(),
    body('phoneNumber').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { donationId, amount, phoneNumber } = req.body;

      const transaction = new Transaction({
        donationId,
        amount,
        phoneNumber,
        status: 'pending',
      });

      await transaction.save();
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'donor') {
      const donations = await Donation.find({ donorId: req.user.id }).select('_id');
      query.donationId = { $in: donations.map(d => d._id) };
    }

    const transactions = await Transaction.find(query)
      .populate('donationId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

router.post('/mpesa-callback', async (req, res, next) => {
  try {
    const { Body } = req.body;

    if (!Body) {
      return res.status(400).json({ error: 'Invalid callback data' });
    }

    const { stkCallback } = Body;
    const { CheckoutRequestID, ResultCode } = stkCallback;

    const transaction = await Transaction.findOne({ checkoutRequestId: CheckoutRequestID });

    if (transaction) {
      transaction.status = ResultCode === 0 ? 'completed' : 'failed';
      await transaction.save();
    }

    res.status(200).json({ ResultCode: 0 });
  } catch (error) {
    next(error);
  }
});

export default router;
