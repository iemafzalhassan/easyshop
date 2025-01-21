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
    const handleUpdateAddedItem = async () => {
      if (product?._id && cartItems) {
        const foundItem = cartItems.find(item => 
          typeof item.product === 'string' 
            ? item.product === product._id 
            : item.product._id === product._id
        );
        setAddedItem(foundItem);
      }
    };

    handleUpdateAddedItem();
  }, [product?._id, cartItems]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // No effect code here
    }
  }, [isAuthenticated, currentUser]);

  const mounted = true;

  if (!mounted) return null;

  // handle add to cart button
  const handleAddToCart = async () => {
    if (authLoading) {
      return; // Prevent action while auth state is loading
    }

    // Create cart item with required fields
    const cartItem: CartItem = {
      product: product._id,
      quantity: 1,
      price: product.price,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null,
      image: getProductImage(product),
      name: product.name
    };

    // For clothing items, require color and size selection
    if (product.shop_category === "clothing") {
      if (!selectedColor || !selectedSize) {
        showError("Please select both color and size before adding to cart");
        return;
      }
    }

    // If user is not authenticated, handle guest cart flow
    if (!isAuthenticated) {
      // Store the pending cart item in Redux
      dispatch(setPendingCartItem(cartItem));
      
      // Store in localStorage with timestamp
      const pendingItems = JSON.parse(localStorage.getItem('pendingCartItems') || '[]');
      pendingItems.push({
        ...cartItem,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('pendingCartItems', JSON.stringify(pendingItems));
      
      // Save current URL for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      const returnUrl = redirectToCheckout ? '/checkout' : currentPath;
      localStorage.setItem('lastAttemptedCartAction', JSON.stringify({
        action: 'add',
        productId: product._id,
        returnUrl,
        timestamp: new Date().toISOString()
      }));
      
      // Show toast with action button
      success("Please log in to add items to your cart");
      
      // Redirect after a short delay to allow reading the toast
      setTimeout(async () => {
        try {
          await router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback to window.location if router fails
          window.location.href = `/login?redirect=${encodeURIComponent(returnUrl)}`;
        }
      }, 1500); // 1.5 second delay
      
      return;
    }

    try {
      if (addedItem) {
        // Remove from cart
        dispatch(removeFromCart(product._id));
        success("Item removed from cart");
      } else {
        // Add to cart
        dispatch(addToCart(cartItem));
        success("Item added to cart");
        
        // If redirectToCheckout is true, go to checkout
        if (redirectToCheckout) {
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
