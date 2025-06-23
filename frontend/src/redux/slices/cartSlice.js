import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/api";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Không có cart, trả về cart rỗng
        return { products: [] };
      }
      console.error("Error fetching cart:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update the quantity of an item in the cart - SỬA LỖI Ở ĐÂY
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, guestId, userId, size, color },
    { rejectWithValue }
  ) => {
    try {
      // SỬA: Sử dụng đúng endpoint - bỏ /${productId} ra khỏi URL
      const response = await axios.put(`${API_URL}/api/cart`, {
        productId,
        quantity,
        guestId,
        userId,
        size,
        color,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${API_URL}/api/cart`,
        data: {
          productId,
          guestId,
          userId,
          size,
          color,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Merge guest cart with user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/merge`,
        {
          userId,
          guestId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error merging cart:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Clear entire cart on server
export const clearCartServer = createAsyncThunk(
  "cart/clearCartServer",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/clear`, {
        data: { userId, guestId },
      });
      // Trả về cart rỗng
      return { products: [] };
    } catch (error) {
      console.error("Error clearing cart on server:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload); // SỬA: action.payload thay vì state.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Failed to fetch cart";
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload); // SỬA: action.payload thay vì state.payload
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload); // SỬA: action.payload thay vì state.payload
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from cart";
      })

      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart || action.payload; // SỬA: Xử lý cả hai trường hợp
        saveCartToStorage(state.cart);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload); // SỬA: action.payload thay vì state.payload
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update cart item quantity";
      })

      .addCase(clearCartServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartServer.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = { products: [] };
        localStorage.removeItem("cart");
      })
      .addCase(clearCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to clear cart on server";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
