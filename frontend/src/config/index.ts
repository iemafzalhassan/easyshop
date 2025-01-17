export const config = {
  app: {
    name: 'EasyShop',
    description: 'Modern E-commerce Platform',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
  },
  auth: {
    storageKey: 'easyshop_auth',
    tokenKey: 'token',
  },
  images: {
    domains: ['localhost'],
    path: '/static/images',
    defaultAvatar: '/static/images/default-avatar.png',
    defaultProduct: '/static/images/default-product.png',
    defaultShop: '/static/images/default-shop.png',
  },
  pagination: {
    defaultLimit: 10,
    defaultPage: 1,
  },
  seo: {
    titleTemplate: '%s | EasyShop',
    defaultTitle: 'EasyShop - Modern E-commerce Platform',
    defaultDescription: 'Shop the latest products from top brands at EasyShop',
  },
} as const;
