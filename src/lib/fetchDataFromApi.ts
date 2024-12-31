import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchData = {
  get: async (url: string, params = {}) => {
    try {
      const response = await axiosInstance.get(url, { params });
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  post: async (url: string, data = {}) => {
    try {
      const response = await axiosInstance.post(url, data);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

export default fetchData;
