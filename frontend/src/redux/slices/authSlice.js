import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const tokenFromStorage = localStorage.getItem("userToken") || null;

// Check for an existing token in localStorage or generate a new one
const initialGuestId =
  localStorage.getItem("guestId") ||
  `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem("guestId", initialGuestId);

// Initialize state with user info and guest ID
const initialState = {
  userInfo: userFromStorage,
  userToken: tokenFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
  success: false,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Đúng endpoint: /api/users/login
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        userData,
        config
      );

      // Lưu thông tin vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data; // Return cả user và token
    } catch (error) {
      // Handle error response
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (token) {
        // Gọi API logout backend
        await axios.post(
          `${API_URL}/api/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Xóa tất cả dữ liệu trong localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.removeItem("token");
      localStorage.removeItem("cart");

      return { message: "Đăng xuất thành công" };
    } catch (error) {
      // Dù có lỗi API vẫn xóa localStorage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.removeItem("token");
      localStorage.removeItem("cart");

      console.error("Logout error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi đăng xuất"
      );
    }
  }
);

// Async thunk for user Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Đúng endpoint: /api/users/register
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        userData,
        config
      );

      // Lưu thông tin vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data; // Return cả user và token
    } catch (error) {
      // Handle error response
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.userToken;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/api/users/profile`, config);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Force clear tất cả
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.removeItem("token");
      localStorage.removeItem("cart");

      state.userInfo = null;
      state.userToken = null;
      state.loading = false;
      state.error = null;
      state.success = false;

      // Generate new guest ID on logout
      state.guestId = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("guestId", state.guestId);
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload.userInfo;
      state.userToken = action.payload.userToken;
      state.success = true;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.userToken = action.payload.token;
        state.success = true;
        state.error = null;
        state.loading = false;
        // Đảm bảo sync localStorage
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
        localStorage.setItem("userToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.userToken = action.payload.token;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.userToken = null;
        state.error = null;
        state.success = false;

        // Generate new guest ID
        state.guestId = `guest_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("guestId", state.guestId);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Vẫn logout dù có lỗi
        state.userInfo = null;
        state.userToken = null;
        state.error = null;

        // Generate new guest ID
        state.guestId = `guest_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("guestId", state.guestId);
      })
      // Get profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
        // Lưu lại userInfo vào localStorage để đồng bộ khi reload
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearSuccess, generateNewGuestId } =
  authSlice.actions;
export default authSlice.reducer;
