const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { checkoutValidator } = require('../validators/checkout.validator');
const {
    initiateCheckout,
    confirmOrder,
    getOrderSummary,
    initiateRefund
} = require('../controllers/checkout.controller');

const router = express.Router();

// Protect all routes
router.use(auth);

router.post(
    '/initiate',
    initiateCheckout
);

router.post(
    '/confirm',
    validate(checkoutValidator),
    confirmOrder
);

router.get(
    '/order/:orderId',
    getOrderSummary
);

router.post(
    '/refund/:orderId',
    initiateRefund
);

module.exports = router;
