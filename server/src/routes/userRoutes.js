import express from 'express';
import { registerUser, authUser, refreshToken, logoutUser } from '../controllers/userController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

export default router;

router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
