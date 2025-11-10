import asyncHandler from 'express-async-handler';
import Distribution from '../models/Distribution.js';

// GET /api/distributions
export const getDistributions = asyncHandler(async (req, res) => {
  const d = await Distribution.find().populate('donation_id children_home_id distributed_by');
  res.json(d);
});

// POST /api/distributions
export const createDistribution = asyncHandler(async (req, res) => {
  const { donation_id, children_home_id, distributed_by, notes } = req.body;
  const dist = await Distribution.create({ donation_id, children_home_id, distributed_by, notes });
  res.status(201).json(dist);
});
