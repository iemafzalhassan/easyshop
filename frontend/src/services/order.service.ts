import { api } from './api';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentInfo {
  method: 'card' | 'upi' | 'netbanking' | 'cod';
}

export interface CreateOrderData {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod';
  totalAmount: number;
}

export interface Order {
  _id: string;
  user: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class OrderService {
  async createOrder(data: CreateOrderData) {
    console.log('Creating order with data:', data);
    const response = await api.post('/orders', data);
    return response.data;
  }

  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(id: string, status: Order['status']) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  async cancelOrder(id: string) {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  }
}

export const orderService = new OrderService();
