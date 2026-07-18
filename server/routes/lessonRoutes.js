import express from 'express';
import { getBeginnerLessons } from '../controllers/lessonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getBeginnerLessons);

export default router;
