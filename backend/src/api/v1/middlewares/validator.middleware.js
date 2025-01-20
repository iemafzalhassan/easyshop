// src/api/v1/middlewares/validator.middleware.js
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

exports.validate = (validations) => {
    return async (req, res, next) => {
        try {
            // Run all validations
            await Promise.all(validations.map(validation => validation.run(req)));

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Group errors by field for better readability
                const groupedErrors = errors.array().reduce((acc, err) => {
                    // Handle nested fields safely
                    const field = err.path || err.param || 'general';
                    if (!acc[field]) {
                        acc[field] = [];
                    }
                    acc[field].push(err.msg);
                    return acc;
                }, {});

                const error = new AppError('Validation Error', 400);
                error.errors = Object.entries(groupedErrors).map(([field, messages]) => ({
                    field,
                    message: messages[0] // Take the first error message for each field
                }));
                return next(error);
            }
            next();
        } catch (error) {
            console.error('Validation error:', error);
            next(new AppError('Internal Server Error', 500));
        }
    };
};