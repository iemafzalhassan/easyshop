const mongoose = require('mongoose');

const trackingUpdateSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
trackingUpdateSchema.index({ order: 1, timestamp: -1 });

const TrackingUpdate = mongoose.model('TrackingUpdate', trackingUpdateSchema);

module.exports = TrackingUpdate;
