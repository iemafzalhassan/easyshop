import { api } from './api';
import { CartItem } from '@/types/product.d';

const CART_ENDPOINTS = {
  SYNC: '/api/v1/cart/sync',
  GET: '/api/v1/cart',
  ADD: '/cart',
  UPDATE: '/cart/',
  REMOVE: '/cart/',
  CLEAR: '/cart',
  PLACE_ORDER: '/orders',
};

export const cartService = {
  async getCart() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { items: [] };
      }

      const response = await api.get(CART_ENDPOINTS.GET);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { items: [] };
    }
  },

  async addToCart(productId: string, quantity: number, color?: string, size?: string) {
    try {
      const response = await api.post(CART_ENDPOINTS.ADD, {
        productId,
        quantity,
        color: color || null,
        size: size || null
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  async updateCartItem(productId: string, quantity: number, color?: string, size?: string) {
    try {
      const response = await api.patch(`${CART_ENDPOINTS.UPDATE}${productId}`, {
        quantity,
        color: color || null,
        size: size || null
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  },

  async removeFromCart(productId: string) {
    try {
      const response = await api.delete(`${CART_ENDPOINTS.REMOVE}${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove from cart');
    }
  },

  async clearCart() {
    try {
      const response = await api.delete(CART_ENDPOINTS.CLEAR);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  },

  async validateCartItem(item: CartItem) {
    if (!item.product) {
      throw new Error('Product is required');
    }

    if (item.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    if (item.quantity > 5) {
      throw new Error('Maximum 5 items allowed per product');
    }

    return true;
  },

  async syncCart(items: CartItem[]) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { items: [] };
      }

      // Transform items to ensure proper product ID handling
      const transformedItems = items.map(item => ({
        product: typeof item.product === 'string' ? item.product : item.product._id,
        quantity: item.quantity,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,
        price: item.price
      }));

      const response = await api.post(CART_ENDPOINTS.SYNC, { items: transformedItems });
      return response.data.data || { items: [] };
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  },

  async placeOrder(orderData: {
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      phone: string;
    };
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'cod';
    totalAmount: number;
  }) {
    try {
      // First get current cart
      const cartResponse = await this.getCart();
      
      if (!cartResponse?.data?.cart?.items || cartResponse.data.cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Create order payload
      const orderPayload = {
        ...orderData,
        items: cartResponse.data.cart.items.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor || null,
          selectedSize: item.selectedSize || null
        }))
      };

      // Place order
      const response = await api.post(CART_ENDPOINTS.PLACE_ORDER, orderPayload);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to place order');
      }

      // Clear cart after successful order
      await this.clearCart();
      
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }
};
