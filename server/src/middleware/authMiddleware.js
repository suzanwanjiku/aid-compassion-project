import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }
      req.user = user;
      // fetch roles
      const roles = await UserRole.find({ user_id: user._id });
      req.user.roles = roles.map(r=>r.role);
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authenticated'));
    }
    if (!req.user.roles || !req.user.roles.includes(role)) {
      res.status(403);
      return next(new Error('Forbidden: insufficient role'));
    }
    next();
  };
};
