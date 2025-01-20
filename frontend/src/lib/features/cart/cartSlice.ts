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
      const userId = action.payload;
      state.cartItems = loadCartFromStorage(userId);
      state.wishlists = loadWishlistFromStorage(userId);
      
      // Check for pending items if user just logged in
      if (typeof window !== 'undefined') {
        const pendingItems = localStorage.getItem('pendingCartItems');
        if (pendingItems) {
          try {
            const items = JSON.parse(pendingItems);
            state.cartItems = [...state.cartItems, ...items];
            localStorage.removeItem('pendingCartItems');
          } catch (error) {
            console.error('Error parsing pending cart items:', error);
          }
        }
      }
      
      state.isInitialized = true;
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        item => item.product === newItem.product
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.cartItems[existingItemIndex].quantity += newItem.quantity;
      } else {
        // Add new item
        state.cartItems.push(newItem);
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
      
      if (action.payload) {
        // Also update localStorage
        const pendingItems = JSON.parse(localStorage.getItem('pendingCartItems') || '[]');
        pendingItems.push(action.payload);
        localStorage.setItem('pendingCartItems', JSON.stringify(pendingItems));
      }
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
        if (action.payload?.cart?.items) {
          state.cartItems = action.payload.cart.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            selectedColor: item.selectedColor || null,
            selectedSize: item.selectedSize || null
          }));
          saveCartToStorage(state.cartItems);
        } else {
          state.cartItems = [];
        }
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
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.status === 'success') {
          state.cartItems = [];
          clearCartFromStorage();
          state.orderStatus = 'success';
        } else {
          state.error = 'Failed to place order';
          state.orderStatus = 'failed';
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to place order';
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
