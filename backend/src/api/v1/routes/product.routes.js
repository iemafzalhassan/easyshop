// src/api/v1/routes/product.routes.js
const express = require('express');
const { auth, restrictTo } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { 
    createProductValidator,
    updateProductValidator
} = require('../validators/product.validator');
const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
} = require('../controllers/product.controller');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Admin/Seller routes
router
    .route('/')
    .post(
        auth,
        restrictTo('admin', 'seller'),
        validate(createProductValidator),
        createProduct
    );

router
    .route('/:id')
    .patch(
        auth,
        restrictTo('admin', 'seller'),
        validate(updateProductValidator),
        updateProduct
    )
    .delete(
        auth,
        restrictTo('admin', 'seller'),
        deleteProduct
    );

module.exports = router;