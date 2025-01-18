import { Product } from "@/types/product";

// Dummy descriptions for each category
const CATEGORY_DESCRIPTIONS: Record<string, string[]> = {
  gadgets: [
    "Experience cutting-edge technology with this innovative gadget. Perfect for tech enthusiasts and early adopters.",
    "Stay connected and productive with this state-of-the-art device. Features the latest advancements in technology.",
    "Enhance your digital lifestyle with this smart device. Seamlessly integrates with your existing tech ecosystem."
  ],
  grocery: [
    "Fresh, high-quality ingredients sourced from local farmers. Perfect for healthy and delicious meals.",
    "Organic and sustainably sourced groceries. Nourish your body with nature's finest ingredients.",
    "Premium quality food items selected for maximum freshness and taste. Elevate your cooking experience."
  ],
  bakery: [
    "Freshly baked with premium ingredients. Our artisanal recipes bring the authentic taste of traditional baking.",
    "Made from scratch daily using time-honored recipes. Experience the warmth of freshly baked goodness.",
    "Handcrafted with care using the finest ingredients. Perfect for special occasions or everyday indulgence."
  ],
  clothing: [
    "Premium quality fabric meets contemporary design. Express your style with our fashion-forward collection.",
    "Comfortable, stylish, and made to last. Perfect for any occasion and every season.",
    "Trendy designs crafted with attention to detail. Elevate your wardrobe with our latest collection."
  ],
  makeup: [
    "Professional-grade cosmetics for a flawless look. Dermatologist-tested and suitable for all skin types.",
    "Create stunning looks with our premium beauty products. Long-lasting and easy to apply.",
    "Enhance your natural beauty with our carefully formulated products. Cruelty-free and skin-friendly."
  ],
  bags: [
    "Stylish and functional bags for every occasion. Crafted with premium materials for lasting durability.",
    "Contemporary designs meet practical functionality. Perfect for work, travel, or everyday use.",
    "Premium quality bags that combine style with practicality. Built to last and designed to impress."
  ],
  furniture: [
    "Elegant furniture pieces that blend style with comfort. Transform your space with our premium collection.",
    "Contemporary designs crafted with premium materials. Perfect for modern living spaces.",
    "Timeless furniture pieces that combine form and function. Elevate your home's aesthetic."
  ],
  books: [
    "Immerse yourself in captivating stories and knowledge. Carefully curated for all reading preferences.",
    "Expand your horizons with our diverse collection of books. From classics to contemporary bestsellers.",
    "Quality editions of timeless literature and modern works. Perfect for book lovers and collectors."
  ],
  medicine: [
    "High-quality healthcare products for your wellbeing. Sourced from trusted manufacturers.",
    "Premium quality medical supplies for your health needs. FDA-approved and safe to use.",
    "Reliable healthcare products from trusted brands. Your health is our priority."
  ]
};

// Function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to enrich product with metadata
export const enrichProductWithMetadata = (product: Product): Product => {
  const category = product.shop_category?.toLowerCase() || 'gadgets';
  const descriptions = CATEGORY_DESCRIPTIONS[category] || CATEGORY_DESCRIPTIONS.gadgets;

  return {
    ...product,
    description: product.description || getRandomItem(descriptions),
    rating: product.rating || Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
    reviews: product.reviews || [
      {
        user: "John Doe",
        rating: 5,
        comment: "Excellent product! Exactly what I was looking for.",
        createdAt: new Date().toISOString()
      },
      {
        user: "Jane Smith",
        rating: 4,
        comment: "Great quality and fast delivery. Would recommend.",
        createdAt: new Date().toISOString()
      }
    ],
    stock: product.stock || Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
    featured: product.featured || Math.random() > 0.8, // 20% chance of being featured
  };
};
