/**
 * models/User.js - Mongoose User Schema
 * Stores user credentials and password reset token data.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    // User's email address (unique identifier)
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },

    // Random string token sent via email for password reset
    resetPasswordToken: {
      type: String,
      default: null,
    },

    // Expiry timestamp for the reset token (1 hour from generation)
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

/**
 * Pre-save hook: Hash the password before saving to DB.
 * Only runs if the password field was modified.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: Compare entered plain-text password with stored hashed password.
 * @param {string} enteredPassword - Plain text password from user input
 * @returns {boolean} - True if passwords match
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
