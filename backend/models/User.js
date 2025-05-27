const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: function() {
        // Password chỉ required nếu không có googleId
        return !this.googleId;
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    birth: {
      type: Date,
    },
    // Thêm fields cho Google OAuth
    googleId: {
      type: String,
      sparse: true, // Cho phép null và unique
    },
    profileImage: {
      type: String,
    },
    // Đánh dấu account type
    accountType: {
      type: String,
      enum: ["local", "google", "hybrid"],
      default: "local"
    }
  },
  {
    timestamps: true,
  }
);

// Hash mật khẩu trước khi lưu (chỉ cho local accounts)
userSchema.pre("save", async function (next) {
  // Bỏ qua hash nếu là Google OAuth user hoặc password không thay đổi
  if (!this.isModified("password") || this.googleId) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Cập nhật account type trước khi lưu
userSchema.pre("save", function(next) {
  if (this.googleId && this.password !== 'google_oauth_user') {
    this.accountType = 'hybrid';
  } else if (this.googleId) {
    this.accountType = 'google';
  } else {
    this.accountType = 'local';
  }
  next();
});
// Vấn đề: comparePassword không xử lý trường hợp password là null/undefined
// Phương thức kiểm tra mật khẩu
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   // Không thể so sánh password cho Google OAuth users
//   if (this.accountType === 'google') {
//     return false;
//   }
//   return await bcrypt.compare(candidatePassword, this.password);
// };

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.accountType === 'google' || !this.password) {
      return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;