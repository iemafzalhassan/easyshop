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

  async register(data: RegisterData) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, data);
      const { token, user } = response.data.data;
      
      if (token) {
        setToken(token);
      }
      
      return { user, token };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
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

  async checkAuth(): Promise<boolean> {
    try {
      // Check both localStorage and cookie
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('token') || Cookies.get('token')
        : null;
        
      if (!token) {
        return false;
      }

      // Set token in headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get(AUTH_ENDPOINTS.CHECK);
      const isValid = response.data.status === 'success';

      if (!isValid) {
        await this.logout();
      }

      return isValid;
    } catch (error: any) {
      console.error('Auth check error:', error);
      if (error.response?.status === 401) {
        await this.logout();
      }
      return false;
    }
  }
};
