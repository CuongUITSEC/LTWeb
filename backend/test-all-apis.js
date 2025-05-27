// test-all-apis.js
// Script test toàn bộ API endpoints
// Cài đặt: npm install axios colors

const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'http://localhost:9000/api';
let authToken = '';
let testUserId = '';
let testProductId = '';
let testCartId = '';
let testCheckoutId = '';
let testOrderId = '';
let guestId = `guest_${Date.now()}`;

// Test data
const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'Test123456',
    gender: 'male',
    birth: '1990-01-01'
};

const testProduct = {
    name: 'Test Product',
    description: 'This is a test product description',
    price: 99.99,
    discountPrice: 79.99,
    countInStock: 100,
    sku: `SKU${Date.now()}`,
    category: 'Electronics',
    brand: 'TestBrand',
    sizes: ['S', 'M', 'L'],
    color: 'Black',
    collection: 'Summer 2024',
    material: 'Cotton',
    gender: 'Unisex',
    images: [{
        url: 'https://via.placeholder.com/500',
        altText: 'Test Product Image'
    }],
    isFeatured: true,
    isPublished: true,
    tags: ['test', 'sample'],
    dimensions: {
        length: 10,
        width: 10,
        height: 5,
        weight: 0.5
    }
};

// Helper functions
const logTest = (testName, success, error = null) => {
    if (success) {
        console.log(`✅ ${testName}`.green);
    } else {
        console.log(`❌ ${testName}`.red);
        if (error) console.log(`   Error: ${error.message}`.yellow);
    }
};

const logSection = (sectionName) => {
    console.log(`\n${'='.repeat(50)}`.blue);
    console.log(`${sectionName}`.blue.bold);
    console.log(`${'='.repeat(50)}`.blue);
};

// Test functions
async function testUserRegistration() {
    try {
        const response = await axios.post(`${BASE_URL}/users/register`, testUser);
        testUserId = response.data.user.id;
        logTest('User Registration', true);
        return response.data;
    } catch (error) {
        logTest('User Registration', false, error.response?.data || error);
        throw error;
    }
}

async function testUserLogin() {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = response.data.token;
        logTest('User Login', true);
        return response.data;
    } catch (error) {
        logTest('User Login', false, error.response?.data || error);
        throw error;
    }
}

async function testGetProfile() {
    try {
        const response = await axios.get(`${BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get User Profile', true);
        return response.data;
    } catch (error) {
        logTest('Get User Profile', false, error.response?.data || error);
    }
}

async function testAdminLogin() {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, {
            email: 'admin@example.com',
            password: '123456'
        });
        authToken = response.data.token;
        logTest('Admin Login', true);
        return response.data;
    } catch (error) {
        logTest('Admin Login', false, error.response?.data || error);
        throw error;
    }
}

async function testCreateProduct() {
    try {
        const response = await axios.post(`${BASE_URL}/products`, testProduct, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        testProductId = response.data._id;
        logTest('Create Product (Admin)', true);
        return response.data;
    } catch (error) {
        logTest('Create Product (Admin)', false, error.response?.data || error);
    }
}

async function testGetAllProducts() {
    try {
        const response = await axios.get(`${BASE_URL}/products?limit=10&page=1`);
        if (response.data.products.length > 0) {
            testProductId = response.data.products[0]._id;
        }
        logTest('Get All Products', true);
        console.log(`   Found ${response.data.totalProducts} products`.gray);
        return response.data;
    } catch (error) {
        logTest('Get All Products', false, error.response?.data || error);
    }
}

async function testGetProductById() {
    try {
        const response = await axios.get(`${BASE_URL}/products/${testProductId}`);
        logTest('Get Product by ID', true);
        return response.data;
    } catch (error) {
        logTest('Get Product by ID', false, error.response?.data || error);
    }
}

async function testUpdateProduct() {
    try {
        const response = await axios.put(`${BASE_URL}/products/${testProductId}`, 
            { price: 89.99 }, 
            { headers: { Authorization: `Bearer ${authToken}` }}
        );
        logTest('Update Product (Admin)', true);
        return response.data;
    } catch (error) {
        logTest('Update Product (Admin)', false, error.response?.data || error);
    }
}

async function testAddToGuestCart() {
    try {
        const response = await axios.post(`${BASE_URL}/cart`, {
            productId: testProductId,
            quantity: 2,
            size: 'M',
            color: 'Black',
            guestId: guestId
        });
        logTest('Add to Guest Cart', true);
        return response.data;
    } catch (error) {
        logTest('Add to Guest Cart', false, error.response?.data || error);
    }
}

async function testGetGuestCart() {
    try {
        const response = await axios.get(`${BASE_URL}/cart?guestId=${guestId}`);
        logTest('Get Guest Cart', true);
        console.log(`   Cart has ${response.data.products.length} items`.gray);
        return response.data;
    } catch (error) {
        logTest('Get Guest Cart', false, error.response?.data || error);
    }
}

async function testUpdateCartItem() {
    try {
        const response = await axios.put(`${BASE_URL}/cart`, {
            productId: testProductId,
            quantity: 3,
            size: 'M',
            color: 'Black',
            guestId: guestId
        });
        logTest('Update Cart Item', true);
        return response.data;
    } catch (error) {
        logTest('Update Cart Item', false, error.response?.data || error);
    }
}

async function testMergeCart() {
    try {
        // First login as user
        await testUserLogin();
        
        const response = await axios.post(`${BASE_URL}/cart/merge`, 
            { guestId: guestId },
            { headers: { Authorization: `Bearer ${authToken}` }}
        );
        logTest('Merge Guest Cart to User Cart', true);
        return response.data;
    } catch (error) {
        logTest('Merge Guest Cart to User Cart', false, error.response?.data || error);
    }
}

async function testGetUserCart() {
    try {
        const response = await axios.get(`${BASE_URL}/cart?userId=${testUserId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get User Cart', true);
        return response.data;
    } catch (error) {
        logTest('Get User Cart', false, error.response?.data || error);
    }
}

async function testCreateCheckout() {
    try {
        // Get cart first
        const cart = await axios.get(`${BASE_URL}/cart?userId=${testUserId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const checkoutData = {
            checkoutItems: cart.data.products.map(item => ({
                productId: item.productId._id || item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                size: item.size,
                color: item.color,
                quantity: item.quantity
            })),
            shippingAddress: {
                address: '123 Test Street',
                city: 'Test City',
                postalCode: '12345',
                country: 'Vietnam'
            },
            paymentMethod: 'Credit Card',
            totalPrice: cart.data.totalPrice
        };

        const response = await axios.post(`${BASE_URL}/checkout`, checkoutData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        testCheckoutId = response.data._id;
        logTest('Create Checkout', true);
        return response.data;
    } catch (error) {
        logTest('Create Checkout', false, error.response?.data || error);
    }
}

async function testPayCheckout() {
    try {
        const response = await axios.put(`${BASE_URL}/checkout/${testCheckoutId}/pay`, 
            {
                paymentStatus: 'Paid',
                paymentDetails: {
                    transactionId: 'TEST_TRANSACTION_123',
                    method: 'Credit Card',
                    amount: 179.98
                }
            },
            { headers: { Authorization: `Bearer ${authToken}` }}
        );
        logTest('Pay Checkout', true);
        return response.data;
    } catch (error) {
        logTest('Pay Checkout', false, error.response?.data || error);
    }
}

async function testFinalizeCheckout() {
    try {
        const response = await axios.post(`${BASE_URL}/checkout/${testCheckoutId}/finalize`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        testOrderId = response.data._id;
        logTest('Finalize Checkout to Order', true);
        return response.data;
    } catch (error) {
        logTest('Finalize Checkout to Order', false, error.response?.data || error);
    }
}

async function testDeleteProduct() {
    try {
        await testAdminLogin(); // Login as admin
        const response = await axios.delete(`${BASE_URL}/products/${testProductId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Delete Product (Admin)', true);
        return response.data;
    } catch (error) {
        logTest('Delete Product (Admin)', false, error.response?.data || error);
    }
}

async function testClearCart() {
    try {
        const response = await axios.delete(`${BASE_URL}/cart/clear`, {
            data: { userId: testUserId },
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Clear Cart', true);
        return response.data;
    } catch (error) {
        logTest('Clear Cart', false, error.response?.data || error);
    }
}

// Main test runner
async function runAllTests() {
    console.log('\n🚀 Starting API Tests...\n'.cyan.bold);
    
    try {
        // User Tests
        logSection('USER ENDPOINTS');
        await testUserRegistration();
        await testUserLogin();
        await testGetProfile();
        
        // Admin Login
        logSection('ADMIN AUTHENTICATION');
        await testAdminLogin();
        
        // Product Tests
        logSection('PRODUCT ENDPOINTS');
        await testCreateProduct();
        await testGetAllProducts();
        await testGetProductById();
        await testUpdateProduct();
        
        // Cart Tests
        logSection('CART ENDPOINTS');
        await testAddToGuestCart();
        await testGetGuestCart();
        await testUpdateCartItem();
        await testMergeCart();
        await testGetUserCart();
        
        // Checkout Tests
        logSection('CHECKOUT & ORDER ENDPOINTS');
        await testCreateCheckout();
        await testPayCheckout();
        await testFinalizeCheckout();
        
        // Cleanup Tests
        logSection('CLEANUP');
        await testClearCart();
        await testDeleteProduct();
        
        console.log('\n✨ All tests completed!'.green.bold);
        
    } catch (error) {
        console.log('\n💥 Test suite failed!'.red.bold);
        console.error(error);
    }
}

// Run tests
runAllTests();

/* 
Cách chạy:
1. npm install axios colors
2. Đảm bảo server đang chạy ở port 9000
3. Đảm bảo đã chạy seeder để có admin account
4. node test-all-apis.js
*/