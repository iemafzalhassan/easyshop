// src/api/v1/controllers/product.controller.js
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res) => {
    const productData = {
        ...req.body,
        shop: req.user._id
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
        query.category = req.query.category.toLowerCase();
    }
    
    // Filter by featured status
    if (req.query.featured === 'true') {
        query.featured = true;
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

    // Filter by stock availability
    if (req.query.inStock === 'true') {
        query.stock = { $gt: 0 };
    }

    console.log('Query:', JSON.stringify(query));
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    console.log('Total products found:', total);

    // Execute query with pagination
    const products = await Product.find(query)
        .sort(req.query.sort || '-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('shop', 'name email')
        .populate('reviews.user', 'name avatar');

    console.log('Products found:', products.length);
    
    // Transform products to ensure consistent format
    const transformedProducts = products.map(product => ({
        ...product.toObject(),
        image: Array.isArray(product.image) ? product.image : [product.image],
        rating: product.rating || 0,
        reviews: product.reviews || [],
        featured: product.featured || false,
        shop: product.shop || { _id: '', name: '' }
    }));

    // Send response
    res.status(200).json({
        status: 'success',
        results: transformedProducts.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: { 
            products: transformedProducts
        }
    });
});

exports.getProductsByCategory = catchAsync(async (req, res) => {
    const category = req.params.category.toLowerCase();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { category };
    
    // Add featured filter if requested
    if (req.query.featured === 'true') {
        query.featured = true;
    }

    // Add stock filter if requested
    if (req.query.inStock === 'true') {
        query.stock = { $gt: 0 };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .sort(req.query.sort || '-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('shop', 'name email')
        .populate('reviews.user', 'name avatar');

    res.status(200).json({
        status: 'success',
        results: products.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: { products }
    });
});

exports.getProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    // Try to find by ID first
    let product = await Product.findById(id)
        .populate('shop', 'name email')
        .populate('reviews.user', 'name avatar');

    // If not found by ID, try to find by slug
    if (!product && !id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findOne({ slug: id })
            .populate('shop', 'name email')
            .populate('reviews.user', 'name avatar');
    }

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            product: {
                ...product.toObject(),
                image: Array.isArray(product.image) ? product.image : [product.image],
                rating: product.rating || 0,
                reviews: product.reviews || [],
                featured: product.featured || false,
                shop: product.shop || { _id: '', name: '' }
            }
        }
    });
});

exports.updateProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Check if user is the owner or admin
    if (product.shop.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new AppError('You do not have permission to update this product', 403);
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
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

    // Check if user is the owner or admin
    if (product.shop.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new AppError('You do not have permission to delete this product', 403);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});