const { body } = require('express-validator');

exports.trackingUpdateValidator = [
    body('status')
        .trim()
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid status'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
];
