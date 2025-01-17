const express = require('express');
const { auth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');
const {
    profileUpdateValidator,
    addressValidator,
    preferencesValidator
} = require('../validators/profile.validator');
const {
    getProfile,
    updateProfile,
    updateAvatar,
    addAddress,
    updateAddress,
    deleteAddress,
    addToWishlist,
    removeFromWishlist,
    updatePreferences,
    getRecentlyViewed,
    addToRecentlyViewed
} = require('../controllers/profile.controller');

const router = express.Router();

// Protect all routes
router.use(auth);

// Profile routes
router
    .route('/')
    .get(getProfile)
    .patch(validate(profileUpdateValidator), updateProfile);

router.patch(
    '/avatar',
    uploadImage.single('avatar'),
    updateAvatar
);

// Address routes
router
    .route('/addresses')
    .post(validate(addressValidator), addAddress);

router
    .route('/addresses/:addressId')
    .patch(validate(addressValidator), updateAddress)
    .delete(deleteAddress);

// Wishlist routes
router
    .route('/wishlist/:productId')
    .post(addToWishlist)
    .delete(removeFromWishlist);

// Preferences routes
router.patch(
    '/preferences',
    validate(preferencesValidator),
    updatePreferences
);

// Recently viewed routes
router
    .route('/recently-viewed')
    .get(getRecentlyViewed);

router.post(
    '/recently-viewed/:productId',
    addToRecentlyViewed
);

module.exports = router;
