const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
