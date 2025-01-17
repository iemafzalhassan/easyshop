const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res) => {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
    }

    // Verify stock availability
    for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
            throw new AppError(`Not enough stock for ${item.product.name}`, 400);
        }
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
        user: req.user._id,
        items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        })),
        totalPrice,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod
    });

    // Update product stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity }
        });
    }

    // Clear cart
    await cart.clearCart();

    // Populate order details
    await order.populate([
        { path: 'user', select: 'name email' },
        { path: 'items.product', select: 'name price images' }
    ]);

    res.status(201).json({
        status: 'success',
        data: { order }
    });
});

exports.getOrders = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
        .populate([
            { path: 'user', select: 'name email' },
            { path: 'items.product', select: 'name price images' }
        ])
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalOrders: total
            }
        }
    });
});

exports.getOrder = catchAsync(async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    }).populate([
        { path: 'user', select: 'name email' },
        { path: 'items.product', select: 'name price images' }
    ]);

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { order }
    });
});

exports.updateOrder = catchAsync(async (req, res) => {
    const allowedUpdates = ['status', 'shippingAddress'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    const order = await Order.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
    ).populate([
        { path: 'user', select: 'name email' },
        { path: 'items.product', select: 'name price images' }
    ]);

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { order }
    });
});

exports.cancelOrder = catchAsync(async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    if (order.status !== 'pending') {
        throw new AppError('Order cannot be cancelled', 400);
    }

    // Restore product stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
        });
    }

    order.status = 'cancelled';
    await order.save();

    await order.populate([
        { path: 'user', select: 'name email' },
        { path: 'items.product', select: 'name price images' }
    ]);

    res.status(200).json({
        status: 'success',
        data: { order }
    });
});

// Admin only controllers
exports.getAllOrders = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = Order.find()
        .populate([
            { path: 'user', select: 'name email' },
            { path: 'items.product', select: 'name price images' }
        ])
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    if (req.query.status) {
        query.where('status').equals(req.query.status);
    }

    const orders = await query;
    const total = await Order.countDocuments();

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalOrders: total
            }
        }
    });
});

exports.updateOrderStatus = catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    order.status = req.body.status;
    
    if (req.body.trackingInfo) {
        order.trackingInfo = req.body.trackingInfo;
    }

    if (req.body.status === 'delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save();
    await order.populate([
        { path: 'user', select: 'name email' },
        { path: 'items.product', select: 'name price images' }
    ]);

    res.status(200).json({
        status: 'success',
        data: { order }
    });
});
