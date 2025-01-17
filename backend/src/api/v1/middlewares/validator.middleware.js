// src/api/v1/middlewares/validator.middleware.js
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

exports.validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new AppError('Validation Error', 400);
            error.errors = errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }));
            return next(error);
        }
        next();
    };
};