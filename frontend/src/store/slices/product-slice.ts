import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  shop: {
    id: string;
    name: string;
  };
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
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
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    sortBy: null,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
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
  setSelectedProduct,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
