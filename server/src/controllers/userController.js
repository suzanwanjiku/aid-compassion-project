import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';

// Helpers
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshTokenString = () => {
  // simple random token, in production use crypto.randomBytes
  return jwt.sign({ ts: Date.now() }, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET+'refresh'), { expiresIn: '30d' });
};

const setRefreshCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    // secure should be true in production (HTTPS)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  res.cookie('refreshToken', token, cookieOptions);
};

// @desc Register new user
// @route POST /api/users/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }
  const userExists = await User.findOne({ email });
  if(userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashed });
  if(user) {
    // create refresh token
    const refreshString = generateRefreshTokenString();
    const rt = await RefreshToken.create({ user: user._id, token: refreshString, expiresAt: new Date(Date.now() + 30*24*60*60*1000) });
    setRefreshCookie(res, refreshString);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateAccessToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user._id);
    const refreshString = generateRefreshTokenString();
    await RefreshToken.create({ user: user._id, token: refreshString, expiresAt: new Date(Date.now() + 30*24*60*60*1000) });
    setRefreshCookie(res, refreshString);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: accessToken
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Refresh access token
// @route POST /api/users/refresh
// @access Public (via cookie)
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token');
  }
  const stored = await RefreshToken.findOne({ token, revoked: false });
  if (!stored) {
    res.status(401);
    throw new Error('Refresh token invalid');
  }
  // Optionally verify jwt structure of token
  try {
    // create new access token
    const accessToken = generateAccessToken(stored.user.toString());
    // optionally rotate refresh token
    const newRefresh = generateRefreshTokenString();
    stored.revoked = true;
    await stored.save();
    await RefreshToken.create({ user: stored.user, token: newRefresh, expiresAt: new Date(Date.now() + 30*24*60*60*1000) });
    setRefreshCookie(res, newRefresh);
    res.json({ token: accessToken });
  } catch (err) {
    res.status(401);
    throw new Error('Failed to refresh');
  }
});

// @desc Logout - revoke refresh token and clear cookie
// @route POST /api/users/logout
// @access Public (uses cookie)
export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await RefreshToken.updateMany({ token }, { revoked: true });
  }
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ message: 'Logged out' });
});
