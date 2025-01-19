"use client";

import {
  addToCart,
  removeFromCart,
  setPendingCartItem,
} from "@/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "./ui/button";
import { Product, CartItem } from "@/types/product.d";
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
  const dispatch = useAppDispatch();

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
    if (product?._id && cartItems) {
      const foundItem = cartItems.find(item => 
        typeof item.product === 'string' 
          ? item.product === product._id 
          : item.product._id === product._id
      );
      setAddedItem(foundItem);
    }
  }, [product?._id, cartItems]);

  // handle add to cart button
  const handleAddToCart = () => {
    if (authLoading) {
      return; // Prevent action while auth state is loading
    }

    // Create cart item with required fields
    const cartItem: CartItem = {
      product: product._id, // Set product as the ID string
      quantity: 1,
      price: product.price,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null
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
    {
      "w-full py-2": btnStyle === "full-width",
      "px-3 py-2": btnStyle === "compact",
      "p-2 aspect-square": btnStyle === "icon-only",
    },
    className
  );

  return (
    <Button
      onClick={handleAddToCart}
      className={buttonClasses}
      disabled={authLoading}
    >
      <FaShoppingCart className="h-4 w-4" />
      {btnStyle !== "icon-only" && (
        <span>{addedItem ? "Remove from Cart" : "Add to Cart"}</span>
      )}
    </Button>
  );
};

export default AddToCartWrapper;
