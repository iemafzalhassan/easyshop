import { Product } from '@/types/product';
import { Shop } from '@/types/shop';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 999.99,
    category: 'electronics',
    subcategory: 'smartphones',
    images: ['/static/images/products/smartphone-x-1.jpg'],
    stock: 50,
    shop: {
      id: '1',
      name: 'Tech Store',
    },
    rating: 4.5,
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Tech Store',
    description: 'Your one-stop shop for all electronics',
    logo: '/static/images/shops/tech-store-logo.jpg',
    coverImage: '/static/images/shops/tech-store-cover.jpg',
    owner: {
      id: '1',
      name: 'John Doe',
    },
    rating: 4.8,
    reviews: [],
    categories: ['electronics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockBanners = [
  {
    id: '1',
    title: 'Summer Sale',
    description: 'Up to 50% off on summer collection',
    image: '/static/images/banners/summer-sale.jpg',
    link: '/sale/summer',
  },
];
