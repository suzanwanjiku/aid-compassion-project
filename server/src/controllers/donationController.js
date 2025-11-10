import asyncHandler from 'express-async-handler';
import Donation from '../models/Donation.js';

// GET /api/donations
export const getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate('donor_id children_home_id');
  res.json(donations);
});

// POST /api/donations
export const createDonation = asyncHandler(async (req, res) => {
  const { amount, donor_id, children_home_id, notes } = req.body;
  const donation = await Donation.create({ amount, donor_id, children_home_id, notes });
  res.status(201).json(donation);
});
