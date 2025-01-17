import { api } from './api';
import { Shop } from '../store/slices/shop-slice';

export interface ShopFilters {
  category?: string;
  rating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const shopService = {
  async getShops(filters?: ShopFilters) {
    const response = await api.get('/shops', { params: filters });
    return response.data;
  },

  async getShopById(id: string) {
    const response = await api.get(`/shops/${id}`);
    return response.data;
  },

  async getShopProducts(shopId: string) {
    const response = await api.get(`/shops/${shopId}/products`);
    return response.data;
  },

  async getShopCategories(shopId: string) {
    const response = await api.get(`/shops/${shopId}/categories`);
    return response.data;
  },

  async getShopReviews(shopId: string) {
    const response = await api.get(`/shops/${shopId}/reviews`);
    return response.data;
  },

  async addShopReview(shopId: string, data: { rating: number; comment: string }) {
    const response = await api.post(`/shops/${shopId}/reviews`, data);
    return response.data;
  },
};
