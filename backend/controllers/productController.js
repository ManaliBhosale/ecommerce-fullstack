const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const ALLOWED_CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other'];

    const query = {};

    if (keyword) {
      // Sanitize keyword: strip special chars that could be exploited
      const sanitizedKeyword = String(keyword).replace(/[${}]/g, '').trim();
      if (sanitizedKeyword) {
        query.$text = { $search: sanitizedKeyword };
      }
    }
    if (category) {
      // Validate category against allowed list
      const sanitizedCategory = String(category).trim();
      if (ALLOWED_CATEGORIES.includes(sanitizedCategory)) {
        query.category = sanitizedCategory;
      }
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
