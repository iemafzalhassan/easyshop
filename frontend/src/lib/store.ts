import { configureStore } from "@reduxjs/toolkit";
import cart from "./features/cart/cartSlice";
import auth from "./features/auth/authSlice";
import sidebar from "./features/sidebar/sidebarSlice";
import checkout from "./features/checkout/checkoutSlice";
import products from "./features/products/productSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth,
      cart,
      sidebar,
      products,
      checkout,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
