const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const router = express.Router();

// Helper function to get a cart by user ID or guest ID
const getCartByUserOrGuestId = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// @route POST /api/cart
// @desc Add item to cart for a guest or logged-in user
// @access Public
router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        // Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Determine if the user is logged in or a guest
        let cart = await getCartByUserOrGuestId(userId, guestId);
        // If cart exists, update it
        if(cart) {
            const productIndex = cart.products.findIndex(
                (p) => 
                p.productId.toString() === productId && 
                p.size === size && 
                p.color === color
            );
            if (productIndex > -1) {
                // If the product already exists in the cart, update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // If the product does not exist, add it to the cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    quantity,
                    size,
                    color
                });
            }
            // Recalculate total price
            cart.totalPrice = cart.products.reduce((total, item) => 
                total + item.price * item.quantity, 0
                );
            // Save the updated cart
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // If no cart exists, create a new one
            const newCart = new Cart({
                user: userId ? userId : undefined,
                guestId : guestId ? guestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    quantity,
                    size,
                    color
                }],
                totalPrice: product.price * quantity,
            });
            await newCart.save();
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// @route PUT /api/cart
// @desc Update item in cart for a guest or logged-in user
// @access Public
router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        // Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Get the cart by user ID or guest ID
        const cart = await getCartByUserOrGuestId(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (p) => 
            p.productId.toString() === productId && 
            p.size === size && 
            p.color === color
        );
        if (productIndex > -1) {
            // Update the quantity of the existing product
            cart.products[productIndex].quantity = quantity;
            // Recalculate total price
            cart.totalPrice = cart.products.reduce((total, item) => 
                total + item.price * item.quantity, 0
                );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating item in cart:', error);
        return res.status(500).json({ message: 'Error updating item in cart', error: error.message });
    }
});

// @route DELETE /api/cart
// @desc Remove item from cart for a guest or logged-in user
// @access Public
router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        // Get the cart by user ID or guest ID
        const cart = await getCartByUserOrGuestId(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (p) => 
            p.productId.toString() === productId && 
            p.size === size && 
            p.color === color
        );
        if (productIndex > -1) {
            // Remove the product from the cart
            cart.products.splice(productIndex, 1);
            // Recalculate total price
            cart.totalPrice = cart.products.reduce((total, item) => 
                total + item.price * item.quantity, 0
                );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
});

// @route GET /api/cart
// @desc Get cart for a guest or logged-in user
// @access Public
router.get('/', async (req, res) => {
    const { guestId, userId } = req.query;
    try {
        // Get the cart by user ID or guest ID
        const cart = await getCartByUserOrGuestId(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart with user cart on login
// @access Private
router.post('/merge', authMiddleware, async (req, res) => {
    const { guestId } = req.body;

    try {
        console.log('Merge cart request:', {
            userId: req.user._id,
            guestId: guestId
        });

        // Validate input
        if (!guestId) {
            return res.status(400).json({ message: 'Guest ID is required' });
        }

        // Find the user's cart and the guest cart
        const userCart = await Cart.findOne({ user: req.user._id });
        const guestCart = await Cart.findOne({ guestId });

        console.log('Found carts:', {
            userCartExists: !!userCart,
            guestCartExists: !!guestCart,
            guestCartProducts: guestCart ? guestCart.products.length : 0
        });

        // Kiểm tra guest cart có tồn tại không
        if (!guestCart) {
            // Nếu không có guest cart nhưng có user cart, trả về user cart
            if (userCart) {
                return res.status(200).json({
                    message: 'No guest cart found, returning user cart',
                    cart: userCart
                });
            }
            // Nếu không có cả hai, trả về lỗi
            return res.status(404).json({ message: 'Guest cart not found' });
        }

        // Kiểm tra guest cart có sản phẩm không
        if (guestCart.products.length === 0) {
            // Xóa guest cart rỗng
            await Cart.findOneAndDelete({ guestId });
            
            if (userCart) {
                return res.status(200).json({
                    message: 'Guest cart is empty, returning user cart',
                    cart: userCart
                });
            } else {
                return res.status(200).json({
                    message: 'Guest cart is empty and no user cart exists',
                    cart: null
                });
            }
        }

        // Nếu user đã có cart
        if (userCart) {
            console.log('Merging into existing user cart...');
            
            // Merge products từ guest cart vào user cart
            guestCart.products.forEach(guestItem => {
                const existingProductIndex = userCart.products.findIndex(
                    (userItem) => 
                    userItem.productId.toString() === guestItem.productId.toString() &&
                    userItem.size === guestItem.size &&
                    userItem.color === guestItem.color
                );
                
                if (existingProductIndex > -1) {
                    // Nếu sản phẩm đã tồn tại, cộng thêm quantity
                    userCart.products[existingProductIndex].quantity += guestItem.quantity;
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm vào
                    userCart.products.push({
                        productId: guestItem.productId,
                        name: guestItem.name,
                        image: guestItem.image,
                        price: guestItem.price,
                        quantity: guestItem.quantity,
                        size: guestItem.size,
                        color: guestItem.color
                    });
                }
            });

            // Tính lại tổng giá
            userCart.totalPrice = userCart.products.reduce((total, item) => 
                total + (item.price * item.quantity), 0
            );

            // Lưu user cart
            await userCart.save();

            // Xóa guest cart sau khi merge thành công
            await Cart.findOneAndDelete({ guestId });

            console.log('Merge completed successfully');
            return res.status(200).json({
                message: 'Cart merged successfully',
                cart: userCart
            });

        } else {
            console.log('Converting guest cart to user cart...');
            
            // Nếu user chưa có cart, chuyển guest cart thành user cart
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            
            await guestCart.save();

            console.log('Guest cart converted to user cart');
            return res.status(200).json({
                message: 'Guest cart converted to user cart',
                cart: guestCart
            });
        }

    } catch (error) {
        console.error('Error merging carts:', error);
        return res.status(500).json({ 
            message: 'Error merging carts', 
            error: error.message 
        });
    }
});

module.exports = router;