import { api } from './api';
import { CartItem } from '@/types/product.d';

export const cartService = {
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error: any) {
      console.error('Error getting cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to get cart');
    }
  },

  async addToCart(productId: string, quantity: number, color?: string, size?: string) {
    try {
      const response = await api.post('/cart', {
        productId,
        quantity,
        color: color || null,
        size: size || null
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  async updateCartItem(productId: string, quantity: number, color?: string, size?: string) {
    try {
      const response = await api.patch(`/cart/${productId}`, {
        quantity,
        color: color || null,
        size: size || null
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  },

  async removeFromCart(productId: string) {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove from cart');
    }
  },

  async clearCart() {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error: any) {
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
      if (!items || items.length === 0) {
        return { items: [] };
      }

      // Format items before validation to ensure consistent structure
      const formattedItems = items.map(item => ({
        ...item,
        productId: typeof item.product === 'string' ? item.product : item.product._id,
        color: item.selectedColor || null,
        size: item.selectedSize || null
      }));

      // Validate each item before syncing
      for (const item of formattedItems) {
        await this.validateCartItem(item);
      }

      const response = await api.post('/cart/sync', { 
        items: formattedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: item.price
        }))
      });
      
      if (!response.data?.data?.cart) {
        throw new Error('Invalid response from server');
      }

      return response.data.data.cart;
    } catch (error: any) {
      console.error('Error syncing cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to sync cart');
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
      
      if (!cartResponse?.items || cartResponse.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Create order payload
      const orderPayload = {
        ...orderData,
        items: cartResponse.items.map(item => ({
          product: item._id || item.productId,
          quantity: item.quantity,
          price: item.price,
          color: item.color || item.selectedColor || null,
          size: item.size || item.selectedSize || null
        }))
      };

      // Place order
      const response = await api.post('/orders', orderPayload);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to place order');
      }

      // Clear cart after successful order
      await this.clearCart();
      
      return response.data;
    } catch (error: any) {
      console.error('Error placing order:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to place order');
    }
  }
};
