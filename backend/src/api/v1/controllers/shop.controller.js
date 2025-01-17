const Shop = require('../models/shop.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getShops = catchAsync(async (req, res) => {
  const {
    category,
    rating,
    sortBy,
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  if (category) query.categories = category;
  if (rating) query.rating = { $gte: Number(rating) };

  const sortOptions = {
    'rating': { rating: -1 },
    'products': { productsCount: -1 },
    'newest': { createdAt: -1 },
    'oldest': { createdAt: 1 }
  };

  const sortOption = sortOptions[sortBy] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const shops = await Shop.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate('owner', 'name email');

  const total = await Shop.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: shops.length,
    data: {
      shops,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalShops: total
      }
    }
  });
});

exports.getShop = catchAsync(async (req, res) => {
  const shop = await Shop.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('products');

  if (!shop) {
    throw new AppError('Shop not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { shop }
  });
});

exports.createShop = catchAsync(async (req, res) => {
  // Check if user already has a shop
  const existingShop = await Shop.findOne({ owner: req.user._id });
  if (existingShop) {
    throw new AppError('You already have a shop', 400);
  }

  const shop = await Shop.create({
    ...req.body,
    owner: req.user._id
  });

  await shop.populate('owner', 'name email');

  res.status(201).json({
    status: 'success',
    data: { shop }
  });
});

exports.updateShop = catchAsync(async (req, res) => {
  const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });

  if (!shop) {
    throw new AppError('Shop not found or you are not the owner', 404);
  }

  // Remove fields that shouldn't be updated directly
  delete req.body.owner;
  delete req.body.rating;
  delete req.body.productsCount;

  Object.assign(shop, req.body);
  await shop.save();

  await shop.populate('owner', 'name email');

  res.status(200).json({
    status: 'success',
    data: { shop }
  });
});

exports.deleteShop = catchAsync(async (req, res) => {
  const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });

  if (!shop) {
    throw new AppError('Shop not found or you are not the owner', 404);
  }

  await shop.remove();

  res.status(204).json({
    status: 'success',
    data: null
  });
});
