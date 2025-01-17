const express = require('express');
const { auth, restrictTo } = require('../middlewares/auth.middleware');
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop
} = require('../controllers/shop.controller');

const router = express.Router();

// Public routes
router.get('/', getShops);
router.get('/:id', getShop);

// Protected routes
router.post('/', auth, restrictTo('seller', 'admin'), createShop);
router.patch('/:id', auth, restrictTo('seller', 'admin'), updateShop);
router.delete('/:id', auth, restrictTo('seller', 'admin'), deleteShop);

module.exports = router;
