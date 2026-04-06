const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other'],
    },
    brand: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
