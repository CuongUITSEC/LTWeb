const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
        required: true
    },
}, {_id: false});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    guestId: {
        type: String,
        default: null
    },
    products: {
        type: [cartItemSchema],
        default: [],
        validate: {
            validator: function(products) {
                return products.length >= 0;
            },
            message: 'Products array cannot be negative length'
        }
    },
    totalPrice: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
}, { 
    timestamps: true,
    // Đảm bảo ít nhất có user hoặc guestId
    validate: {
        validator: function() {
            return this.user || this.guestId;
        },
        message: 'Either user or guestId must be provided'
    }
});

// Index để tối ưu performance
cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });
cartSchema.index({ user: 1, guestId: 1 });

// Pre-save middleware để tính toán totalPrice
cartSchema.pre('save', function(next) {
    if (this.products && this.products.length > 0) {
        this.totalPrice = this.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    } else {
        this.totalPrice = 0;
    }
    next();
});

module.exports = mongoose.model('Cart', cartSchema);