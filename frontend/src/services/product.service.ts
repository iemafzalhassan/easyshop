import { api } from './api';
import type { Product, SingleProductType } from '@/types/product.d';

type GetProductsParams = {
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
};

type ProductResponse = {
  status: string;
  results: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: {
    products: Product[];
  };
};

type SingleProductResponse = {
  status: string;
  data: {
    product: SingleProductType;
  };
};

class ProductService {
  async getProducts(params: GetProductsParams = {}): Promise<ProductResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category) queryParams.append('category', params.category);
      if (params.featured) queryParams.append('featured', 'true');
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      
      const response = await api.get(`/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<SingleProductResponse> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<SingleProductResponse> {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<SingleProductResponse> {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
