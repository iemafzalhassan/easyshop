import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';

export interface Product {
  _id: string;  // Changed from id to _id to match API
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string[];
  stock: number;
  rating: number;
  reviews: number;
  shop_category?: string;
  shop: {
    _id: string;  // Changed from id to _id to match API
    name: string;
  };
  lastUpdated?: number;
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  filters: {
    category: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    rating: number | null;
    sortBy: 'price-asc' | 'price-desc' | 'rating' | null;
  };
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  filteredProducts: [],
  loading: false,
  error: null,
  lastFetch: null,
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    sortBy: null,
  },
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
      state.lastFetch = Date.now();
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = { ...action.payload, lastUpdated: Date.now() };
        // Update filtered products if needed
        const filteredIndex = state.filteredProducts.findIndex(p => p._id === action.payload._id);
        if (filteredIndex !== -1) {
          state.filteredProducts[filteredIndex] = state.products[index];
        }
      }
    },
    invalidateCache: (state) => {
      state.lastFetch = null;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters
      let filtered = [...state.products];
      
      if (state.filters.category) {
        filtered = filtered.filter(p => p.category === state.filters.category);
      }
      if (state.filters.minPrice !== null) {
        filtered = filtered.filter(p => p.price >= state.filters.minPrice!);
      }
      if (state.filters.maxPrice !== null) {
        filtered = filtered.filter(p => p.price <= state.filters.maxPrice!);
      }
      if (state.filters.rating !== null) {
        filtered = filtered.filter(p => p.rating >= state.filters.rating!);
      }
      
      // Apply sorting
      if (state.filters.sortBy) {
        switch (state.filters.sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
      
      state.filteredProducts = filtered;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = state.products;
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
  setProducts,
  updateProduct,
  invalidateCache,
  setSelectedProduct,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = productSlice.actions;

export const selectProducts = (state: RootState) => state.products.products;
export const selectFilteredProducts = (state: RootState) => state.products.filteredProducts;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;

export const shouldRefetchProducts = (state: { products: ProductsState }): boolean => {
  if (!state.products.lastFetch) return true;
  const now = Date.now();
  return now - state.products.lastFetch > CACHE_DURATION;
};

export default productSlice.reducer;
