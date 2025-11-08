import express from 'express';
import { body, validationResult } from 'express-validator';
import ChildrenHome from '../models/ChildrenHome.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  [
    body('name').notEmpty(),
    body('location').notEmpty(),
    body('contactInfo').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, location, contactInfo } = req.body;

      const home = new ChildrenHome({
        name,
        location,
        contactInfo,
        registeredBy: req.user.id,
      });

      await home.save();
      res.status(201).json(home);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const homes = await ChildrenHome.find()
      .populate('registeredBy', 'fullName email')
      .sort({ name: 1 });

    res.json(homes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const home = await ChildrenHome.findById(req.params.id).populate('registeredBy', 'fullName email');

    if (!home) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json(home);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res, next) => {
  try {
    const { name, location, contactInfo } = req.body;

    const home = await ChildrenHome.findByIdAndUpdate(
      req.params.id,
      { name, location, contactInfo, updatedAt: new Date() },
      { new: true }
    );

    if (!home) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json(home);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res, next) => {
  try {
    const home = await ChildrenHome.findByIdAndDelete(req.params.id);

    if (!home) {
      return res.status(404).json({ error: 'Home not found' });
    }

    res.json({ message: 'Home deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
