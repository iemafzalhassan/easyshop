import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  isCartOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  isCartOpen: false,
  loading: false,
  error: null,
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
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload.id
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  handleCartOpen,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
