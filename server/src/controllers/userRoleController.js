import asyncHandler from 'express-async-handler';
import UserRole from '../models/UserRole.js';

// GET /api/user_roles?user_id=...
export const getUserRoles = asyncHandler(async (req, res) => {
  const { user_id } = req.query;
  const roles = await UserRole.find(user_id ? { user_id } : {});
  res.json(roles);
});

// POST /api/user_roles
export const createUserRole = asyncHandler(async (req, res) => {
  const { user_id, role } = req.body;
  const ur = await UserRole.create({ user_id, role });
  res.status(201).json(ur);
});
