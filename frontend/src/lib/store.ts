import { configureStore } from "@reduxjs/toolkit";
import cart from "./features/cart/cartSlice";
import auth from "./features/auth/authSlice";
import sidebar from "./features/sidebar/sidebarSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth,
      cart,
      sidebar,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
