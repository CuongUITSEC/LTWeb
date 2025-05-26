const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            discountPrice, 
            countInStock, 
            sku, 
            category, 
            brand, 
            sizes, 
            color, 
            collection,
            material,
            gender, 
            images, 
            isFeatured, 
            isPublished, 
            tags,
            metaTitle,
            metaDescription,
            metaKeywords,
            dimensions
        } = req.body;

        // Validate required fields
        if (!name || !description || !price || !sku || !category || 
            !brand || !sizes || !sizes.length || !color || !collection || !material || !gender ||
            !images || !dimensions || !dimensions.weight) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const product = new Product({ 
            name, 
            description, 
            price, 
            discountPrice, 
            countInStock, 
            sku, 
            category, 
            brand, 
            sizes, 
            color, 
            collection,
            material,
            gender, 
            images, 
            isFeatured, 
            isPublished, 
            tags,
            metaTitle,
            metaDescription,
            metaKeywords,
            dimensions,
            user: req.user._id // Set the user who created the product
        });
        
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Product with this SKU already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Private/Admin
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        
        // Tìm sản phẩm hiện có
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Cập nhật chỉ những trường được cung cấp trong request body
        Object.keys(req.body).forEach(key => {
            // Đảm bảo chỉ cập nhật những trường hợp lệ
            if (product.schema.paths[key]) {
                product[key] = req.body[key];
            }
        });
        
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Product with this SKU already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Cách 1: Sử dụng deleteOne()
        await product.deleteOne();
        
        // HOẶC Cách 2: Sử dụng findByIdAndDelete (không cần tìm trước)
        // await Product.findByIdAndDelete(productId);
        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/products
// @desc    Get all products
router.get('/', async (req, res) => {
    try {
        const {
            collection,
            sizes,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
            page = 1,
            featured,
            published,
            onSale,
            fields
        } = req.query;

        let query = {};
        
        // Filtering by collection (support comma-separated values)
        if (collection) {
            const collections = collection.split(',');
            query.collection = collections.length > 1 ? { $in: collections } : collection;
        }
        
        // Filtering by sizes (support comma-separated values)
        if (sizes) {
            const sizess = sizes.split(',');
            query.sizes = sizess.length > 1 ? { $in: sizess } : sizes;
        }
        
        // Filtering by color (support comma-separated values)
        if (color) {
            const colors = color.split(',');
            query.color = colors.length > 1 ? { $in: colors } : color;
        }
        
        // Filtering by gender (support comma-separated values)
        if (gender) {
            const genders = gender.split(',');
            query.gender = genders.length > 1 ? { $in: genders } : gender;
        }
        
        // Filtering by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        // Filtering by category (support comma-separated values)
        if (category) {
            const categories = category.split(',');
            query.category = categories.length > 1 ? { $in: categories } : category;
        }
        
        // Filtering by material (support comma-separated values)
        if (material) {
            const materials = material.split(',');
            query.material = materials.length > 1 ? { $in: materials } : material;
        }
        
        // Filtering by brand (support comma-separated values)
        if (brand) {
            const brands = brand.split(',');
            query.brand = brands.length > 1 ? { $in: brands } : brand;
        }
        
        // Filter by featured products
        if (featured !== undefined) {
            query.isFeatured = featured === 'true';
        }
        
        // Filter by published status
        if (published !== undefined) {
            query.isPublished = published === 'true';
        }
        
        // Filter products on sale (with discount)
        if (onSale === 'true') {
            query.discountPrice = { $ne: null, $gt: 0 };
        }
        
        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        let sortOptions = {};
        if (sortBy) {
            switch (sortBy) {
                case 'price_asc':
                    sortOptions = { price: 1 };
                    break;
                case 'price_desc':
                    sortOptions = { price: -1 };
                    break;
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'popularity':
                    sortOptions = { popularity: -1 };
                    break;
                case 'name_asc':
                    sortOptions = { name: 1 };
                    break;
                case 'name_desc':
                    sortOptions = { name: -1 };
                    break;
                case 'discount':
                    sortOptions = { discountPrice: 1, price: -1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 }; // Default sorting
            }
        }
        
        // Field selection/projection
        let projection = {};
        if (fields) {
            fields.split(',').forEach(field => {
                projection[field] = 1;
            });
        }
        
        // Pagination
        const pagesizes = parseInt(limit) || 10;
        const skip = (parseInt(page) - 1) * pagesizes;
        
        // Execute query with pagination
        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query, projection)
            .sort(sortOptions)
            .skip(skip)
            .limit(pagesizes);
            
        // Return products with pagination metadata
        res.status(200).json({
            products,
            page: parseInt(page),
            pages: Math.ceil(totalProducts / pagesizes),
            totalProducts,
            filters: {
                appliedFilters: Object.keys(query).length,
                query: query
            },
            // message: totalProducts === 0 ? "No products found matching your criteria" : null
        });
        
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid parameter format' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/similar/:id
// @desc    Get similar products based on category, brand, or collection
// @access  Public
router.get('/similar/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Tạo truy vấn tìm sản phẩm tương tự
        const similarQuery = {
            _id: { $ne: productId },
            isPublished: true,
            $or: [
                { category: product.category },
                { brand: product.brand },
                { collection: product.collection }
            ]
        };

        // Thêm điều kiện về gender nếu có
        if (product.gender) {
            similarQuery.gender = product.gender;
        }

        // Tìm và sắp xếp sản phẩm tương tự
        // $facet cho phép tạo các nhóm kết quả khác nhau
        const similarProducts = await Product.aggregate([
            { $match: similarQuery },
            { $addFields: {
                similarity: {
                    $add: [
                        { $cond: [{ $eq: ["$category", product.category] }, 3, 0] },
                        { $cond: [{ $eq: ["$brand", product.brand] }, 2, 0] },
                        { $cond: [{ $eq: ["$collection", product.collection] }, 1, 0] }
                    ]
                }
            }},
            { $facet: {
                // Nhóm 1: Sản phẩm cùng danh mục
                sameCategory: [
                    { $match: { category: product.category } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 },
                    { $project: {
                        name: 1,
                        price: 1,
                        discountPrice: 1,
                        images: 1,
                        category: 1,
                        brand: 1,
                        collection: 1
                    }}
                ],
                // Nhóm 2: Sản phẩm cùng thương hiệu
                sameBrand: [
                    { $match: { brand: product.brand } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 },
                    { $project: {
                        name: 1,
                        price: 1,
                        discountPrice: 1,
                        images: 1,
                        category: 1,
                        brand: 1,
                        collection: 1
                    }}
                ],
                // Nhóm 3: Sản phẩm tổng hợp theo điểm tương đồng
                recommended: [
                    { $sort: { similarity: -1, createdAt: -1 } },
                    { $limit: 10 },
                    { $project: {
                        name: 1,
                        price: 1,
                        discountPrice: 1,
                        images: 1,
                        category: 1,
                        brand: 1,
                        collection: 1,
                        similarity: 1
                    }}
                ]
            }}
        ]);

        res.status(200).json(similarProducts[0]); // $facet luôn trả về một mảng, nên lấy phần tử đầu tiên
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// @route   GET /api/products/best-sellers
// @desc    Get best-selling products rating
// @access Public
router.get('/best-sellers', async (req, res) => {
    try {
        const bestSellers = await Product.find({ isPublished: true })
            .sort({ rating: -1, numReviews: -1 }) // Sắp xếp theo rating và số lượng review
            .limit(10)
            .select('name price discountPrice images category brand collection');

        res.status(200).json(bestSellers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/new-arrivals
// @desc    Get new arrivals products
// @access Public
router.get('/new-arrivals', async (req, res) => {
    try {
        const newArrivals = await Product.find({ isPublished: true })
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
            .limit(10)
            .select('name price discountPrice images category brand collection');

        res.status(200).json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access Public
router.get("/:id", async (req, res) =>
    {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId)
                .populate('user', 'name email') // Populate user details
                // .populate('category', 'name') // Populate category details
                // .populate('brand', 'name') // Populate brand details
                // .populate('collection', 'name') // Populate collection details
                // .populate('material', 'name') // Populate material details
                // .populate('sizes', 'name') // Populate sizes details
                // .populate('color', 'name'); // Populate color details
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            if (error.name === 'CastError') {
                return res.status(400).json({ message: 'Invalid product ID format' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });


module.exports = router;