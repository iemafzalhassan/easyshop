const express = require('express');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const shopRoutes = require('./shop.routes');
const profileRoutes = require('./profile.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const checkoutRoutes = require('./checkout.routes');
const trackingRoutes = require('./tracking.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/shops', shopRoutes);
router.use('/profile', profileRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/tracking', trackingRoutes);

module.exports = router;
