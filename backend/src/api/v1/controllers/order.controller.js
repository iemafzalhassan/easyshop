const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
    const { items, shippingAddress, billingAddress, paymentMethod, totalAmount } = req.body;

    // Validate products and calculate total
    let calculatedTotal = 0;
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return next(new AppError(`Product not found with ID: ${item.product}`, 404));
        }
        
        // Verify price matches (all prices in INR)
        if (Math.abs(product.price - item.price) > 0.01) {
            return next(new AppError(`Price mismatch for product: ${product.name}. Expected: ₹${product.price}, Got: ₹${item.price}`, 400));
        }

        calculatedTotal += product.price * item.quantity;
    }

    // Add shipping cost if total is less than ₹1000
    const shippingCost = calculatedTotal > 1000 ? 0 : 100;
    calculatedTotal += shippingCost;

    // Verify total amount (allowing for small floating point differences)
    if (Math.abs(calculatedTotal - totalAmount) > 1) {
        return next(new AppError(`Total amount mismatch. Expected: ₹${calculatedTotal}, Got: ₹${totalAmount}`, 400));
    }

    // Create order
    const order = await Order.create({
        user: req.user._id,
        items: items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price // Price in INR
        })),
        shippingAddress: {
            streetAddress: shippingAddress.streetAddress,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: shippingAddress.country,
            pinCode: shippingAddress.pinCode,
            phone: shippingAddress.phone
        },
        billingAddress: {
            streetAddress: billingAddress.streetAddress,
            city: billingAddress.city,
            state: billingAddress.state,
            country: billingAddress.country,
            pinCode: billingAddress.pinCode,
            phone: billingAddress.phone
        },
        paymentMethod,
        totalAmount, // Total in INR
        status: 'pending'
    });

    // Clear user's cart
    await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [] },
        { new: true }
    );

    res.status(201).json({
        status: 'success',
        data: {
            order
        }
    });
});

exports.getOrders = catchAsync(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('items.product')
        .sort('-createdAt');

    res.json({
        status: 'success',
        data: {
            orders
        }
    });
});

exports.getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    }).populate('items.product');

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    res.json({
        status: 'success',
        data: {
            order
        }
    });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    if (order.status !== 'pending') {
        return next(new AppError('Cannot cancel order at this stage', 400));
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
        status: 'success',
        data: {
            order
        }
    });
});

exports.getAllOrders = catchAsync(async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product')
        .sort('-createdAt');

    res.json({
        status: 'success',
        data: {
            orders
        }
    });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    order.status = status;
    await order.save();

    res.json({
        status: 'success',
        data: {
            order
        }
    });
});
