const express = require('express');
const Order = require('../models/Order');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;