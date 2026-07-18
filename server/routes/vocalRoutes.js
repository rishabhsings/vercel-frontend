import express from 'express';
import { updateVocalProfile } from '../controllers/vocalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateVocalProfile);

export default router;
