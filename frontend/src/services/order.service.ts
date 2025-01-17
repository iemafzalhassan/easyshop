import { api } from './api';
import { CartItem } from '../store/slices/cart-slice';

export interface OrderItem extends CartItem {
  productId: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'cod';
  totalAmount: number;
}

export interface Order extends CreateOrderData {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  async createOrder(data: CreateOrderData) {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrderById(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  async cancelOrder(id: string) {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },
};
