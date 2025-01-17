import { Category } from '@/types/category';

export const PRODUCT_CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic items',
    image: '/static/images/categories/electronics.jpg',
    subcategories: [
      {
        id: 'smartphones',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories'
      },
      {
        id: 'laptops',
        name: 'Laptops',
        slug: 'laptops',
        description: 'Notebooks and laptops'
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing and fashion accessories',
    image: '/static/images/categories/fashion.jpg',
    subcategories: [
      {
        id: 'mens',
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Men\'s apparel and accessories'
      },
      {
        id: 'womens',
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Women\'s apparel and accessories'
      }
    ]
  }
];
