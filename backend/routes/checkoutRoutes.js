const express = require('express');
const Checkout = require('../models/Checkout');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post('/', authMiddleware, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0 || !shippingAddress || !paymentMethod || !totalPrice) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Validate all products exist and have enough stock
        const productIds = checkoutItems.map(item => item.productId);
        const products = await Product.find({
            _id: { $in: productIds },
            isPublished: true
        });

        const productMap = new Map(
            products.map(p => [p._id.toString(), p])
        );

        // Check each item
        for (const item of checkoutItems) {
            const product = productMap.get(item.productId.toString());

            if (!product) {
                return res.status(400).json({
                    message: `Product ${item.name} is no longer available`
                });
            }

            if (product.countInStock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${item.name}. Available: ${product.countInStock}`
                });
            }
        }

        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: 'Pending',
            isPaid: false
        });

        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Error Creating checkout session", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put('/:id/pay', authMiddleware, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        // Verify checkout belongs to user
        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (paymentStatus === 'Paid') {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paidAt = new Date();
            checkout.paymentDetails = paymentDetails;
            await checkout.save();
            res.status(200).json(checkout);
        } else {
            return res.status(400).json({ message: 'Invalid payment status' });
        }
    } catch (error) {
        console.error("Error updating checkout payment status", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to order after payment confirmation
// @access Private
router.post('/:id/finalize', authMiddleware, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        // Verify checkout belongs to user
        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (!checkout.isFinalized) {
            // Final validation before creating order
            const productIds = checkout.checkoutItems.map(item => item.productId);
            const products = await Product.find({
                _id: { $in: productIds },
                isPublished: true
            });

            const productMap = new Map(
                products.map(p => [p._id.toString(), p])
            );

            // Update stock for each product
            for (const item of checkout.checkoutItems) {
                const product = productMap.get(item.productId.toString());

                if (!product) {
                    return res.status(400).json({
                        message: `Product ${item.name} is no longer available`
                    });
                }

                if (product.countInStock < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock for ${item.name}. Available: ${product.countInStock}`
                    });
                }

                // Reduce stock
                product.countInStock -= item.quantity;
                await product.save();
            }

            // Tạo order với trạng thái phù hợp với phương thức thanh toán
            const isPaidOrder = checkout.paymentMethod === 'bank_transfer';

            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: isPaidOrder, // true nếu là bank_transfer, false nếu là COD
                paidAt: isPaidOrder ? new Date() : null,
                isDelivered: false,
                paymentStatus: isPaidOrder ? "Paid" : "Pending",
                status: 'Processing'
            });

            // Mark checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            // Delete the cart
            if (checkout.user) {
                await Cart.findOneAndDelete({ user: checkout.user });
            } else if (checkout.guestId) {
                await Cart.findOneAndDelete({ guestId: checkout.guestId });
            }

            res.status(201).json(finalOrder);
        } else {
            return res.status(400).json({ message: 'Checkout already finalized' });
        }
    } catch (error) {
        console.error("Error finalizing checkout", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// @route GET /api/checkout/:id
// @desc Get checkout details
// @access Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id)
            .populate('user', 'name email')
            .populate('checkoutItems.productId', 'name price images');

        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }

        // Verify checkout belongs to user (unless admin)
        if (checkout.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.status(200).json(checkout);
    } catch (error) {
        console.error("Error fetching checkout", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;