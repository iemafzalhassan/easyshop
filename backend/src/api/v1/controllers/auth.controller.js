const AuthService = require('../../../services/auth.service');
const AppError = require('../utils/AppError');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

class AuthController {
  static async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Create user
      const user = await AuthService.createUser({ name, email, password });
      
      // Generate token
      const token = AuthService.generateToken(user._id);

      res.status(201).json({
        status: 'success',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const { email, password } = req.body;

      // Verify credentials
      const { user, token } = await AuthService.verifyCredentials(email, password);

      res.status(200).json({
        status: 'success',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.findUserById(req.user._id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, errors.array());
      }

      const updates = req.body;
      const user = await AuthService.updateUser(req.user._id, updates);

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      // Get user with password field from database
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Check if current password is correct
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          status: 'error',
          message: 'Current password is incorrect'
        });
      }

      // Check if new password is same as current password
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return res.status(400).json({
          status: 'error',
          message: 'New password must be different from current password'
        });
      }

      // Update password - this will trigger the pre-save middleware
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
      });
    } catch (error) {
      console.error('Error in changePassword:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AuthController;
