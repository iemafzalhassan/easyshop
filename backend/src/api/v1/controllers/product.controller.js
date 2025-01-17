// src/api/v1/controllers/product.controller.js
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res) => {
    const productData = {
        ...req.body,
        shop: req.user._id  // Changed from seller to shop to match model schema
    };

    // Check for required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'image'];
    for (const field of requiredFields) {
        if (!productData[field]) {
            throw new AppError(`${field} is required`, 400);
        }
    }

    const product = await Product.create(productData);

    res.status(201).json({
        status: 'success',
        data: { product }
    });
});

exports.getAllProducts = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Filter by category
    if (req.query.category) {
        query.category = req.query.category;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Search by name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by shop
    if (req.query.shop) {
        query.shop = req.query.shop;
    }

    const products = await Product.find(query)
        .populate('shop', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalProducts: total
            }
        }
    });
});

exports.getProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('shop', 'name email');

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { product }
    });
});

exports.updateProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Check if user owns the shop
    if (product.shop.toString() !== req.user._id.toString()) {
        throw new AppError('You are not authorized to update this product', 403);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        {
            new: true,
            runValidators: true
        }
    ).populate('shop', 'name email');

    res.status(200).json({
        status: 'success',
        data: { product: updatedProduct }
    });
});

exports.deleteProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Check if user owns the shop
    if (product.shop.toString() !== req.user._id.toString()) {
        throw new AppError('You are not authorized to delete this product', 403);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});