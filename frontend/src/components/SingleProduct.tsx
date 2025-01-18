"use client";

import { EmblaOptionsType } from "embla-carousel";
import Link from "next/link";
import Image from "next/image";
import AddToCartBtnWrapper from "@/components/AddToCartWrapper";
import AddToWishlist from "@/components/AddToWishlist";
import Counter from "@/components/Counter";
import HistoryBackBtn from "@/components/HistoryBackBtn";
import RatingStar from "@/components/RatingStar";
import ProductImageSlider from "@/components/sliders/ProductImageSlider";
import SelectVariants from "@/components/SelectVariants";
import { SingleProductType } from "@/types/product";
import { cn } from "@/lib/utils";

type SingleProductProps = {
  product: SingleProductType;
};

const OPTIONS: EmblaOptionsType = {};

const formatPrice = (price: number | undefined | null): string => {
  if (typeof price !== 'number') return '$0.00';
  return `$${price.toFixed(2)}`;
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
  const {
    _id,
    title,
    image,
    shop_category,
    categories,
    unit_of_measure,
    price,
    oldPrice,
    rating,
    description,
  } = product;

  const productImages = getProductImages(image);
  const mainImage = getMainImage(image);

  return (
    <div className="container pb-16 pt-10">
      <HistoryBackBtn />
      <div className="flex gap-10 mt-6 flex-col md:flex-row">
        <div className="img w-full md:w-2/5 max-w-md mx-auto">
          <ProductImageSlider images={productImages} options={OPTIONS} />
        </div>

        <div className="right w-full md:w-3/5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
            <AddToWishlist 
              product={{
                ...product,
                image: mainImage,
              }} 
            />
          </div>

          <RatingStar ratingNumber={rating} className="mt-2" />
          <div className="flex gap-3 items-end mt-4">
            <p className="text-2xl text-primary font-semibold">
              {formatPrice(price)}
            </p>
            {oldPrice && oldPrice > (price || 0) && (
              <del className="text-gray-400 dark:text-gray-500 font-semibold">
                {formatPrice(oldPrice)}
              </del>
            )}
          </div>

          {description && (
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-300">{description}</p>
            </div>
          )}

          <div className="mt-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Product Details
            </h3>
            <ul className="space-y-2">
              {unit_of_measure && (
                <li>
                  <span className="font-medium text-gray-900 dark:text-white">Unit:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-300">{unit_of_measure}</span>
                </li>
              )}
              {shop_category && (
                <li>
                  <span className="font-medium text-gray-900 dark:text-white">Category:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-300 capitalize">{shop_category}</span>
                </li>
              )}
              {categories && categories.length > 0 && (
                <li>
                  <span className="font-medium text-gray-900 dark:text-white">Tags:</span>{" "}
                  <span className="text-gray-600 dark:text-gray-300">
                    {categories.join(", ")}
                  </span>
                </li>
              )}
            </ul>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Counter />
                <div className="flex-1" />
                <div className="flex gap-3">
                  <AddToCartBtnWrapper
                    product={{
                      ...product,
                      image: mainImage,
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  />
                  <Link
                    href={`/checkout?product=${_id}`}
                    className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional product information */}
          <div className="mt-8">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Free shipping on orders over $50. Standard delivery 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
