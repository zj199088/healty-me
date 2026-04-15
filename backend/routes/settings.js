import express from 'express';
const router = express.Router();
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import auth from '../middleware/auth.js';

// @route   GET api/settings
// @desc    Get user settings
// @access  Private
router.get('/', auth, getSettings);

// @route   PUT api/settings
// @desc    Update user settings
// @access  Private
router.put('/', auth, updateSettings);

export default router;