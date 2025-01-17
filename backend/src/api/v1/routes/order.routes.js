const express = require('express');
const { auth, restrictTo } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { 
    createOrderValidator,
    updateOrderStatusValidator
} = require('../validators/order.validator');
const {
    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/order.controller');

const router = express.Router();

// Protect all routes
router.use(auth);

// User routes
router
    .route('/')
    .get(getOrders)
    .post(validate(createOrderValidator), createOrder);

router
    .route('/:id')
    .get(getOrder)
    .delete(cancelOrder);

// Admin routes
router
    .route('/admin/orders')
    .get(restrictTo('admin'), getAllOrders);

router
    .route('/admin/orders/:id/status')
    .patch(
        restrictTo('admin'),
        validate(updateOrderStatusValidator),
        updateOrderStatus
    );

module.exports = router;
