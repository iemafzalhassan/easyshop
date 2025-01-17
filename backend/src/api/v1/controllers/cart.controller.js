const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCart = catchAsync(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product', 'name price images');

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

exports.addToCart = catchAsync(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Check if product is in stock
    if (product.stock < quantity) {
        throw new AppError('Product is out of stock', 400);
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity }]
        });
    } else {
        // Check if product already exists in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            if (product.stock < newQuantity) {
                throw new AppError('Requested quantity exceeds available stock', 400);
            }
            cart.items[itemIndex].quantity = newQuantity;
        } else {
            // Product does not exists in cart, add new item
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
    }

    // Populate product details
    await cart.populate('items.product', 'name price images');

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

exports.updateCartItem = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Check if product is in stock
    if (product.stock < quantity) {
        throw new AppError('Requested quantity exceeds available stock', 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        throw new AppError('Product not found in cart', 404);
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images');

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

exports.removeFromCart = catchAsync(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    // Remove item from cart
    cart.items = cart.items.filter(
        item => item.product.toString() !== productId
    );

    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images');

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

exports.clearCart = catchAsync(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    cart.items = [];
    await cart.save();

    res.status(204).json({
        status: 'success',
        data: null
    });
});
