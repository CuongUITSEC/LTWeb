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
      required: function () {
        // Password only required if no OAuth IDs
        return !this.googleId && !this.facebookId;
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
    // Thêm trường mới
    address: {
      type: String,
    },
    city: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    ward: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
    },
    // Thêm fields cho Google OAuth
    googleId: {
      type: String,
      sparse: true, // Cho phép null và unique
    },
    facebookId: {
      type: String,
      sparse: true,
    },
    profileImage: {
      type: String,
    },
    // Đánh dấu account type
    accountType: {
      type: String,
      enum: ["local", "google", "facebook", "hybrid"],
      default: "local",
    },
  },
  {
    timestamps: true,
  }
);

// Hash mật khẩu trước khi lưu (chỉ cho local accounts)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.googleId || this.facebookId)
    return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Cập nhật account type trước khi lưu
userSchema.pre("save", function (next) {
  if (
    (this.googleId || this.facebookId) &&
    this.password !== "google_oauth_user" &&
    this.password !== "facebook_oauth_user"
  ) {
    this.accountType = "hybrid";
  } else if (this.googleId) {
    this.accountType = "google";
  } else if (this.facebookId) {
    this.accountType = "facebook";
  } else {
    this.accountType = "local";
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
  if (
    this.accountType === "google" ||
    this.accountType === "facebook" ||
    !this.password
  ) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
