import express from 'express';
import { createChat, listChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', listChat);
router.post('/', protect, createChat);

export default router;
