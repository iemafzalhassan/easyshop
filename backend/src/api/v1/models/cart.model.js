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
        min: [1, 'Quantity cannot be less than 1'],
        max: [5, 'Maximum 5 items allowed per product']
    },
    color: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
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
    },
    version: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    optimisticConcurrency: true
});

// Calculate total price before saving
cartSchema.pre('save', async function(next) {
    // Increment version on every save
    if (!this.isNew) {
        this.version += 1;
    }

    // Calculate total price
    if (this.items.length > 0) {
        this.totalPrice = this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    } else {
        this.totalPrice = 0;
    }
    next();
});

// Add methods to check stock availability
cartSchema.methods.checkStock = async function() {
    const Product = mongoose.model('Product');
    const stockErrors = [];

    // Get all products in one query
    const productIds = this.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productsMap = new Map(products.map(p => [p._id.toString(), p]));

    for (const item of this.items) {
        const product = productsMap.get(item.product.toString());
        if (!product) {
            stockErrors.push(`Product ${item.product} not found`);
            continue;
        }
        if (product.stock < item.quantity) {
            stockErrors.push(`Only ${product.stock} items available for ${product.name}`);
        }
    }

    return stockErrors;
};

// Add method to clear cart
cartSchema.methods.clearCart = async function() {
    this.items = [];
    this.totalPrice = 0;
    await this.save();
};

// Add method to validate cart items
cartSchema.methods.validateItems = async function() {
    const Product = mongoose.model('Product');
    const errors = [];
    let totalPrice = 0;

    // Get all products in one query
    const productIds = this.items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productsMap = new Map(products.map(p => [p._id.toString(), p]));

    for (const item of this.items) {
        const product = productsMap.get(item.product.toString());
        
        if (!product) {
            errors.push(`Product ${item.product} not found`);
            continue;
        }

        if (item.quantity > 5) {
            errors.push(`Maximum 5 items allowed for ${product.name}`);
        }

        if (product.stock < item.quantity) {
            errors.push(`Only ${product.stock} items available for ${product.name}`);
        }

        // Update price from product
        item.price = product.price;
        totalPrice += product.price * item.quantity;
    }

    this.totalPrice = totalPrice;
    return errors;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
