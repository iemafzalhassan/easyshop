const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity cannot be less than 1']
    }
}, {
    timestamps: true
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate total price before saving
cartSchema.pre('save', async function(next) {
    if (this.items.length > 0) {
        const populatedCart = await this.populate('items.product', 'price');
        this.totalPrice = populatedCart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    } else {
        this.totalPrice = 0;
    }
    next();
});

// Add methods to check stock availability
cartSchema.methods.checkStock = async function() {
    const populatedCart = await this.populate('items.product', 'stock');
    const stockIssues = [];

    for (const item of this.items) {
        if (item.product.stock < item.quantity) {
            stockIssues.push({
                product: item.product._id,
                requested: item.quantity,
                available: item.product.stock
            });
        }
    }

    return stockIssues;
};

// Add method to clear cart
cartSchema.methods.clearCart = async function() {
    this.items = [];
    this.totalPrice = 0;
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
