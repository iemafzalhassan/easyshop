const User = require('../models/user.model');
const Product = require('../models/product.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const path = require('path');
const fs = require('fs').promises;

exports.getProfile = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('wishlist', 'name price images')
        .populate('recentlyViewed.product', 'name price images')
        .select('-password');

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.updateProfile = catchAsync(async (req, res) => {
    const allowedFields = ['name', 'phone', 'preferences', 'shippingAddresses', 'defaultShippingAddress'];
    const updateData = {};

    Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
            updateData[key] = req.body[key];
        }
    });

    if (Object.keys(updateData).length === 0) {
        throw new AppError('No valid fields to update', 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
        status: 'success',
        data: { user: updatedUser }
    });
});

exports.updateAvatar = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new AppError('Please upload an image', 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, '../../../uploads');
        await fs.mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const ext = path.extname(req.file.originalname);
        const filename = `avatar-${user._id}${ext}`;
        const avatarPath = path.join(uploadsDir, filename);

        // Move file from temp upload location to permanent storage
        await fs.rename(req.file.path, avatarPath);

        // Delete old avatar if it exists and isn't the default
        if (user.avatar && !user.avatar.includes('default-avatar')) {
            const oldAvatarPath = path.join(uploadsDir, path.basename(user.avatar));
            try {
                await fs.unlink(oldAvatarPath);
            } catch (error) {
                console.error('Error deleting old avatar:', error);
                // Don't throw error if deleting old avatar fails
            }
        }

        // Update user avatar with relative path
        user.avatar = `/uploads/${filename}`;
        await user.save();

        // Return updated user without password
        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (error) {
        // If there's an error, make sure to clean up any uploaded file
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting uploaded file:', unlinkError);
            }
        }
        throw new AppError(error.message || 'Error updating avatar', error.statusCode || 500);
    }
});

exports.addAddress = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    // If this is the first address or marked as default
    if (user.addresses.length === 0 || req.body.isDefault) {
        // Set all other addresses to non-default
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                ...user.toObject(),
                password: undefined
            }
        }
    });
});

exports.updateAddress = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
        throw new AppError('Address not found', 404);
    }

    // If setting this address as default
    if (req.body.isDefault) {
        // Set all other addresses to non-default
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    // Update address fields
    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                ...user.toObject(),
                password: undefined
            }
        }
    });
});

exports.deleteAddress = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
        throw new AppError('Address not found', 404);
    }

    address.remove();
    await user.save();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.addToWishlist = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(product._id)) {
        throw new AppError('Product already in wishlist', 400);
    }

    user.wishlist.push(product._id);
    await user.save();

    await user.populate('wishlist', 'name price images');

    res.status(200).json({
        status: 'success',
        data: { wishlist: user.wishlist }
    });
});

exports.removeFromWishlist = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(req.params.productId)) {
        throw new AppError('Product not in wishlist', 404);
    }

    user.wishlist = user.wishlist.filter(
        id => id.toString() !== req.params.productId
    );
    await user.save();

    await user.populate('wishlist', 'name price images');

    res.status(200).json({
        status: 'success',
        data: { wishlist: user.wishlist }
    });
});

exports.getWishlist = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('wishlist', 'name price images')
        .select('wishlist');

    res.status(200).json({
        status: 'success',
        data: { wishlist: user.wishlist }
    });
});

exports.addToRecentlyViewed = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const user = await User.findById(req.user._id);
    
    // Remove if product already exists in recently viewed
    user.recentlyViewed = user.recentlyViewed.filter(
        item => item.product.toString() !== product._id.toString()
    );

    // Add to start of array
    user.recentlyViewed.unshift({
        product: product._id,
        viewedAt: Date.now()
    });

    // Keep only last 20 items
    if (user.recentlyViewed.length > 20) {
        user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    }

    await user.save();
    await user.populate('recentlyViewed.product', 'name price images');

    res.status(200).json({
        status: 'success',
        data: { recentlyViewed: user.recentlyViewed }
    });
});

exports.getRecentlyViewed = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('recentlyViewed.product', 'name price images')
        .select('recentlyViewed');

    res.status(200).json({
        status: 'success',
        data: { recentlyViewed: user.recentlyViewed }
    });
});

exports.clearRecentlyViewed = catchAsync(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        recentlyViewed: []
    });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.updatePreferences = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    // Update preferences
    user.preferences = {
        ...user.preferences,
        ...req.body
    };

    await user.save();

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                ...user.toObject(),
                password: undefined
            }
        }
    });
});
