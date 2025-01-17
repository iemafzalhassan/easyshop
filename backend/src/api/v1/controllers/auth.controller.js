const AuthService = require('../../../services/auth.service');
const AppError = require('../utils/AppError');
const { validationResult } = require('express-validator');

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
}

module.exports = AuthController;
