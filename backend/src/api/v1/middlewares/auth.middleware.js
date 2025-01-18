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

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            throw new AppError('Token verification failed', 401);
        }

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Check if token is still valid (for password changes)
        if (user.tokenVersion !== decoded.version) {
            throw new AppError('Token is no longer valid, please login again', 401);
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Authentication failed', 401));
        }
    }
};

// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 401));
        }
        
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

module.exports = { auth, restrictTo };
