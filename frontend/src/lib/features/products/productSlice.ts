import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product.d";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  lastFetch: null,
};

// 5 minutes in milliseconds
const CACHE_DURATION = 5 * 60 * 1000;

export const shouldRefetchProducts = (lastFetch: number | null): boolean => {
  if (!lastFetch) return true;
  const now = Date.now();
  return now - lastFetch > CACHE_DURATION;
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.lastFetch = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setLoading, setError } = productSlice.actions;

export default productSlice.reducer;
