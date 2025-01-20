const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new AppError('No authentication token, authorization denied', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.userId) {
        throw new AppError('Token verification failed', 401);
      }

      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if token version matches (if version is included in token)
      if (decoded.version !== undefined && decoded.version !== user.tokenVersion) {
        throw new AppError('Token is no longer valid, please login again', 401);
      }

      // Add user and token to request object
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }
    next();
  };
};

module.exports = { auth, restrictTo };
