const { body } = require('express-validator');

exports.addToCartValidator = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1')
];

exports.updateCartItemValidator = [
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1')
];
