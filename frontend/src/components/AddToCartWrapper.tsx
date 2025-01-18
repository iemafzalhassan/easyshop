"use client";

import {
  addToCart,
  removeFromCart,
  setPendingCartItem,
} from "@/lib/features/cart/cartSlice";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Product, CartItem, BaseMongoProduct } from "@/types/product.d";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

// Default images for each category
const DEFAULT_IMAGES: Record<string, string> = {
  bakery: "/assets/images/products/bakery/bakery1.png",
  books: "/assets/images/products/books/book1.png",
  clothing: "/assets/images/products/clothing/clothing1.png",
  furniture: "/assets/images/products/furniture/furniture1.png",
  gadgets: "/assets/images/products/gadgets/macbookairm1.png",
  grocery: "/assets/images/products/grocery/grocery1.png",
  makeup: "/assets/images/products/makeup/makeup1.png",
  medicine: "/assets/images/products/medicine/medicine1.png",
  bags: "/assets/images/products/bags/bag1.png",
};

type AddToCartWrapperProps = {
  product?: Product;
  btnStyle?: "icon-only" | "full-width" | "compact";
  className?: string;
  redirectToCheckout?: boolean;
};

const AddToCartWrapper = ({
  product,
  btnStyle = "full-width",
  className,
  redirectToCheckout = false,
}: AddToCartWrapperProps) => {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [addedItem, setAddedItem] = useState<CartItem | undefined>();
  const { cartItems, selectedColor, selectedSize } = useAppSelector(
    (state) => state.cart
  );
  const { isAuthenticated, loading: authLoading, currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Return early if product is undefined
  if (!product?._id) {
    console.warn('AddToCartWrapper: Product is undefined or missing _id');
    return null;
  }

  // Get the main image from product
  const getProductImage = (product: Product): string => {
    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    }

    if (typeof product.image === 'string' && product.image) {
      if (product.image.includes('cloudinary.com')) {
        return product.image;
      }
      if (product.image.startsWith('/')) {
        return product.image;
      }
      if (product.shop_category) {
        const category = product.shop_category.toLowerCase();
        return `/assets/images/products/${category}/${product.image}`;
      }
    }

    if (product.shop_category) {
      const category = product.shop_category.toLowerCase();
      return DEFAULT_IMAGES[category] || DEFAULT_IMAGES.gadgets;
    }

    return DEFAULT_IMAGES.gadgets;
  };

  useEffect(() => {
    if (product?._id) {
      const foundItem = cartItems.find(item => item._id === product._id);
      setAddedItem(foundItem);
    }
  }, [product?._id, cartItems]);

  // handle add to cart button
  const handleAddToCart = () => {
    if (authLoading) {
      return; // Prevent action while auth state is loading
    }

    // Extract base product fields
    const baseProduct: BaseMongoProduct = {
      _id: product._id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      unit_of_measure: product.unit_of_measure,
      shop_category: product.shop_category,
    };

    // Create cart item with required fields
    const cartItem: CartItem = {
      ...baseProduct,
      image: getProductImage(product),
      quantity: 1,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    };

    // For clothing items, require color and size selection
    if (product.shop_category === "clothing") {
      if (!selectedColor || !selectedSize) {
        showError("Please select both color and size before adding to cart");
        return;
      }
    }

    // If user is not authenticated, store the item and redirect to login
    if (!isAuthenticated) {
      // Store the item before redirecting
      dispatch(setPendingCartItem(cartItem));
      
      // Determine return URL
      const returnUrl = redirectToCheckout ? '/checkout' : window.location.pathname;
      
      // Use router.replace to prevent back navigation to login page
      router.replace(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    try {
      // Handle add/remove from cart
      if (addedItem) {
        dispatch(removeFromCart(product._id));
        success("Item has been removed from your cart");
      } else {
        dispatch(addToCart(cartItem));
        success("Item has been added to your cart");
        
        // If redirectToCheckout is true and user is authenticated, go to checkout
        if (redirectToCheckout && isAuthenticated) {
          router.push('/checkout');
        }
      }
    } catch (error) {
      console.error('Error handling cart action:', error);
      showError("Failed to update cart. Please try again.");
    }
  };

  const buttonClasses = cn(
    "flex items-center justify-center gap-2 rounded-lg",
    "bg-primary hover:bg-primary/90 text-white font-medium",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className
  );

  if (btnStyle === 'icon-only') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={authLoading}
        className={cn(buttonClasses, "p-2")}
      >
        <FaShoppingCart className="w-5 h-5" />
      </button>
    );
  }

  if (btnStyle === 'full-width') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={authLoading}
        className={cn(buttonClasses, "w-full px-6 py-3")}
      >
        <FaShoppingCart className="w-5 h-5" />
        {addedItem ? "Remove from Cart" : "Add to Cart"}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={authLoading}
      className={cn(buttonClasses, "px-4 py-2")}
    >
      <FaShoppingCart className="w-5 h-5" />
      {addedItem ? "Remove from Cart" : "Add to Cart"}
    </button>
  );
};

export default AddToCartWrapper;
