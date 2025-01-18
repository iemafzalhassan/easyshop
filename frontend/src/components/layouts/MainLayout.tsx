'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import { setCurrentUser, setLoading } from '@/lib/features/auth/authSlice';
import { authService } from '@/services/auth.service';
import { addToCart, clearCart, initializeCart, setPendingCartItem } from '@/lib/features/cart/cartSlice';
import { usePathname, useRouter } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { pendingCartItem } = useAppSelector((state) => state.cart);
  const { currentUser, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // Handle authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(setLoading(true));
        const isAuthenticated = await authService.checkAuth();
        
        if (isAuthenticated) {
          const user = await authService.getProfile();
          dispatch(setCurrentUser(user));
          // Initialize cart with user-specific items
          dispatch(initializeCart(user?._id));
        } else {
          dispatch(setCurrentUser(null));
          // Clear cart on logout
          dispatch(clearCart());
          // Initialize guest cart
          dispatch(initializeCart(undefined));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch(setCurrentUser(null));
        dispatch(clearCart());
        dispatch(initializeCart(undefined));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  // Handle protected routes
  useEffect(() => {
    const protectedRoutes = ['/profile', '/checkout', '/orders'];
    const authRoutes = ['/login', '/register'];

    if (!loading) {
      if (protectedRoutes.some(route => pathname?.startsWith(route))) {
        if (!isAuthenticated) {
          router.replace(`/login?redirect=${pathname}`);
        }
      } else if (authRoutes.includes(pathname || '') && isAuthenticated) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Handle pending cart items after login
  useEffect(() => {
    if (currentUser && pendingCartItem) {
      // Add the pending item to the user's cart
      dispatch(addToCart(pendingCartItem));
      // Clear the pending item
      dispatch(setPendingCartItem(null));
    }
  }, [currentUser, pendingCartItem, dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <>{children}</>;
}
