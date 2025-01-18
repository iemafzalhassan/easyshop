import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "@/types/product";

interface CartState {
  cartItems: CartItem[];
  wishlists: Product[];
  isCartOpen: boolean;
  loading: boolean;
  error: string | null;
  selectedColor: string | null;
  selectedSize: string | null;
}

const initialState: CartState = {
  cartItems: [],
  wishlists: [],
  isCartOpen: false,
  loading: false,
  error: null,
  selectedColor: null,
  selectedSize: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },

    incrementAmount: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decrementAmount: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ _id: string; quantity: number }>
    ) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    handleCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },

    handleCountValue: (state, action: PayloadAction<"none">) => {
      // This is now just a placeholder for backward compatibility
      // We don't need to do anything here as we're handling quantity differently
    },

    setSelectedColor: (state, action: PayloadAction<string | null>) => {
      state.selectedColor = action.payload;
    },

    setSelectedSize: (state, action: PayloadAction<string | null>) => {
      state.selectedSize = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const existingItem = state.wishlists.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        state.wishlists = state.wishlists.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        state.wishlists.push(action.payload);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementAmount,
  decrementAmount,
  updateQuantity,
  clearCart,
  handleCartOpen,
  handleCountValue,
  setSelectedColor,
  setSelectedSize,
  setLoading,
  setError,
  toggleWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;
