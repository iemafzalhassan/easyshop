"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartWrapper from "@/components/AddToCartWrapper";
import { discountPercent } from "../../lib/utils";
import { formatPrice } from "@/utils/format";
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
      return `/assets/images/products/${displayCategory}/${image[0]}`;
    }

    // If image is a string, use it directly
    if (typeof image === 'string' && image) {
      // Check if the image path already includes the full path
      if (image.startsWith('/assets/')) {
        return image;
      }
      return `/assets/images/products/${displayCategory}/${image}`;
    }

    // Fallback to default image for category
    return DEFAULT_IMAGES[displayCategory] || DEFAULT_IMAGES.gadgets;
  };

  if (!_id || !displayName || !price) {
    console.warn('CardTwo: Missing required fields', { _id, name, title, price });
    return null;
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative mb-2 h-48">
        <Link href={`/products/${_id}`} className="block h-full">
          <Image
            src={getDisplayImage()}
            alt={`Product image of ${displayName}`}
            className="object-cover rounded-lg"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
            priority={false}
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/products/${_id}`} className="flex-1">
          <h3 className="mb-1 text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary transition">
            {displayName}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {formatPrice(price)}
              {unit_of_measure && <span className="ml-1 text-xs text-gray-500">/{unit_of_measure}</span>}
            </span>
            {oldPrice && oldPrice > price && (
              <>
                <del className="text-sm text-gray-500">{formatPrice(oldPrice)}</del>
                <span className="text-xs text-emerald-500">
                  {discountPercent(oldPrice, price)}% off
                </span>
              </>
            )}
          </div>
          <AddToCartWrapper
            product={{
              _id,
              name: displayName,
              image: getDisplayImage(),
              price,
              unit_of_measure,
              shop_category: displayCategory,
            }}
            btnStyle="icon-only"
          />
        </div>
      </div>
    </div>
  );
};

export default CardTwo;
