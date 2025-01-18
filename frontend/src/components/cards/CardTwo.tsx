"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartWrapper from "@/components/AddToCartWrapper";
import { discountPercent } from "../../lib/utils";
import { Product } from "@/types/product";
import { useState } from "react";

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

const CardTwo = ({
  _id,
  name,
  title,
  image,
  price,
  unit_of_measure = 'piece',
  oldPrice,
  shop_category = 'gadgets',
  category
}: Product) => {
  const [imgError, setImgError] = useState(false);
  
  // Get display name (prefer title if available, fallback to name)
  const displayName = title || name;
  
  // Get category for default image (prefer shop_category if available, fallback to category)
  const displayCategory = shop_category || category || 'gadgets';
  
  // Get display image with fallback logic
  const getDisplayImage = () => {
    if (imgError) {
      return DEFAULT_IMAGES[displayCategory] || DEFAULT_IMAGES.gadgets;
    }

    // If image is an array, use the first image
    if (Array.isArray(image) && image.length > 0) {
      return image[0];
    }

    // If image is a string and exists, use it
    if (typeof image === 'string' && image) {
      return image;
    }

    // Fallback to default image
    return DEFAULT_IMAGES[displayCategory] || DEFAULT_IMAGES.gadgets;
  };

  if (!_id || !displayName || !price) {
    console.warn('CardTwo: Missing required fields', { _id, name, title, price });
    return null;
  }

  const displayImage = getDisplayImage();

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <Link
        href={`/products/${_id}`}
        className="relative flex h-48 items-center justify-center overflow-hidden bg-gray-100 transition-transform duration-300 ease-in-out group-hover:scale-105"
      >
        {displayImage && (
          <Image
            src={displayImage}
            alt={displayName}
            width={200}
            height={200}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {oldPrice && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
            {discountPercent(price, oldPrice)}% Off
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/products/${_id}`} className="flex-1">
          <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-2">
            {displayName}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              ${price.toFixed(2)}
              {unit_of_measure && <span className="ml-1 text-xs text-gray-500">/{unit_of_measure}</span>}
            </span>
            {oldPrice && (
              <span className="text-xs text-gray-500 line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <AddToCartWrapper
            product={{ 
              _id, 
              name: displayName, 
              price, 
              image: displayImage,
              unit_of_measure,
              shop_category: displayCategory
            }} 
            btnStyle="icon-only"
          />
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
