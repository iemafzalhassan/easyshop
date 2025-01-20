"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { initializeCart, fetchCart, clearCart } from "@/lib/features/cart/cartSlice";
import { useRouter } from "next/navigation";

const CartInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const { isInitialized, cartItems } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    const initCart = async () => {
      if (!isInitialized) {
        // Check if we have a token before trying to fetch cart
        const token = localStorage.getItem('token');
        
        if (token && isAuthenticated && currentUser?._id) {
          try {
            // Fetch cart from server for authenticated users
            await dispatch(fetchCart());
          } catch (error) {
            console.error("Failed to fetch cart:", error);
            // Initialize with local storage as fallback
            dispatch(initializeCart(currentUser._id));
          }
        } else {
          // For non-authenticated users, use local storage
          dispatch(initializeCart(undefined));
        }
      }
    };

    initCart();
  }, [dispatch, isInitialized, isAuthenticated, currentUser]);

  // Handle cart cleanup on logout
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      // Save cart items to local storage before clearing
      const localCart = cartItems.map(item => ({
        ...item,
        userId: undefined
      }));
      localStorage.setItem('cart', JSON.stringify(localCart));
      
      dispatch(clearCart());
      router.push("/");
    }
  }, [isAuthenticated, cartItems, dispatch, router]);

  return null;
};

export default CartInitializer;
