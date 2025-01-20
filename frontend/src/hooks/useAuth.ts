import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { setCurrentUser, removeCurrentUser, setLoading, setError } from '@/lib/features/auth/authSlice';
import { api } from '@/services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await api.post('/auth/login', { email, password });
      dispatch(setCurrentUser(response.data.user));
      
      // Store the token
      localStorage.setItem('token', response.data.token);
      // Update the API instance with the new token
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Login failed'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      dispatch(setLoading(true));
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      dispatch(removeCurrentUser());
      
      // Redirect to login
      window.location.href = '/login';
      dispatch(setLoading(false));
    }
  };

  const checkAuth = async () => {
    try {
      // Only check if we think we're authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(removeCurrentUser());
        return null;
      }

      dispatch(setLoading(true));
      const response = await api.get('/auth/check');
      
      if (response.data?.user) {
        dispatch(setCurrentUser(response.data.user));
        return response.data.user;
      } else {
        // Clear auth state if no user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        dispatch(removeCurrentUser());
        return null;
      }
    } catch (error: any) {
      // Clear auth state on any auth check error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      dispatch(removeCurrentUser());
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    isAuthenticated,
    currentUser,
    loading,
    error,
    login,
    logout,
    checkAuth
  };
};

export default useAuth;
