/**
 * controllers/authController.js
 * Handles all authentication and password reset logic.
 */

const crypto = require('crypto');
const User = require('../models/User');
const { sendResetEmail } = require('../utils/sendEmail');

// ─── Register User ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new user account.
 * Body: { name, email, password }
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    // Create and save new user (password hashing handled in model pre-save hook)
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── Login User ───────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Authenticates an existing user.
 * Body: { email, password }
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Compare provided password with stored hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

/**
 * POST /api/auth/forgot-password
 * Checks if user exists, generates a reset token, stores it, and emails the link.
 * Body: { email }
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    // Step 1: Check if user exists in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.',
      });
    }

    // Step 2: Generate a cryptographically secure random token (32 bytes hex = 64 chars)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Step 3: Set expiry time (default: 1 hour from now)
    const expiryDuration = parseInt(process.env.RESET_TOKEN_EXPIRY, 10) || 3600000;
    const expiryTime = new Date(Date.now() + expiryDuration);

    // Step 4: Store the token and expiry in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiryTime;
    await user.save({ validateBeforeSave: false });

    // Step 5: Build reset link with token as URL parameter
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Step 6: Send email with the reset link
    await sendResetEmail(user.email, resetLink, user.name);

    return res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email address.',
    });
  } catch (error) {
    console.error('Forgot Password Error:', error.message);

    // If email sending fails, clean up the token from DB
    if (error.message && error.message.includes('Email')) {
      await User.findOneAndUpdate(
        { email: req.body.email },
        { resetPasswordToken: null, resetPasswordExpires: null }
      );
    }

    return res.status(500).json({
      success: false,
      message: 'Could not send reset email. Please try again.',
    });
  }
};

// ─── Verify Reset Token ───────────────────────────────────────────────────────

/**
 * GET /api/auth/verify-reset-token/:token
 * Verifies the reset token from the URL is valid and not expired.
 * Params: token
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with matching token
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password reset link. Please request a new one.',
      });
    }

    // Check if token has expired
    if (user.resetPasswordExpires < Date.now()) {
      // Clear expired token from DB
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });

      return res.status(400).json({
        success: false,
        expired: true,
        message: 'Password reset link has expired. Please request a new one.',
      });
    }

    // Token is valid
    return res.status(200).json({
      success: true,
      message: 'Token is valid.',
      email: user.email, // Return masked email for display
    });
  } catch (error) {
    console.error('Verify Token Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

/**
 * POST /api/auth/reset-password/:token
 * Validates the token, updates the password, and clears the reset token.
 * Params: token
 * Body: { password, confirmPassword }
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate inputs
    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Both password fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    // Find user with matching, non-expired token
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or already used reset link. Please request a new one.',
      });
    }

    // Check token expiry
    if (user.resetPasswordExpires < Date.now()) {
      // Clear expired token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });

      return res.status(400).json({
        success: false,
        expired: true,
        message: 'Password reset link has expired. Please request a new one.',
      });
    }

    // Update the password (pre-save hook will hash it)
    user.password = password;

    // Clear the reset token and expiry from DB
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully updated! You can now log in.',
    });
  } catch (error) {
    console.error('Reset Password Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
