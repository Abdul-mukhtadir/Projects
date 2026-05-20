/**
 * routes/authRoutes.js
 * Defines all authentication and password reset API endpoints.
 */

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require('../controllers/authController');

// POST /api/auth/register - Create a new user
router.post('/register', registerUser);

// POST /api/auth/login - Authenticate a user
router.post('/login', loginUser);

// POST /api/auth/forgot-password - Request a password reset email
router.post('/forgot-password', forgotPassword);

// GET /api/auth/verify-reset-token/:token - Verify token is valid before showing reset form
router.get('/verify-reset-token/:token', verifyResetToken);

// POST /api/auth/reset-password/:token - Submit new password
router.post('/reset-password/:token', resetPassword);

module.exports = router;
