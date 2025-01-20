"use client";

import { EmblaOptionsType } from "embla-carousel";
import Link from "next/link";
import Image from "next/image";
import AddToCartWrapper from "@/components/AddToCartWrapper";
import AddToWishlist from "@/components/AddToWishlist";
import Counter from "@/components/Counter";
import HistoryBackBtn from "@/components/HistoryBackBtn";
import RatingStar from "@/components/RatingStar";
import ProductImageSlider from "@/components/sliders/ProductImageSlider";
import SelectVariants from "@/components/SelectVariants";
import { SingleProductType } from "@/types/product";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "./ui/button";

type SingleProductProps = {
  product: SingleProductType;
};

const OPTIONS: EmblaOptionsType = {};

const formatPrice = (price: number | undefined | null): string => {
  if (typeof price !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const getProductImages = (image: string | string[] | undefined | null): string[] => {
  if (!image) return [];
  if (Array.isArray(image)) return image;
  return [image];
};

const getMainImage = (image: string | string[] | undefined | null): string => {
  const images = getProductImages(image);
  return images[0] || '';
};

const SingleProduct = ({ product }: SingleProductProps) => {
  const [quantity, setQuantity] = useState(1);
  const { cartItems, selectedColor, selectedSize } = useAppSelector(state => state.cart);
  
  const {
    _id,
    name,
    image,
    shop_category,
    categories,
    unit_of_measure,
    price,
    oldPrice,
    rating,
    description,
    colors = [],
    sizes = [],
    stock = 99,
  } = product;

  const mainImage = getMainImage(image);
  const images = getProductImages(image);
  const isClothing = shop_category?.toLowerCase() === 'clothing';
  const isInCart = cartItems.some(item => item._id === _id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <HistoryBackBtn />
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative aspect-square">
          <ProductImageSlider images={images} options={OPTIONS} />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{formatPrice(price)}</h2>
                {oldPrice && (
                  <p className="text-muted-foreground line-through">
                    {formatPrice(oldPrice)}
                  </p>
                )}
              </div>
              <AddToWishlist product={product} />
            </div>

            <div className="flex items-center gap-2">
              <RatingStar rating={rating || 0} />
              <span className="text-muted-foreground">
                ({rating || 0} ratings)
              </span>
            </div>

            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            {isClothing && (
              <>
                {colors.length > 0 && (
                  <SelectVariants
                    label="Colors"
                    options={colors}
                    type="color"
                  />
                )}
                {sizes.length > 0 && (
                  <SelectVariants
                    label="Sizes"
                    options={sizes}
                    type="size"
                  />
                )}
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Counter
                value={quantity}
                onChange={setQuantity}
                max={stock}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <AddToCartWrapper
              product={{
                ...product,
                image: mainImage,
                quantity,
              }}
              btnStyle="full-width"
              className={cn(
                "w-full",
                isInCart ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"
              )}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const url = new URL("/checkout", window.location.origin);
                url.searchParams.set("product", _id);
                if (quantity) url.searchParams.set("quantity", quantity.toString());
                if (selectedColor) url.searchParams.set("color", selectedColor);
                if (selectedSize) url.searchParams.set("size", selectedSize);
                window.location.href = url.toString();
              }}
            >
              Buy Now
            </Button>
          </div>

          {/* Additional Info */}
          {unit_of_measure && (
            <p className="text-sm text-muted-foreground">
              Unit: {unit_of_measure}
            </p>
          )}
          {categories?.length > 0 && (
            <div className="flex gap-2 text-sm">
              <span>Categories:</span>
              <div className="flex gap-2">
                {categories.map((category, index) => (
                  <Link
                    key={category}
                    href={`/category/${category}`}
                    className="text-primary hover:underline"
                  >
                    {category}
                    {index < categories.length - 1 && ","}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
