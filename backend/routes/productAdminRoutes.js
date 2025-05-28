const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route  GET /api/admin/products
// @desc   Get all products
// @access Private/Admin
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;