const Order = require('../models/order.model');
const TrackingUpdate = require('../models/tracking.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../../../services/email.service');

exports.getOrderTracking = catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.orderId)
        .populate('trackingUpdates')
        .populate('user', 'email');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to view this order tracking', 403);
    }

    // Calculate estimated delivery date based on order status and creation date
    let estimatedDelivery = new Date(order.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // Default 7 days delivery estimate

    res.status(200).json({
        status: 'success',
        data: {
            order,
            estimatedDelivery,
            trackingUpdates: order.trackingUpdates
        }
    });
});

exports.addTrackingUpdate = catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.orderId)
        .populate('user', 'email');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Only allow sellers to add tracking updates
    const product = await Product.findById(order.items[0].product);
    if (product.seller.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to add tracking updates for this order', 403);
    }

    const trackingUpdate = await TrackingUpdate.create({
        order: order._id,
        status: req.body.status,
        location: req.body.location,
        description: req.body.description,
        updatedBy: req.user._id
    });

    // Add tracking update to order
    order.trackingUpdates.push(trackingUpdate._id);
    
    // Update order status if provided
    if (req.body.orderStatus) {
        order.status = req.body.orderStatus;
    }

    await order.save();

    // Send email notification
    if (order.user.email) {
        await emailService.sendTrackingUpdateEmail(
            order.user.email,
            order.orderNumber,
            trackingUpdate
        );
    }

    res.status(201).json({
        status: 'success',
        data: { trackingUpdate }
    });
});

exports.getTrackingUpdate = catchAsync(async (req, res) => {
    const trackingUpdate = await TrackingUpdate.findById(req.params.updateId)
        .populate('order')
        .populate('updatedBy', 'name');

    if (!trackingUpdate) {
        throw new AppError('Tracking update not found', 404);
    }

    // Check if user is authorized to view this tracking update
    const order = trackingUpdate.order;
    if (order.user.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to view this tracking update', 403);
    }

    res.status(200).json({
        status: 'success',
        data: { trackingUpdate }
    });
});

exports.updateTrackingUpdate = catchAsync(async (req, res) => {
    const trackingUpdate = await TrackingUpdate.findById(req.params.updateId)
        .populate('order');

    if (!trackingUpdate) {
        throw new AppError('Tracking update not found', 404);
    }

    // Only allow the user who created the update to modify it
    if (trackingUpdate.updatedBy.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to modify this tracking update', 403);
    }

    // Only allow updates within 24 hours of creation
    const timeDiff = Date.now() - trackingUpdate.createdAt;
    if (timeDiff > 24 * 60 * 60 * 1000) {
        throw new AppError('Tracking updates can only be modified within 24 hours of creation', 400);
    }

    Object.assign(trackingUpdate, req.body);
    await trackingUpdate.save();

    res.status(200).json({
        status: 'success',
        data: { trackingUpdate }
    });
});

exports.deleteTrackingUpdate = catchAsync(async (req, res) => {
    const trackingUpdate = await TrackingUpdate.findById(req.params.updateId)
        .populate('order');

    if (!trackingUpdate) {
        throw new AppError('Tracking update not found', 404);
    }

    // Only allow the user who created the update to delete it
    if (trackingUpdate.updatedBy.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to delete this tracking update', 403);
    }

    // Only allow deletion within 24 hours of creation
    const timeDiff = Date.now() - trackingUpdate.createdAt;
    if (timeDiff > 24 * 60 * 60 * 1000) {
        throw new AppError('Tracking updates can only be deleted within 24 hours of creation', 400);
    }

    // Remove tracking update from order
    const order = trackingUpdate.order;
    order.trackingUpdates = order.trackingUpdates.filter(
        update => update.toString() !== trackingUpdate._id.toString()
    );
    await order.save();

    await trackingUpdate.remove();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.confirmDelivery = catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.orderId)
        .populate('trackingUpdates');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Only allow the order owner to confirm delivery
    if (order.user.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to confirm delivery for this order', 403);
    }

    // Check if order is in shipped status
    if (order.status !== 'shipped') {
        throw new AppError('Can only confirm delivery for shipped orders', 400);
    }

    // Update order status to delivered
    order.status = 'delivered';
    
    // Add a tracking update for delivery confirmation
    const trackingUpdate = await TrackingUpdate.create({
        order: order._id,
        status: 'delivered',
        location: 'Delivery Address',
        description: 'Package delivered and confirmed by customer',
        updatedBy: req.user._id
    });

    order.trackingUpdates.push(trackingUpdate._id);
    await order.save();

    res.status(200).json({
        status: 'success',
        data: { order }
    });
});
