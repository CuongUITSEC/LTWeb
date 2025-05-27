const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db'); // Connect to the database
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./routes/productRoutes'); // Import product routes
const cartRoutes = require('./routes/cartRoutes'); // Import cart routes 
const checkoutRoutes = require('./routes/checkoutRoutes'); // Import checkout routes
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Import passport config
require('./config/passport');
const passport = require('passport');

//console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Hello from the server!');
    });
// Session configuration (cho Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS trong production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
const helmet = require('helmet');
app.use(helmet());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Use user routes
app.use('/api/users', userRoutes);
// Use product routes
app.use('/api/products', productRoutes);
// Use cart routes
app.use('/api/cart', cartRoutes);
// Use checkout routes
app.use('/api/checkout', checkoutRoutes);
// Use auth routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});