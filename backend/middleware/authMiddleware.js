const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware to check if user is authenticated 
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    
    // Tìm user trong database
    const user = await User.findById(decoded.id).select("-password");
    
    // Kiểm tra nếu user không tồn tại
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    // Phân biệt lỗi token hết hạn và token không hợp lệ
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admin access required" });
  }
};

// Chỉ export một lần ở cuối file
module.exports = { authMiddleware, isAdmin };