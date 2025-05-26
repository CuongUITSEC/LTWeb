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
    const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;
    if(!checkoutItems || checkoutItems.length === 0 || !shippingAddress || !paymentMethod || !totalPrice) {
        return res.status(400).json({message: 'All fields are required'});
    }
    try{
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
        console.error("Error Creating checkout session",error);
        return res.status(500).json({message: 'Server error'});
    }
})

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
router.put('/:id/pay', authMiddleware, async (req, res) => {
    const {paymentStatus, paymentDetails} = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({message: 'Checkout not found'});
        }
        if(paymentStatus === 'Paid') {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paidAt = new Date();
            checkout.paymentDetails = paymentDetails;
            await checkout.save();
            res.status(200).json(checkout);
        }
        else {
            return res.status(400).json({message: 'Invalid payment status'});
        }
    } catch (error) {
        console.error("Error updating checkout payment status", error);
        return res.status(500).json({message: 'Server error'});
    }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to order after payment confirmation
// @access Private
router.post('/:id/finalize', authMiddleware, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({message: 'Checkout not found'});
        }
        if(checkout.isPaid && !checkout.isFinalized) {
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: new Date(),
                isDelivered: false,
                paymentStatus: "Paid",
                paymentDetails: checkout.paymentDetails
            });
            // Mark checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            // Delete the cart associated with the user
            await Cart.findOneAndDelete({user: checkout.user});
            res.status(201).json(finalOrder);
        } else if (checkout.isFinalized) {
            return res.status(400).json({message: 'Checkout already finalized'});
        } else {
            return res.status(400).json({message: 'Checkout not paid'});
        }
    } catch (error) {
        console.error("Error finalizing checkout", error);
        return res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;