import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Product, CartItem } from "@/types/product.d";
import { cartService } from "@/services/cart.service";

interface CartState {
  cartItems: CartItem[];
  wishlists: Product[];
  isCartOpen: boolean;
  loading: boolean;
  error: string | null;
  selectedColor: string | null;
  selectedSize: string | null;
  pendingCartItem: CartItem | null;
  isInitialized: boolean;
  orderStatus: string | null;
}

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (items: CartItem[], { rejectWithValue }) => {
    try {
      const response = await cartService.syncCart(items);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async (orderData: {
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      phone: string;
    };
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod';
    totalAmount: number;
  }, { getState, rejectWithValue }) => {
    try {
      const response = await cartService.placeOrder(orderData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

const loadCartFromStorage = (userId?: string): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = userId ? `cart_${userId}` : 'cart_guest';
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const loadWishlistFromStorage = (userId?: string): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = userId ? `wishlist_${userId}` : 'wishlist_guest';
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading wishlist from storage:', error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[], userId?: string) => {
  if (typeof window === 'undefined') return;
  try {
    const key = userId ? `cart_${userId}` : 'cart_guest';
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const saveWishlistToStorage = (items: Product[], userId?: string) => {
  if (typeof window === 'undefined') return;
  try {
    const key = userId ? `wishlist_${userId}` : 'wishlist_guest';
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

const clearCartFromStorage = (userId?: string) => {
  if (typeof window === 'undefined') return;
  try {
    const guestKey = 'cart_guest';
    const userKey = userId ? `cart_${userId}` : null;
    
    localStorage.removeItem(guestKey);
    if (userKey) localStorage.removeItem(userKey);
  } catch (error) {
    console.error('Error clearing cart from storage:', error);
  }
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
  isInitialized: false,
  orderStatus: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart(state, action: PayloadAction<string | undefined>) {
      const items = loadCartFromStorage(action.payload);
      state.cartItems = items;
      state.wishlists = loadWishlistFromStorage(action.payload);
      state.isInitialized = true;
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.cartItems.find(
        item => 
          (typeof item.product === 'string' ? item.product : item.product._id) === 
          (typeof action.payload.product === 'string' ? action.payload.product : action.payload.product._id)
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        if (newQuantity <= 5) {
          existingItem.quantity = newQuantity;
          existingItem.selectedColor = action.payload.selectedColor || existingItem.selectedColor;
          existingItem.selectedSize = action.payload.selectedSize || existingItem.selectedSize;
        }
      } else {
        if (action.payload.quantity <= 5) {
          state.cartItems.push(action.payload);
        }
      }
      saveCartToStorage(state.cartItems);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(
        item => 
          (typeof item.product === 'string' ? item.product : item.product._id) !== action.payload
      );
      saveCartToStorage(state.cartItems);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.cartItems.find(
        item => 
          (typeof item.product === 'string' ? item.product : item.product._id) === action.payload.productId
      );
      if (item && action.payload.quantity <= 5 && action.payload.quantity >= 1) {
        item.quantity = action.payload.quantity;
        saveCartToStorage(state.cartItems);
      }
    },
    clearCart(state) {
      state.cartItems = [];
      clearCartFromStorage();
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    handleCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
    },
    setPendingCartItem(state, action: PayloadAction<CartItem | null>) {
      state.pendingCartItem = action.payload;
    },
    incrementAmount(state, action: PayloadAction<string>) {
      const item = state.cartItems.find(
        item => (typeof item.product === 'string' ? item.product : item.product._id) === action.payload
      );
      if (item && item.quantity < 5) {
        item.quantity += 1;
        saveCartToStorage(state.cartItems);
      }
    },
    decrementAmount(state, action: PayloadAction<string>) {
      const item = state.cartItems.find(
        item => (typeof item.product === 'string' ? item.product : item.product._id) === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToStorage(state.cartItems);
      }
    },
    toggleWishlist(state, action: PayloadAction<Product>) {
      const existingItem = state.wishlists.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        state.wishlists = state.wishlists.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        state.wishlists.push(action.payload);
      }
      saveWishlistToStorage(state.wishlists);
    },
    setOrderStatus(state, action: PayloadAction<string | null>) {
      state.orderStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items || [];
        saveCartToStorage(state.cartItems);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Sync Cart
    builder
      .addCase(syncCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price, // Price in INR
          selectedColor: item.color || null,
          selectedSize: item.size || null
        }));
        saveCartToStorage(state.cartItems);
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Place Order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderStatus = 'pending';
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        clearCartFromStorage();
        state.orderStatus = 'success';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.orderStatus = 'failed';
      });
  },
});

export const {
  initializeCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setError,
  setLoading,
  handleCartOpen,
  setPendingCartItem,
  incrementAmount,
  decrementAmount,
  toggleWishlist,
  setOrderStatus,
} = cartSlice.actions;

export default cartSlice.reducer;
