const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
        min: 0
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    sizes: [{
        type: String,
        required: true,
        trim: true,
    }],
    color: {
        type: String,
        required: true,
        trim: true
    },
    collection: {
        type: String,
        required: true,
        trim: true
    },
    material: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Men", "Women", "Unisex"],
    },
    images: [{
        url: {
            type: String,
            required: true,
        },
        altText: {
            type: String,
            required: true,
        }
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    rating : {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    metaKeywords: [{
        type: String,
        trim: true
    }],
    dimensions: {
        length: {
            type: Number,
            required: true,
            min: 0
        },
        width: {
            type: Number,
            required: true,
            min: 0
        },
        height: {
            type: Number,
            required: true,
            min: 0
        },
        weight: {
            type: Number,
            required: true,
            min: 0
        }
    },
},
    { timestamps: true }
);
module.exports = mongoose.model('Product', productSchema);