import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor for adding auth token and api version
api.interceptors.request.use(
  (config) => {
    // Add /api/v1 prefix to all requests except those that already have it
    if (!config.url?.startsWith('/api/v1')) {
      config.url = `/api/v1${config.url}`;
    }

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
          }
          break;
        case 404:
          console.error('Resource not found:', error.config.url);
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);
