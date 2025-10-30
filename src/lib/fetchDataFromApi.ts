import axios from "axios";
import { cookies } from 'next/headers';

// Get the base URL from environment
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create a new Axios instance
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Function to get token based on environment
const getToken = () => {
  if (typeof window !== 'undefined') {
    // Client-side: get token from cookies
    const cookieStore = document.cookie.split(';');
    const tokenCookie = cookieStore.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1].trim()) : null;
  } else {
    // Server-side: get token from next/headers
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    return token?.value || null;
  }
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const fetchData = {
  get: async (url: string, params = {}) => {
    try {
      const response = await axiosInstance.get(url, { params });
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      // Ensure a consistent error response
      return {
        data: {
          products: [],
          total: 0
        }
      };
    }
  },
  post: async (url: string, data = {}) => {
    try {
      const response = await axiosInstance.post(url, data);
      return response;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },
};

export default fetchData;
