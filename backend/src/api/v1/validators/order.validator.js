const { body } = require('express-validator');

exports.createOrderValidator = [
    body('shippingAddress')
        .isObject()
        .withMessage('Shipping address is required'),
    body('shippingAddress.street')
        .notEmpty()
        .withMessage('Street address is required'),
    body('shippingAddress.city')
        .notEmpty()
        .withMessage('City is required'),
    body('shippingAddress.state')
        .notEmpty()
        .withMessage('State is required'),
    body('shippingAddress.country')
        .notEmpty()
        .withMessage('Country is required'),
    body('shippingAddress.pinCode')
        .notEmpty()
        .withMessage('PIN code is required')
        .matches(/^[0-9]{6}$/)
        .withMessage('Invalid PIN code'),
    body('shippingAddress.phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/)
        .withMessage('Invalid phone number'),
    body('paymentInfo')
        .isObject()
        .withMessage('Payment information is required'),
    body('paymentInfo.method')
        .isIn(['card', 'upi', 'netbanking', 'cod'])
        .withMessage('Invalid payment method')
];

exports.updateOrderStatusValidator = [
    body('orderStatus')
        .isIn(['processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
    body('trackingInfo')
        .optional()
        .isObject()
        .withMessage('Tracking info must be an object'),
    body('trackingInfo.carrier')
        .optional()
        .notEmpty()
        .withMessage('Carrier name is required'),
    body('trackingInfo.trackingNumber')
        .optional()
        .notEmpty()
        .withMessage('Tracking number is required')
];
