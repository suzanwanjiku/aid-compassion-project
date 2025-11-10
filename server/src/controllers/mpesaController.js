import asyncHandler from 'express-async-handler';
import Donation from '../models/Donation.js';

// STK push: create a donation intent (client triggers)
export const stkPush = asyncHandler(async (req, res) => {
  // Expect { amount, phone, reference }
  const { amount, phone, reference } = req.body;
  if (!amount || !phone) {
    res.status(400);
    throw new Error('Missing amount or phone');
  }
  // create donation record with status pending and store reference
  const donation = await Donation.create({
    amount,
    notes: `mpesa_ref:${reference || ''}`,
    status: 'pending'
  });
  // In real integration you'd call Safaricom STK Push here
  res.json({ message: 'STK push initiated (simulated)', donation });
});

// Mpesa callback: update donation by reference or amount/phone
export const mpesaCallback = asyncHandler(async (req, res) => {
  // Supabase function used to handle mpesa callbacks; here we'll accept mpesa payload
  const payload = req.body;
  // Try to find donation by reference in notes
  const ref = payload?.Body?.stkCallback?.CheckoutRequestID || payload?.reference;
  let donation = null;
  if (ref) {
    donation = await Donation.findOne({ notes: new RegExp(ref) });
  }
  if (!donation) {
    // fallback: match by amount and set latest pending donation
    donation = await Donation.findOne({ amount: payload?.amount || payload?.Body?.stkCallback?.CallbackMetadata?.Item?.amount, status: 'pending' });
  }
  if (donation) {
    donation.status = 'completed';
    await donation.save();
    return res.json({ status: 'ok', donation });
  }
  res.status(404).json({ status: 'not_found' });
});
