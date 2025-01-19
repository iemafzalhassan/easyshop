import Image from "next/image";
import Link from "next/link";
import AddToCartWrapper from "@/components/AddToCartWrapper";
import { discountPercent } from "../../lib/utils";
import { Product } from "../../types/product";
import { cn } from "@/lib/utils";
import React from 'react';

const CardFour = ({
  _id,
  name,
  title,
  image,
  imageUrl,
  price,
  oldPrice,
  unit_of_measure,
  shop_category,
}: Product) => {
  const getImagePath = (url: string) => {
    try {
      // If it's a full URL (e.g., Cloudinary), use it as is
      if (url.startsWith('http')) {
        return url;
      }
      
      // Remove any leading slashes and ensure proper path
      const cleanPath = url.replace(/^\/+/, '');
      
      // If it's already a complete assets path, use it directly
      if (cleanPath.startsWith('assets/')) {
        return `/${cleanPath}`;
      }

      // Map category to the correct folder name
      const categoryFolders = {
        'gadgets': 'gadgets',
        'clothing': 'clothing',
        'makeup': 'makeup',
        'furniture': 'furniture',
        'grocery': 'grocery',
        'books': 'books',
        'medicine': 'medicine',
        'bakery': 'bakery',
        'bags': 'bags'
      };

      const category = shop_category?.toLowerCase() || '';
      const folder = categoryFolders[category] || category;

      // If it's a product image
      if (cleanPath.includes('products/')) {
        return `/assets/images/products/${folder}/${cleanPath.split('/').pop()}`;
      }

      // If it's a category image
      if (cleanPath.includes('categories/')) {
        return `/assets/images/categories/${cleanPath.split('/').pop()}`;
      }

      // Default case: assume it's a product image
      return `/assets/images/products/${folder}/${cleanPath}`;
    } catch (error) {
      console.error('Error processing image path:', error);
      return `/assets/images/categories/${shop_category?.toLowerCase() || 'general'}.png`;
    }
  };

  const displayImage = React.useMemo(() => {
    try {
      // If imageUrl is provided (from backend), use it first
      if (imageUrl) {
        return getImagePath(imageUrl);
      }
      
      // If image array is provided, use the first image
      if (Array.isArray(image) && image.length > 0) {
        return getImagePath(image[0]);
      }
      
      // If image is a string, use it directly
      if (typeof image === 'string') {
        return getImagePath(image);
      }

      // Fallback to category image
      return `/assets/images/categories/${shop_category?.toLowerCase() || 'general'}.png`;
    } catch (error) {
      console.error('Error getting display image:', error);
      return `/assets/images/categories/${shop_category?.toLowerCase() || 'general'}.png`;
    }
  }, [image, imageUrl, shop_category]);

  const displayTitle = title || name || 'Untitled Product';

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${_id}`} className="block">
        {/* Discount Badge */}
        {oldPrice && oldPrice > price && (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            {discountPercent(price, oldPrice)}% Off
          </div>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/10">
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            quality={75}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-110",
              "bg-muted"
            )}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = `/assets/images/categories/${shop_category?.toLowerCase() || 'general'}.png`;
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2 p-4">
          {/* Title */}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-foreground group-hover:text-primary">
            {displayTitle}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              ${price.toFixed(2)}
            </span>
            {oldPrice && oldPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Unit */}
          {unit_of_measure && (
            <div className="text-xs text-muted-foreground">
              per {unit_of_measure}
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-background/80 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
        <AddToCartWrapper product={{
          _id,
          name: displayTitle,
          price,
          oldPrice,
          image: displayImage,
          unit_of_measure,
          shop_category,
        }} />
      </div>
    </div>
  );
};

export default CardFour;
