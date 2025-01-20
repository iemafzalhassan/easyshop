import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor for adding auth token and api version
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add /api/v1 prefix to all requests
    config.url = `/api/v1${config.url}`;
    
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
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await authService.refreshToken();
        if (response) {
          // Retry the original request with new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        console.error('Token refresh failed:', refreshError);
        // Redirect to login or handle as needed
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
