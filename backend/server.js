const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Connect to the database
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./routes/productRoutes'); // Import product routes
const cartRoutes = require('./routes/cartRoutes'); // Import cart routes 
const checkoutRoutes = require('./routes/checkoutRoutes'); // Import checkout routes


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Hello from the server!');
    });

// Use user routes
app.use('/api/users', userRoutes);
// Use product routes
app.use('/api/products', productRoutes);
// Use cart routes
app.use('/api/cart', cartRoutes);
// Use checkout routes
app.use('/api/checkout', checkoutRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});