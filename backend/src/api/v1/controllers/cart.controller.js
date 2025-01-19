const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const MAX_RETRIES = 3;
const MAX_QUANTITY_PER_ITEM = 5;

const retryOperation = async (operation) => {
    let lastError;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (!error.name === 'VersionError') {
                throw error;
            }
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 50 * Math.pow(2, attempt)));
        }
    }
    
    throw lastError;
};

exports.getCart = catchAsync(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product', 'name price images stock');

    if (!cart) {
        // Create new cart if doesn't exist
        const newCart = await Cart.create({ user: req.user._id, items: [] });
        return res.status(200).json({
            status: 'success',
            data: { cart: newCart }
        });
    }

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

exports.addToCart = catchAsync(async (req, res) => {
    const { productId, quantity = 1, color, size } = req.body;

    if (quantity > MAX_QUANTITY_PER_ITEM) {
        throw new AppError(`Maximum quantity allowed per item is ${MAX_QUANTITY_PER_ITEM}`, 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
        throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }

    const result = await retryOperation(async () => {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{
                    product: productId,
                    quantity,
                    color: color || null,
                    size: size || null,
                    price: product.price
                }]
            });
        } else {
            const existingItem = cart.items.find(item => 
                item.product.toString() === productId &&
                item.color === (color || null) &&
                item.size === (size || null)
            );

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > MAX_QUANTITY_PER_ITEM) {
                    throw new AppError(`Cannot add more than ${MAX_QUANTITY_PER_ITEM} items of the same product`, 400);
                }
                if (product.stock < newQuantity) {
                    throw new AppError(`Only ${product.stock} items available in stock`, 400);
                }
                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity,
                    color: color || null,
                    size: size || null,
                    price: product.price
                });
            }

            await cart.save();
        }

        await cart.populate('items.product', 'name price images stock');
        return cart;
    });

    res.status(200).json({
        status: 'success',
        data: { cart: result }
    });
});

exports.updateCartItem = catchAsync(async (req, res) => {
    const { productId, quantity, color, size } = req.body;

    if (quantity > MAX_QUANTITY_PER_ITEM) {
        throw new AppError(`Maximum quantity allowed per item is ${MAX_QUANTITY_PER_ITEM}`, 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
        throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }

    const result = await retryOperation(async () => {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            throw new AppError('Cart not found', 404);
        }

        const item = cart.items.find(item => 
            item.product.toString() === productId &&
            item.color === (color || null) &&
            item.size === (size || null)
        );

        if (!item) {
            throw new AppError('Product not found in cart', 404);
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product', 'name price images stock');
        return cart;
    });

    res.status(200).json({
        status: 'success',
        data: { cart: result }
    });
});

exports.removeFromCart = catchAsync(async (req, res) => {
    const result = await retryOperation(async () => {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            throw new AppError('Cart not found', 404);
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === req.params.itemId
        );

        if (itemIndex === -1) {
            throw new AppError('Product not found in cart', 404);
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate('items.product', 'name price images stock');
        return cart;
    });

    res.status(200).json({
        status: 'success',
        data: { cart: result }
    });
});

exports.clearCart = catchAsync(async (req, res) => {
    const result = await retryOperation(async () => {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            throw new AppError('Cart not found', 404);
        }

        await cart.clearCart();
        return cart;
    });

    res.status(200).json({
        status: 'success',
        data: { cart: result }
    });
});

exports.syncCart = catchAsync(async (req, res) => {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
        throw new AppError('Items must be an array', 400);
    }

    // Validate products and collect data
    const productsMap = new Map();
    const validatedItems = [];

    // First, get all products in one query
    const productIds = [...new Set(items.map(item => item.productId))];
    const products = await Product.find({ _id: { $in: productIds } });
    products.forEach(product => productsMap.set(product._id.toString(), product));

    // Validate items
    for (const item of items) {
        const { productId, quantity, color, size } = item;
        
        if (quantity > MAX_QUANTITY_PER_ITEM) {
            throw new AppError(`Maximum quantity allowed per item is ${MAX_QUANTITY_PER_ITEM}`, 400);
        }

        const product = productsMap.get(productId);
        if (!product) {
            throw new AppError(`Product with ID ${productId} not found`, 404);
        }

        if (product.stock < quantity) {
            throw new AppError(`Only ${product.stock} items available for ${product.name}`, 400);
        }

        validatedItems.push({
            product: productId,
            quantity,
            color: color || null,
            size: size || null,
            price: product.price
        });
    }

    const result = await retryOperation(async () => {
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({ user: req.user._id });
        }

        cart.items = validatedItems;
        await cart.save();
        await cart.populate('items.product', 'name price images stock');
        return cart;
    });

    res.status(200).json({
        status: 'success',
        data: { cart: result }
    });
});
