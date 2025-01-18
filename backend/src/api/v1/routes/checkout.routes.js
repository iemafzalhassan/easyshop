const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { checkoutValidator } = require('../validators/checkout.validator');
const {
    initiateCheckout,
    confirmPayment,
    webhookHandler
} = require('../controllers/checkout.controller');

const router = express.Router();

// Protect all routes except webhook
router.post('/webhook', webhookHandler);
router.use(auth);

router.post(
    '/initiate',
    validate(checkoutValidator),
    initiateCheckout
);

router.post(
    '/confirm/:sessionId',
    confirmPayment
);

module.exports = router;
