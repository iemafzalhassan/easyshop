import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/product-slice';
import cartReducer from './slices/cart-slice';
import authReducer from './slices/auth-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
