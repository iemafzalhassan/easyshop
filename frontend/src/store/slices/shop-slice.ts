import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  reviews: number;
  products: number;
  location: string;
  categories: string[];
}

export interface ShopsState {
  shops: Shop[];
  selectedShop: Shop | null;
  filteredShops: Shop[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    rating: number | null;
    sortBy: 'rating' | 'products' | null;
  };
}

const initialState: ShopsState = {
  shops: [],
  selectedShop: null,
  filteredShops: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    rating: null,
    sortBy: null,
  },
};

const shopSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {
    setShops: (state, action: PayloadAction<Shop[]>) => {
      state.shops = action.payload;
      state.filteredShops = action.payload;
    },
    setSelectedShop: (state, action: PayloadAction<Shop | null>) => {
      state.selectedShop = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ShopsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters
      let filtered = [...state.shops];
      
      if (state.filters.category) {
        filtered = filtered.filter(s => s.categories.includes(state.filters.category!));
      }
      if (state.filters.rating !== null) {
        filtered = filtered.filter(s => s.rating >= state.filters.rating!);
      }
      
      // Apply sorting
      if (state.filters.sortBy) {
        switch (state.filters.sortBy) {
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'products':
            filtered.sort((a, b) => b.products - a.products);
            break;
        }
      }
      
      state.filteredShops = filtered;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredShops = state.shops;
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
  setShops,
  setSelectedShop,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = shopSlice.actions;

export default shopSlice.reducer;
