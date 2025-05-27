const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Helper function to get a cart by user ID or guest ID
const getCartByUserOrGuestId = async (userId, guestId) => {
    try {
        if (userId && isValidObjectId(userId)) {
            return await Cart.findOne({ user: userId }).populate('products.productId', 'name price images');
        } else if (guestId) {
            return await Cart.findOne({ guestId: guestId }).populate('products.productId', 'name price images');
        }
        return null;
    } catch (error) {
        console.error('Error in getCartByUserOrGuestId:', error);
        return null;
    }
};

// @route POST /api/cart
// @desc Add item to cart for a guest or logged-in user
// @access Public
router.post('/', async (req, res) => {
    const { productId, quantity = 1, size, color, guestId, userId } = req.body;
    
    try {
        // Input validation
        if (!productId || !size || !color) {
            return res.status(400).json({ message: 'Product ID, size, and color are required' });
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        if (!userId && !guestId) {
            return res.status(400).json({ message: 'Either userId or guestId must be provided' });
        }

        // Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.isPublished) {
            return res.status(400).json({ message: 'Product is not available' });
        }

        // Check if product has enough stock
        if (product.countInStock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Determine if the user is logged in or a guest
        let cart = await getCartByUserOrGuestId(userId, guestId);
        
        // If cart exists, update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) => 
                p.productId._id.toString() === productId && 
                p.size === size && 
                p.color === color
            );
            
            if (productIndex > -1) {
                // Check total quantity after addition
                const newQuantity = cart.products[productIndex].quantity + quantity;
                if (newQuantity > product.countInStock) {
                    return res.status(400).json({ message: 'Not enough stock available' });
                }
                cart.products[productIndex].quantity = newQuantity;
            } else {
                // Add new product to cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || '',
                    price: product.discountPrice || product.price,
                    quantity,
                    size,
                    color
                });
            }
            
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create new cart
            const finalGuestId = guestId || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const newCart = new Cart({
                user: userId && isValidObjectId(userId) ? userId : undefined,
                guestId: !userId ? finalGuestId : undefined,
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || '',
                    price: product.discountPrice || product.price,
                    quantity,
                    size,
                    color
                }]
            });
            
            await newCart.save();
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({ message: 'Error adding item to cart', error: error.message });
    }
});

// @route PUT /api/cart
// @desc Update item in cart for a guest or logged-in user
// @access Public
router.put('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    
    try {
        // Input validation
        if (!productId || !size || !color || quantity === undefined) {
            return res.status(400).json({ message: 'Product ID, size, color, and quantity are required' });
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        if (quantity < 0) {
            return res.status(400).json({ message: 'Quantity cannot be negative' });
        }

        // Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (quantity > product.countInStock) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        // Get the cart
        const cart = await getCartByUserOrGuestId(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (p) => 
            p.productId._id.toString() === productId && 
            p.size === size && 
            p.color === color
        );
        
        if (productIndex > -1) {
            if (quantity === 0) {
                // Remove product if quantity is 0
                cart.products.splice(productIndex, 1);
            } else {
                // Update quantity
                cart.products[productIndex].quantity = quantity;
            }
            
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
        // Input validation
        if (!productId || !size || !color) {
            return res.status(400).json({ message: 'Product ID, size, and color are required' });
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        // Get the cart
        const cart = await getCartByUserOrGuestId(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (p) => 
            p.productId._id.toString() === productId && 
            p.size === size && 
            p.color === color
        );
        
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
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
        if (!userId && !guestId) {
            return res.status(400).json({ message: 'Either userId or guestId must be provided' });
        }

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
        console.log('=== CART MERGE START ===');
        console.log('User ID:', req.user._id);
        console.log('Guest ID:', guestId);

        // Input validation
        if (!guestId) {
            console.log('❌ No guestId provided');
            return res.status(400).json({ message: 'Guest ID is required' });
        }

        // Find both carts with proper error handling
        const [userCart, guestCart] = await Promise.all([
            Cart.findOne({ user: req.user._id }).catch(() => null),
            Cart.findOne({ guestId: guestId }).catch(() => null)
        ]);

        console.log('Cart status:', {
            userCartExists: !!userCart,
            userCartProductCount: userCart?.products?.length || 0,
            guestCartExists: !!guestCart,
            guestCartProductCount: guestCart?.products?.length || 0
        });

        // Case 1: No guest cart found
        if (!guestCart) {
            console.log('ℹ️ No guest cart found');
            if (userCart) {
                return res.status(200).json({
                    message: 'No guest cart found, returning existing user cart',
                    cart: userCart
                });
            } else {
                return res.status(200).json({
                    message: 'No carts found',
                    cart: null
                });
            }
        }

        // Case 2: Guest cart is empty
        if (!guestCart.products || guestCart.products.length === 0) {
            console.log('ℹ️ Guest cart is empty');
            await Cart.findOneAndDelete({ guestId: guestId });
            
            return res.status(200).json({
                message: 'Guest cart was empty and has been cleaned up',
                cart: userCart || null
            });
        }

        // Validate all products in guest cart still exist and get current prices
        const productIds = guestCart.products.map(item => item.productId);
        const existingProducts = await Product.find({ 
            _id: { $in: productIds },
            isPublished: true 
        }).lean();
        
        const productMap = new Map(
            existingProducts.map(p => [p._id.toString(), p])
        );

        // Case 3: User has existing cart - merge products
        if (userCart) {
            console.log('🔄 Merging into existing user cart...');
            
            let mergeCount = 0;
            let updateCount = 0;
            let skippedCount = 0;

            for (const guestItem of guestCart.products) {
                const productIdStr = guestItem.productId.toString();
                const currentProduct = productMap.get(productIdStr);
                
                if (!currentProduct) {
                    console.log(`⚠️ Skipping product ${productIdStr} - no longer available`);
                    skippedCount++;
                    continue;
                }

                // Update price to current price
                const currentPrice = currentProduct.discountPrice || currentProduct.price;

                const existingIndex = userCart.products.findIndex(
                    userItem => 
                    userItem.productId.toString() === productIdStr &&
                    userItem.size === guestItem.size &&
                    userItem.color === guestItem.color
                );
                
                if (existingIndex > -1) {
                    // Product exists - add quantities
                    const newQuantity = userCart.products[existingIndex].quantity + guestItem.quantity;
                    
                    // Check stock limit
                    if (newQuantity <= currentProduct.countInStock) {
                        userCart.products[existingIndex].quantity = newQuantity;
                        userCart.products[existingIndex].price = currentPrice;
                        updateCount++;
                    } else {
                        // Set to max available stock
                        userCart.products[existingIndex].quantity = currentProduct.countInStock;
                        userCart.products[existingIndex].price = currentPrice;
                        console.log(`⚠️ Limited quantity for ${guestItem.name} due to stock`);
                        updateCount++;
                    }
                } else {
                    // New product - add to cart
                    const quantity = Math.min(guestItem.quantity, currentProduct.countInStock);
                    userCart.products.push({
                        productId: guestItem.productId,
                        name: currentProduct.name, // Use current name
                        image: currentProduct.images[0]?.url || guestItem.image,
                        price: currentPrice,
                        quantity: quantity,
                        size: guestItem.size,
                        color: guestItem.color
                    });
                    mergeCount++;
                }
            }

            // Save merged cart
            await userCart.save();
            
            // Delete guest cart
            await Cart.findOneAndDelete({ guestId: guestId });

            console.log('✅ Merge completed:', { mergeCount, updateCount, skippedCount });
            return res.status(200).json({
                message: `Cart merged successfully. Added ${mergeCount} new items, updated ${updateCount} existing items${skippedCount > 0 ? `, skipped ${skippedCount} unavailable items` : ''}.`,
                cart: userCart,
                stats: { merged: mergeCount, updated: updateCount, skipped: skippedCount }
            });

        } else {
            // Case 4: No user cart - convert guest cart to user cart
            console.log('🔄 Converting guest cart to user cart...');
            
            // Filter out non-existent products and update prices
            const validProducts = [];
            let skippedCount = 0;

            for (const item of guestCart.products) {
                const productIdStr = item.productId.toString();
                const currentProduct = productMap.get(productIdStr);
                
                if (currentProduct) {
                    validProducts.push({
                        productId: item.productId,
                        name: currentProduct.name,
                        image: currentProduct.images[0]?.url || item.image,
                        price: currentProduct.discountPrice || currentProduct.price,
                        quantity: Math.min(item.quantity, currentProduct.countInStock),
                        size: item.size,
                        color: item.color
                    });
                } else {
                    skippedCount++;
                }
            }

            // Update guest cart and convert to user cart
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            guestCart.products = validProducts;
            
            await guestCart.save();

            console.log('✅ Guest cart converted to user cart');
            return res.status(200).json({
                message: `Guest cart converted to user cart successfully${skippedCount > 0 ? `. ${skippedCount} unavailable items were removed.` : ''}.`,
                cart: guestCart
            });
        }

    } catch (error) {
        console.error('❌ Error merging carts:', error);
        return res.status(500).json({ 
            message: 'Error merging carts', 
            error: error.message 
        });
    }
});

// @route DELETE /api/cart/clear
// @desc Clear entire cart
// @access Public
router.delete('/clear', async (req, res) => {
    const { guestId, userId } = req.body;
    
    try {
        if (!userId && !guestId) {
            return res.status(400).json({ message: 'Either userId or guestId must be provided' });
        }

        const result = await Cart.findOneAndDelete(
            userId && isValidObjectId(userId) 
                ? { user: userId }
                : { guestId: guestId }
        );

        if (!result) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
});

module.exports = router;