const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { 
    addToCartValidator,
    updateCartItemValidator
} = require('../validators/cart.validator');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cart.controller');

const router = express.Router();

// All cart routes require authentication
router.use(auth);

router
    .route('/')
    .get(getCart)
    .post(validate(addToCartValidator), addToCart)
    .delete(clearCart);

router
    .route('/:itemId')
    .patch(validate(updateCartItemValidator), updateCartItem)
    .delete(removeFromCart);

module.exports = router;
