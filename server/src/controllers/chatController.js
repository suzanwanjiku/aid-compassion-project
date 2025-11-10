import asyncHandler from 'express-async-handler';
import Chat from '../models/Chat.js';

// POST /api/chat - create chat message
export const createChat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const sender = req.user ? req.user._id : null;
  const chat = await Chat.create({ message, sender });
  res.status(201).json(chat);
});

// GET /api/chat - list messages
export const listChat = asyncHandler(async (req, res) => {
  const msgs = await Chat.find().populate('sender', 'name email').sort({ created_at: 1 });
  res.json(msgs);
});
