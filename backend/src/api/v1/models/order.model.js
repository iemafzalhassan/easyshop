const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    streetAddress: {
        type: String,
        required: [true, 'Street address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    pinCode: {
        type: String,
        required: [true, 'PIN code is required'],
        match: [/^[0-9]{6}$/, 'PIN code must be 6 digits']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user']
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Order item must have a product']
        },
        quantity: {
            type: Number,
            required: [true, 'Order item must have a quantity'],
            min: [1, 'Quantity must be at least 1'],
            max: [5, 'Quantity cannot exceed 5']
        },
        price: {
            type: Number,
            required: [true, 'Order item must have a price']
        }
    }],
    shippingAddress: {
        type: addressSchema,
        required: [true, 'Shipping address is required']
    },
    billingAddress: {
        type: addressSchema,
        required: [true, 'Billing address is required']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: {
            values: ['card', 'upi', 'netbanking', 'cod'],
            message: 'Invalid payment method'
        }
    },
    totalAmount: {
        type: Number,
        required: [true, 'Order must have a total amount']
    },
    status: {
        type: String,
        required: [true, 'Order must have a status'],
        enum: {
            values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            message: 'Invalid order status'
        },
        default: 'pending'
    }
}, {
    timestamps: true
});

// Populate product details when querying orders
orderSchema.pre(/^find/, function(next) {
    this.populate('items.product');
    next();
});

module.exports = mongoose.model('Order', orderSchema);
