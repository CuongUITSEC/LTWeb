// File: debug-cart-merge.js
// Script để test từng bước và debug lỗi cart merge

const axios = require('axios');

// Cấu hình base URL
const BASE_URL = 'http://localhost:9000/api'; // Thay đổi theo port của bạn

// Biến lưu trữ dữ liệu test
let adminToken = '';
let guestId = '';
let productId = '';
let testUserId = '';

// Helper function để log response
const logResponse = (step, response) => {
    console.log(`\n=== ${step} ===`);
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
};

// Helper function để log error
const logError = (step, error) => {
    console.log(`\n❌ ${step} - ERROR ===`);
    if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
        console.log('Error:', error.message);
    }
};

// Step 1: Login admin để lấy token
const loginAdmin = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, {
            email: 'admin@example.com',
            password: '123456'
        });
        
        adminToken = response.data.token;
        logResponse('Step 1: Login Admin', response);
        return true;
    } catch (error) {
        logError('Step 1: Login Admin', error);
        return false;
    }
};

// Step 2: Lấy danh sách products
const getProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products?limit=1`);
        
        if (response.data.products && response.data.products.length > 0) {
            productId = response.data.products[0]._id;
            logResponse('Step 2: Get Products', response);
            console.log('Selected Product ID:', productId);
            return true;
        } else {
            console.log('❌ No products found');
            return false;
        }
    } catch (error) {
        logError('Step 2: Get Products', error);
        return false;
    }
};

// Step 3: Tạo guest cart
const createGuestCart = async () => {
    try {
        // Tạo guestId ngẫu nhiên
        guestId = `guest_${Date.now()}`;
        
        const response = await axios.post(`${BASE_URL}/cart`, {
            productId: productId,
            quantity: 2,
            size: 'M',
            color: 'Red',
            guestId: guestId
        });
        
        logResponse('Step 3: Create Guest Cart', response);
        console.log('Guest ID:', guestId);
        return true;
    } catch (error) {
        logError('Step 3: Create Guest Cart', error);
        return false;
    }
};

// Step 4: Kiểm tra guest cart
const checkGuestCart = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/cart?guestId=${guestId}`);
        logResponse('Step 4: Check Guest Cart', response);
        return true;
    } catch (error) {
        logError('Step 4: Check Guest Cart', error);
        return false;
    }
};

// Step 5: Tạo user mới để test merge
const createTestUser = async () => {
    try {
        const testEmail = `testuser_${Date.now()}@example.com`;
        const response = await axios.post(`${BASE_URL}/users/register`, {
            name: 'Test User',
            email: testEmail,
            password: '123456'
        });
        
        testUserId = response.data.user.id;
        logResponse('Step 5: Create Test User', response);
        return response.data.token;
    } catch (error) {
        logError('Step 5: Create Test User', error);
        return null;
    }
};

// Step 6: Test merge cart
const testMergeCart = async (userToken) => {
    try {
        console.log('\n=== Step 6: Test Merge Cart ===');
        console.log('Using token:', userToken);
        console.log('Guest ID:', guestId);
        
        const response = await axios.post(`${BASE_URL}/cart/merge`, 
            {
                guestId: guestId
            },
            {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        logResponse('Step 6: Merge Cart SUCCESS', response);
        return true;
    } catch (error) {
        logError('Step 6: Merge Cart', error);
        return false;
    }
};

// Step 7: Kiểm tra user cart sau khi merge
const checkUserCart = async (userToken) => {
    try {
        const response = await axios.get(`${BASE_URL}/cart?userId=${testUserId}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        logResponse('Step 7: Check User Cart After Merge', response);
        return true;
    } catch (error) {
        logError('Step 7: Check User Cart After Merge', error);
        return false;
    }
};

// Main test function
const runTest = async () => {
    console.log('🚀 Starting Cart Merge Debug Test...\n');
    
    // Step 1: Login admin
    if (!(await loginAdmin())) {
        console.log('❌ Test stopped: Cannot login admin');
        return;
    }
    
    // Step 2: Get products
    if (!(await getProducts())) {
        console.log('❌ Test stopped: Cannot get products');
        return;
    }
    
    // Step 3: Create guest cart
    if (!(await createGuestCart())) {
        console.log('❌ Test stopped: Cannot create guest cart');
        return;
    }
    
    // Step 4: Check guest cart
    if (!(await checkGuestCart())) {
        console.log('❌ Test stopped: Cannot check guest cart');
        return;
    }
    
    // Step 5: Create test user
    const userToken = await createTestUser();
    if (!userToken) {
        console.log('❌ Test stopped: Cannot create test user');
        return;
    }
    
    // Step 6: Test merge cart
    if (!(await testMergeCart(userToken))) {
        console.log('❌ Merge failed - checking details...');
        
        // Debug thêm: kiểm tra guest cart có tồn tại không
        console.log('\n🔍 Debug: Checking if guest cart still exists...');
        await checkGuestCart();
        
        return;
    }
    
    // Step 7: Check final result
    await checkUserCart(userToken);
    
    console.log('\n✅ All tests completed!');
};

// Chạy test
runTest().catch(console.error);

/* 
Cách chạy script này:
1. npm install axios (nếu chưa có)
2. node debug-cart-merge.js

Script này sẽ:
- Tự động test từng bước
- Hiển thị chi tiết response/error ở mỗi bước
- Giúp xác định chính xác lỗi ở đâu
*/