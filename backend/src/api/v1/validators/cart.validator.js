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

exports.syncCartValidator = [
    body('items')
        .isArray()
        .withMessage('Items must be an array'),
    body('items.*.productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('items.*.color')
        .optional({ nullable: true })
        .isString()
        .withMessage('Color must be a string if provided'),
    body('items.*.size')
        .optional({ nullable: true })
        .isString()
        .withMessage('Size must be a string if provided')
];
