// src/api/v1/validators/product.validator.js
const { body } = require('express-validator');

exports.createProductValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Product description is required'),
    body('price')
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    body('stock')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

exports.updateProductValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
    body('price')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];