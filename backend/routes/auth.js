import express from 'express';
const router = express.Router();
import { register, login, getMe, updateUser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// @route   PUT api/auth/me
// @desc    Update current user
// @access  Private
router.put('/me', auth, updateUser);

export default router;