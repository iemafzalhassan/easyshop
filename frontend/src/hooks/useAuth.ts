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
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      dispatch(removeCurrentUser());
      dispatch(setLoading(false));
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(removeCurrentUser());
      return;
    }

    try {
      dispatch(setLoading(true));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/me');
      dispatch(setCurrentUser(response.data.user));
    } catch (err) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      dispatch(removeCurrentUser());
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
