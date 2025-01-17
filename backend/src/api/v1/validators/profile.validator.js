const { body } = require('express-validator');

exports.profileUpdateValidator = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty'),
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Please provide a valid 10-digit phone number')
];

exports.addressValidator = [
    body('type')
        .isIn(['home', 'work', 'other'])
        .withMessage('Invalid address type'),
    body('street')
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),
    body('city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    body('state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    body('country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),
    body('pinCode')
        .trim()
        .matches(/^[0-9]{6}$/)
        .withMessage('Please provide a valid 6-digit PIN code'),
    body('phone')
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Please provide a valid 10-digit phone number'),
    body('isDefault')
        .optional()
        .isBoolean()
        .withMessage('isDefault must be a boolean value')
];

exports.preferencesValidator = [
    body('language')
        .optional()
        .isIn(['en', 'hi', 'es'])
        .withMessage('Invalid language selection'),
    body('currency')
        .optional()
        .isIn(['USD', 'INR', 'EUR'])
        .withMessage('Invalid currency selection'),
    body('notifications')
        .optional()
        .isObject()
        .withMessage('Notifications must be an object'),
    body('notifications.email')
        .optional()
        .isBoolean()
        .withMessage('Email notification preference must be boolean'),
    body('notifications.push')
        .optional()
        .isBoolean()
        .withMessage('Push notification preference must be boolean'),
    body('notifications.orderUpdates')
        .optional()
        .isBoolean()
        .withMessage('Order updates preference must be boolean'),
    body('notifications.promotions')
        .optional()
        .isBoolean()
        .withMessage('Promotions preference must be boolean')
];
