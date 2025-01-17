import { api } from './api';
import { Product } from '../store/slices/product-slice';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  async getProducts(filters?: ProductFilters) {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  async getProductById(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getProductsByCategory(category: string) {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  async searchProducts(query: string) {
    const response = await api.get(`/products/search`, {
      params: { q: query }
    });
    return response.data;
  },

  async getProductReviews(productId: string) {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  async addProductReview(productId: string, data: { rating: number; comment: string }) {
    const response = await api.post(`/products/${productId}/reviews`, data);
    return response.data;
  },
};
