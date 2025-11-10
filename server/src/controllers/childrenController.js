import asyncHandler from 'express-async-handler';
import ChildrenHome from '../models/ChildrenHome.js';

// GET /api/children_homes
export const getChildrenHomes = asyncHandler(async (req, res) => {
  const homes = await ChildrenHome.find();
  res.json(homes);
});

// POST /api/children_homes
export const createChildrenHome = asyncHandler(async (req, res) => {
  const { name, location, contact, description } = req.body;
  const home = await ChildrenHome.create({ name, location, contact, description });
  res.status(201).json(home);
});
