export const SITE_CONFIG = {
  name: 'EasyShop',
  description: 'Modern E-commerce Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: 'https://easyshop.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/easyshop',
    github: 'https://github.com/easyshop',
  },
};

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (id: string) => `/products/${id}`,
  SHOPS: '/shops',
  SHOP: (id: string) => `/shops/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ORDERS: '/profile/orders',
  AUTH: {
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    FORGOT_PASSWORD: '/forgot-password',
  },
};

export const API_ROUTES = {
  AUTH: {
    SIGN_IN: '/auth/login',
    SIGN_UP: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  PRODUCTS: '/products',
  SHOPS: '/shops',
  ORDERS: '/orders',
  USERS: '/users',
};

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  SHOPS: 'shops',
  SHOP: 'shop',
  CART: 'cart',
  ORDERS: 'orders',
  USER: 'user',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme',
  CART: 'cart',
};
