const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const paymentService = require('../../../services/payment.service');
const emailService = require('../../../services/email.service');

// Helper function to calculate shipping cost
const calculateShippingCost = (items) => {
    // Base shipping cost
    let shippingCost = 50;

    // Add ₹10 for each additional item
    if (items.length > 1) {
        shippingCost += (items.length - 1) * 10;
    }

    // Free shipping for orders over ₹1000
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalAmount >= 1000) {
        shippingCost = 0;
    }

    return shippingCost;
};

// Helper function to handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
    const order = await Order.findOne({ paymentId: paymentIntent.id });
    if (!order) {
        console.error('Order not found for payment:', paymentIntent.id);
        return;
    }

    order.paymentStatus = 'paid';
    order.status = 'processing';
    await order.save();

    // Send confirmation email
    await emailService.sendOrderConfirmationEmail(
        order.user.email,
        order
    );
};

// Helper function to handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
    const order = await Order.findOne({ paymentId: paymentIntent.id });
    if (!order) {
        console.error('Order not found for payment:', paymentIntent.id);
        return;
    }

    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
        });
    }
};

exports.initiateCheckout = catchAsync(async (req, res) => {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
    }

    // Verify stock availability and calculate total
    let totalAmount = 0;
    const items = [];

    for (const item of cart.items) {
        if (!item.product) {
            throw new AppError('One or more products no longer exist', 400);
        }

        if (item.product.stock < item.quantity) {
            throw new AppError(`Not enough stock for ${item.product.name}`, 400);
        }

        const itemTotal = item.product.price * item.quantity;
        totalAmount += itemTotal;

        items.push({
            name: item.product.name,
            description: item.product.description,
            images: item.product.images,
            price: item.product.price,
            quantity: item.quantity
        });
    }

    // Add shipping cost if applicable
    const shippingCost = calculateShippingCost(cart.items);
    totalAmount += shippingCost;

    // Create checkout session
    const session = await paymentService.createCheckoutSession({
        customer: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name
        },
        items,
        shipping: {
            cost: shippingCost,
            address: req.body.shippingAddress
        }
    });

    res.status(200).json({
        status: 'success',
        data: {
            sessionId: session.id,
            url: session.url
        }
    });
});

exports.confirmPayment = catchAsync(async (req, res) => {
    const { sessionId } = req.params;

    // Verify payment session
    const session = await paymentService.verifySession(sessionId);
    if (!session) {
        throw new AppError('Invalid or expired payment session', 400);
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
    }

    // Create order
    const order = await Order.create({
        user: req.user._id,
        items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        })),
        totalAmount: session.amount_total / 100, // Convert from cents
        shippingAddress: session.shipping.address,
        paymentStatus: 'paid',
        paymentId: session.payment_intent
    });

    // Update product stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity }
        });
    }

    // Clear cart
    await cart.clearCart();

    // Send confirmation email
    await emailService.sendOrderConfirmationEmail(
        req.user.email,
        order
    );

    res.status(200).json({
        status: 'success',
        data: { order }
    });
});

exports.webhookHandler = catchAsync(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = paymentService.verifyWebhookSignature(req.body, sig);
    } catch (err) {
        throw new AppError('Webhook signature verification failed', 400);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            await handlePaymentSuccess(event.data.object);
            break;
        case 'payment_intent.payment_failed':
            await handlePaymentFailure(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
});
