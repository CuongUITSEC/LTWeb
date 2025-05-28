const express = require('express');
const Order = require('../models/Order');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route  GET /api/admin/orders
// @desc   Get all orders (Only for Admin)
// @access Private/Admin
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email'); // Populate user details
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  PUT /api/admin/orders/:id
// @desc   Update order status by ID (Only for Admin)
// @access Private/Admin
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status || order.status; // Update status if provided
        order.isDelivered = status === 'Delivered' ? true : order.isDelivered; // Set isDelivered if status is Delivered
        order.deliveredAt = status === 'Delivered' ? new Date() : order.deliveredAt; // Set deliveredAt if status is Delivered

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  DELETE /api/admin/orders/:id
// @desc   Delete an order by ID (Only for Admin)
// @access Private/Admin
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.remove();
        res.json({ message: 'Order removed successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;