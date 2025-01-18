'use client';

import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { setCurrentUser, setLoading } from '@/lib/features/auth/authSlice';
import { authService } from '@/services/auth.service';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(setLoading(true));
        const isAuthenticated = await authService.checkAuth();
        if (isAuthenticated) {
          const user = await authService.getProfile();
          dispatch(setCurrentUser(user));
        } else {
          dispatch(setCurrentUser(null));
        }
      } catch (error) {
        dispatch(setCurrentUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
}
