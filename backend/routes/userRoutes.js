const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/authMiddleware");


// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, birth } = req.body;

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password, // sẽ được hash trong schema
      gender,
      birth,
    });

    await newUser.save();

    // Tạo token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    // CẢI THIỆN: Set secure cookie với các options bảo mật
    const cookieOptions = {
      httpOnly: true,                    // Không thể access từ JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',                   // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 ngày
      path: '/'                          // Available for all paths
    };

    res.cookie('authToken', token, cookieOptions);

    // Chuẩn bị response data
    const responseData = {
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: token
    };

    // Chỉ gửi token trong response khi development (để frontend có thể sử dụng)
    // if (process.env.NODE_ENV === 'development') {
    //   responseData.token = token;
    // }
    responseData.token = token;

    res.status(201).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );
    const cookieOptions = {
      httpOnly: true,                    // Không thể access từ JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',                   // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 ngày
      path: '/'                          // Available for all paths
    };

    res.cookie('authToken', token, cookieOptions);

    // Chuẩn bị response data
    const responseData = {
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        birth: user.birth,
        address: user.address,
        city: user.city,
        district: user.district,
        ward: user.ward,
        phone: user.phone,
        profileImage: user.profileImage,
        accountType: user.accountType,
        createdAt: user.createdAt,
      },
      token: token
    };

    // Chỉ gửi token trong response khi development (để frontend có thể sử dụng)
    if (process.env.NODE_ENV === 'development') {
      responseData.token = token;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Clear tất cả cookies có thể
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    };

    res.clearCookie('authToken', cookieOptions);
    res.clearCookie('userToken', cookieOptions);
    res.clearCookie('token', cookieOptions);

    // Optional: Thêm token vào blacklist nếu muốn
    // await addToBlacklist(req.headers.authorization?.split(" ")[1]);

    res.json({ 
      message: "Đăng xuất thành công",
      success: true 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      message: "Lỗi khi đăng xuất",
      success: false 
    });
  }
});


// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private

// Lấy profile user, đã xác thực qua middleware
// router.get("/profile", authMiddleware, async (req, res) => {
//   try {
//     // Sử dụng trực tiếp user đã được tìm trong middleware
//     // Không cần query lại database
//     res.status(200).json(req.user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Lấy thông tin user từ middleware auth (req.user chứa ID)
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về đầy đủ thông tin cần thiết
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      birth: user.birth,
      address: user.address,
      city: user.city,
      district: user.district,
      ward: user.ward,
      phone: user.phone,
      profileImage: user.profileImage,
      accountType: user.accountType,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Thêm route update profile vào userRoutes.js
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, gender, birth, address, phone, city, district, ward } =
      req.body;

    // Tìm user dựa vào ID từ middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cập nhật thông tin
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (birth) user.birth = birth;
    if (address) user.address = address;
    if (city) user.city = city;
    if (phone) user.phone = phone;
    if (district) user.district = district;
    if (ward) user.ward = ward;

    // Lưu vào database
    const updatedUser = await user.save();

    // Trả về thông tin đã cập nhật
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      gender: updatedUser.gender,
      birth: updatedUser.birth,
      address: updatedUser.address,
      city: updatedUser.city,
      district: updatedUser.district,
      ward: updatedUser.ward,
      phone: updatedUser.phone,
      profileImage: updatedUser.profileImage,
      accountType: updatedUser.accountType,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
