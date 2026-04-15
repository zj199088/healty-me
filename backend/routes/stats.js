import express from 'express';
const router = express.Router();
import { getUserStats, getStatsByDateRange } from '../controllers/statsController.js';
import auth from '../middleware/auth.js';

// @route   GET api/stats
// @desc    Get user statistics
// @access  Private
router.get('/', auth, getUserStats);

// @route   GET api/stats/range
// @desc    Get user stats by date range
// @access  Private
router.get('/range', auth, getStatsByDateRange);

export default router;