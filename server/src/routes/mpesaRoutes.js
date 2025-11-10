import express from 'express';
import { stkPush, mpesaCallback } from '../controllers/mpesaController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/stk-push', protect, stkPush);
// Public callback endpoint that Safaricom can call
router.post('/callback', mpesaCallback);

export default router;
