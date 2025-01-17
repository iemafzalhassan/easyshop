const { body } = require('express-validator');

exports.checkoutValidator = [
    body('shippingAddress')
        .isObject()
        .withMessage('Shipping address is required'),
    body('shippingAddress.street')
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),
    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    body('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    body('shippingAddress.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),
    body('shippingAddress.pinCode')
        .trim()
        .matches(/^[0-9]{6}$/)
        .withMessage('Please provide a valid 6-digit PIN code'),
    body('shippingAddress.phone')
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Please provide a valid 10-digit phone number'),
    body('currency')
        .optional()
        .isIn(['inr', 'usd', 'eur'])
        .withMessage('Invalid currency')
];
