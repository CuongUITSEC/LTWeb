const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const products = require('./data/products'); // Dữ liệu sản phẩm mẫu
const users = require('./data/users'); // Dữ liệu người dùng mẫu (nếu có)
const Cart = require('./models/Cart'); // Nếu cần sử dụng Cart
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import data
const importData = async () => {
    try {
        // Xóa dữ liệu hiện có
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany(); 
        
        console.log('Data deleted successfully');
        
        // Tạo admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: '123456',
            role: 'admin',
        });
        
        console.log('Admin user created');
        
        // Thêm user Id vào mỗi sản phẩm
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser._id };
        });
        
        // Import sản phẩm vào database
        await Product.insertMany(sampleProducts);
        
        console.log('Data imported successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Destroy data
const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        
        console.log('Data destroyed successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Xử lý tham số dòng lệnh để quyết định import hay destroy
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}