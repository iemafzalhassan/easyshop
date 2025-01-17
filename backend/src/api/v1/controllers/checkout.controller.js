const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const paymentService = require('../../../services/payment.service');
const emailService = require('../../../services/email.service');

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
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            total: itemTotal
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
        items: items.map(item => ({
            id: item.product,
            quantity: item.quantity,
            price: item.price
        })),
        shipping: {
            cost: shippingCost,
            address: req.body.shippingAddress
        },
        totalAmount
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
        event = paymentService.constructWebhookEvent(req.body, sig);
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

// Helper function to calculate shipping cost
function calculateShippingCost(items) {
    // Base shipping cost
    let cost = 5;

    // Calculate based on total items and weight
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add $2 for every 5 items
    cost += Math.floor(totalItems / 5) * 2;

    // Cap at $20
    return Math.min(cost, 20);
}

// Removed the following functions as they were not present in the updated code
// exports.getOrderSummary = catchAsync(async (req, res, next) => {
//     ...
// });

// exports.initiateRefund = catchAsync(async (req, res, next) => {
//     ...
// });
