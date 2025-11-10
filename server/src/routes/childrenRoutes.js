import express from 'express';
import { getChildrenHomes, createChildrenHome } from '../controllers/childrenController.js';
const router = express.Router();
router.get('/', getChildrenHomes);
router.post('/', createChildrenHome);
export default router;
