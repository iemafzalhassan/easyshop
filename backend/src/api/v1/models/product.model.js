const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  shop_category: {
    type: String,
    lowercase: true
  },
  image: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    get: function(image) {
      if (Array.isArray(image)) return image;
      return image ? [image] : [];
    }
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  unit_of_measure: {
    type: String,
    default: 'piece'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

// Create slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (!this.reviews || this.reviews.length === 0) {
    this.rating = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating = sum / this.reviews.length;
};

// Update rating when reviews are modified
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.calculateAverageRating();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
