const express = require('express');
const { auth, restrictTo } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { trackingUpdateValidator } = require('../validators/tracking.validator');
const {
    getOrderTracking,
    addTrackingUpdate,
    confirmDelivery
} = require('../controllers/tracking.controller');

const router = express.Router();

// Protect all routes
router.use(auth);

// Get tracking information for an order
router.get(
    '/orders/:orderId/tracking',
    getOrderTracking
);

// Add tracking update (admin only)
router.post(
    '/orders/:orderId/tracking',
    restrictTo('admin'),
    validate(trackingUpdateValidator),
    addTrackingUpdate
);

// Confirm delivery (user only)
router.patch(
    '/orders/:orderId/confirm-delivery',
    confirmDelivery
);

module.exports = router;
