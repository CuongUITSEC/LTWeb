const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User'); // Import User model

// @route   GET /auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false // Không sử dụng session, dùng JWT
  }),
  // (req, res) => {
  //   try {
  //     // Tạo JWT token
  //     const token = jwt.sign(
  //       { id: req.user._id, role: req.user.role },
  //       process.env.JWT_SECRET || "your_jwt_secret_key",
  //       { expiresIn: "7d" }
  //     );

  //     // Redirect về frontend với token
  //     // Bạn có thể customize URL này theo frontend của bạn
  //     const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
  //     res.redirect(`${frontendURL}/auth/success?token=${token}`);
      
  //   } catch (error) {
  //     console.error('Google callback error:', error);
  //     res.redirect(`${frontendURL}/auth/error`);
  //   }
  // }
  (req, res) => {
    try {
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
        
        // Tạo JWT token
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET || "your_jwt_secret_key",
            { expiresIn: "7d" }
        );

        // Redirect về frontend với token
        res.redirect(`${frontendURL}/auth/success?token=${token}`);
        
    } catch (error) {
        console.error('Google callback error:', error);
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendURL}/auth/error`);
    }
    }
);

// @route   POST /auth/google/mobile
// @desc    Google OAuth cho mobile app (nhận Google token từ client)
// @access  Public
router.post('/google/mobile', async (req, res) => {
  try {
    const { googleToken } = req.body;
    
    if (!googleToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // Verify Google token
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    // Tìm hoặc tạo user
    let user = await User.findOne({ googleId });
    
    if (!user) {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Liên kết account
        existingUser.googleId = googleId;
        existingUser.profileImage = picture;
        await existingUser.save();
        user = existingUser;
      } else {
        // Tạo user mới
        user = new User({
          googleId,
          name,
          email,
          password: 'google_oauth_user',
          gender: 'other',
          profileImage: picture
        });
        await user.save();
      }
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        accountType: user.accountType
      },
      token,
    });

  } catch (error) {
    console.error('Google mobile auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;