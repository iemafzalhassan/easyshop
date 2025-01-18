import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, CartItem } from "@/types/product.d";

interface CartState {
  cartItems: CartItem[];
  wishlists: Product[];
  isCartOpen: boolean;
  loading: boolean;
  error: string | null;
  selectedColor: string | null;
  selectedSize: string | null;
  pendingCartItem: CartItem | null;
}

const loadCartFromStorage = (userId?: string): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const key = userId ? `cart_${userId}` : 'cart_guest';
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const loadWishlistFromStorage = (userId?: string): Product[] => {
  if (typeof window === 'undefined') return [];
  const key = userId ? `wishlist_${userId}` : 'wishlist_guest';
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const saveCartToStorage = (items: CartItem[], userId?: string) => {
  if (typeof window === 'undefined') return;
  const key = userId ? `cart_${userId}` : 'cart_guest';
  localStorage.setItem(key, JSON.stringify(items));
};

const saveWishlistToStorage = (items: Product[], userId?: string) => {
  if (typeof window === 'undefined') return;
  const key = userId ? `wishlist_${userId}` : 'wishlist_guest';
  localStorage.setItem(key, JSON.stringify(items));
};

const initialState: CartState = {
  cartItems: [],
  wishlists: [],
  isCartOpen: false,
  loading: false,
  error: null,
  selectedColor: null,
  selectedSize: null,
  pendingCartItem: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart: (state, action: PayloadAction<string | undefined>) => {
      state.cartItems = loadCartFromStorage(action.payload);
      state.wishlists = loadWishlistFromStorage(action.payload);
    },
    
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (!action.payload) {
        return;
      }

      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.cartItems.push(action.payload);
      }

      saveCartToStorage(state.cartItems);
    },

    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.wishlists.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingIndex !== -1) {
        state.wishlists.splice(existingIndex, 1);
      } else {
        state.wishlists.push(action.payload);
      }

      saveWishlistToStorage(state.wishlists);
    },

    setPendingCartItem(state, action: PayloadAction<CartItem | null>) {
      state.pendingCartItem = action.payload;
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      saveCartToStorage(state.cartItems);
    },

    incrementAmount(state, action: PayloadAction<string>) {
      const cartItem = state.cartItems.find((item) => item._id === action.payload);
      if (cartItem) {
        cartItem.quantity++;
        saveCartToStorage(state.cartItems);
      }
    },

    decrementAmount(state, action: PayloadAction<string>) {
      const cartItem = state.cartItems.find((item) => item._id === action.payload);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
        saveCartToStorage(state.cartItems);
      }
    },

    updateQuantity(
      state,
      action: PayloadAction<{ _id: string; quantity: number }>
    ) {
      const cartItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (cartItem) {
        cartItem.quantity = Math.max(1, action.payload.quantity);
        saveCartToStorage(state.cartItems);
      }
    },

    clearCart(state) {
      state.cartItems = [];
      saveCartToStorage(state.cartItems);
    },

    handleCartOpen(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    setSelectedColor(state, action: PayloadAction<string | null>) {
      state.selectedColor = action.payload;
    },

    setSelectedSize(state, action: PayloadAction<string | null>) {
      state.selectedSize = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
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
  setSelectedColor,
  setSelectedSize,
  setLoading,
  setError,
  initializeCart,
  setPendingCartItem,
  toggleWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;
