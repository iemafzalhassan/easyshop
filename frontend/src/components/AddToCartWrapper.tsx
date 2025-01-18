"use client";

import {
  addToCart,
  removeFromCart,
} from "@/lib/features/cart/cartSlice";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { PiBasketFill } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Product, CartItem } from "@/types/product";
import { cn } from "@/lib/utils";

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
};

const AddToCartBtnWrapper = ({
  product,
  btnStyle = "full-width",
  className,
}: AddToCartWrapperProps) => {
  const router = useRouter();
  const [addedItem, setAddedItem] = useState<CartItem | undefined>();
  const { cartItems, selectedColor, selectedSize } = useAppSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Return early if product is undefined
  if (!product?._id) {
    console.warn('AddToCartWrapper: Product is undefined or missing _id');
    return null;
  }

  // Get the main image from product
  const getProductImage = (product: Product): string => {
    // If image is an array, use the first image
    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    }

    // If image is a string and exists, use it
    if (typeof product.image === 'string' && product.image) {
      // If it's a Cloudinary URL, use it as is
      if (product.image.includes('cloudinary.com')) {
        return product.image;
      }
      // If it's a local path starting with /, use it as is
      if (product.image.startsWith('/')) {
        return product.image;
      }
      // If it's just a filename and we have a category, prepend the correct path
      if (product.shop_category) {
        const category = product.shop_category.toLowerCase();
        return `/assets/images/products/${category}/${product.image}`;
      }
    }

    // Use category default image if available
    if (product.shop_category) {
      const category = product.shop_category.toLowerCase();
      return DEFAULT_IMAGES[category] || DEFAULT_IMAGES.gadgets;
    }

    // Final fallback
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
    if (!isAuthenticated) {
      // If not authenticated, redirect to login with return URL
      const returnUrl = `/checkout?product=${product._id}`;
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (product.shop_category === "clothing") {
      // checking color and size is selected or not
      if (selectedColor && selectedSize) {
        if (addedItem) {
          dispatch(removeFromCart(product._id));
        } else {
          dispatch(
            addToCart({
              ...product,
              image: getProductImage(product),
              color: selectedColor,
              size: selectedSize,
            })
          );
          router.push('/checkout');
        }
      }
    } else {
      if (addedItem) {
        dispatch(removeFromCart(product._id));
      } else {
        dispatch(addToCart({
          ...product,
          image: getProductImage(product),
        }));
        router.push('/checkout');
      }
    }
  };

  if (btnStyle === 'icon-only') {
    return (
      <button
        onClick={handleAddToCart}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-lg",
          "bg-primary hover:bg-primary/90 text-white",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          className
        )}
      >
        <FaShoppingCart className="w-5 h-5" />
      </button>
    );
  }

  if (btnStyle === 'full-width') {
    return (
      <button
        onClick={handleAddToCart}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg",
          "bg-primary hover:bg-primary/90 text-white font-medium",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          className
        )}
      >
        <FaShoppingCart className="w-5 h-5" />
        {addedItem ? "Remove from Cart" : "Add to Cart"}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
        "bg-primary hover:bg-primary/90 text-white font-medium",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
    >
      <FaShoppingCart className="w-5 h-5" />
      {addedItem ? "Remove from Cart" : "Add to Cart"}
    </button>
  );
};

export default AddToCartBtnWrapper;
