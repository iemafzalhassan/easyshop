// Base product interface with MongoDB ID
export interface BaseMongoProduct {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  unit_of_measure: string;
  shop_category: string;
}

// Product interface from backend
export interface Product extends BaseMongoProduct {
  description?: string;
  category?: string;
  categories?: string[];
  image: string | string[];
  stock?: number;
  shop?: string;
  rating?: number;
  featured?: boolean;
  colors?: string[];
  sizes?: string[];
  reviews?: Array<{
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

// Cart item interface
export interface CartItem extends BaseMongoProduct {
  image: string; // Cart items always have a single image
  quantity: number;
  color?: string;
  size?: string;
}

// Product display interface (used in UI components)
export interface ProductDisplay extends BaseMongoProduct {
  title?: string; // Optional display title
  image: string | string[]; // Can be single image or array
}

// Re-export AllProduct for backward compatibility
export type AllProduct = ProductDisplay;
