const { body } = require('express-validator');

const addressValidation = (prefix) => [
    body(`${prefix}.streetAddress`)
        .exists()
        .withMessage('Street address is required')
        .notEmpty()
        .withMessage('Street address cannot be empty')
        .isString()
        .withMessage('Street address must be a string'),
    body(`${prefix}.city`)
        .exists()
        .withMessage('City is required')
        .notEmpty()
        .withMessage('City cannot be empty')
        .isString()
        .withMessage('City must be a string'),
    body(`${prefix}.state`)
        .exists()
        .withMessage('State is required')
        .notEmpty()
        .withMessage('State cannot be empty')
        .isString()
        .withMessage('State must be a string'),
    body(`${prefix}.country`)
        .exists()
        .withMessage('Country is required')
        .notEmpty()
        .withMessage('Country cannot be empty')
        .isString()
        .withMessage('Country must be a string'),
    body(`${prefix}.pinCode`)
        .exists()
        .withMessage('PIN code is required')
        .notEmpty()
        .withMessage('PIN code cannot be empty')
        .matches(/^[0-9]{6}$/)
        .withMessage('PIN code must be 6 digits'),
    body(`${prefix}.phone`)
        .exists()
        .withMessage('Phone number is required')
        .notEmpty()
        .withMessage('Phone number cannot be empty')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits')
];

exports.createOrderValidator = [
    body('items')
        .exists()
        .withMessage('Items are required')
        .isArray()
        .withMessage('Items must be an array')
        .notEmpty()
        .withMessage('Items cannot be empty'),
    body('items.*.product')
        .exists()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('items.*.quantity')
        .exists()
        .withMessage('Quantity is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Quantity must be between 1 and 5'),
    body('items.*.price')
        .exists()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    ...addressValidation('shippingAddress'),
    ...addressValidation('billingAddress'),
    body('paymentMethod')
        .exists()
        .withMessage('Payment method is required')
        .notEmpty()
        .withMessage('Payment method cannot be empty')
        .isIn(['card', 'upi', 'netbanking', 'cod'])
        .withMessage('Invalid payment method. Must be one of: card, upi, netbanking, cod'),
    body('totalAmount')
        .exists()
        .withMessage('Total amount is required')
        .isFloat({ min: 0 })
        .withMessage('Total amount must be a positive number')
];

exports.updateOrderStatusValidator = [
    body('status')
        .isIn(['processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status')
];
