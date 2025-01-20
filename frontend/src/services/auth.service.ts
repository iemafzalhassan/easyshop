import { api } from './api';
import Cookies from 'js-cookie';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Add /api/v1 prefix to all endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  PROFILE: '/api/v1/auth/profile',
  CHECK: '/api/v1/auth/check',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  VALIDATE_TOKEN: '/api/v1/auth/validate-token',
} as const;

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    // Set token in both localStorage and cookie
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 7 }); // 7 days expiry
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    Cookies.remove('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
      const { token, user } = response.data.data;
      
      if (token) {
        setToken(token);
      }
      
      return { user, token };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
      const { token, user } = response.data.data;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token and user data
      setToken(token);

      // Initialize cart and other user data
      await this.initializeUserData(user);

      return { user, token };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.message === 'User already exists') {
        throw new Error('An account with this email already exists. Please login instead.');
      }

      // Handle other errors
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    }
  },

  async initializeUserData(user: User) {
    try {
      // Ensure we have a valid token
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Sync cart with backend
      if (typeof window !== 'undefined') {
        const pendingItems = localStorage.getItem('pendingCartItems');
        if (pendingItems) {
          try {
            const cartItems = JSON.parse(pendingItems);
            await api.post('/api/v1/cart/sync', { items: cartItems });
            localStorage.removeItem('pendingCartItems');
          } catch (error) {
            console.error('Error syncing cart:', error);
            // If token is invalid, try to refresh it
            if (error.response?.status === 401) {
              await this.refreshToken();
              // Retry cart sync with new token
              await api.post('/api/v1/cart/sync', { items: JSON.parse(pendingItems) });
              localStorage.removeItem('pendingCartItems');
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error initializing user data:', error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      const { token } = response.data;

      if (!token) {
        throw new Error('No token received from refresh endpoint');
      }

      // Update token in storage and API headers
      setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  },

  async validateToken() {
    try {
      const token = getToken();
      if (!token) return false;

      const response = await api.post(AUTH_ENDPOINTS.VALIDATE_TOKEN);
      return response.data.valid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  async logout() {
    try {
      removeToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getProfile(): Promise<User | null> {
    try {
      const response = await api.get(AUTH_ENDPOINTS.PROFILE);
      return response.data.data.user;
    } catch (error: any) {
      console.error('Get profile error:', error);
      if (error.response?.status === 401) {
        await this.logout();
      }
      return null;
    }
  },

  async checkAuth() {
    // First check if we have a token
    const token = getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error: any) {
      // Clear auth data on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      return null;
    }
  }
};
