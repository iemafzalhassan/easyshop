"use client";

import RelatedProducts from "./RelatedProducts";
import SingleProduct from "./SingleProduct";
import ProductLoader from "./loader/ProductLoader";
import { api } from "@/services/api";
import { Suspense, useState, useEffect } from "react";
import { SingleProductType } from "@/types/product";
import { enrichProductWithMetadata } from "@/lib/utils/product-metadata";
import AddToCartWrapper from '@/components/AddToCartWrapper';
import AddToWishlist from './AddToWishlist';

type ProductPageContentProps = {
  id?: string;
  slug?: string;
};

const ProductPageContent = ({ id, slug }: ProductPageContentProps) => {
  const [product, setProduct] = useState<SingleProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/products/${id || slug}`);
      
      if (!response.data.data.product) {
        throw new Error('Product not found');
      }
      
      const rawProduct = response.data.data.product;
      const enrichedProduct = enrichProductWithMetadata({
        ...rawProduct,
        image: Array.isArray(rawProduct.image) ? rawProduct.image : [rawProduct.image],
        rating: rawProduct.rating || 0,
        reviews: rawProduct.reviews?.length || 0,
        shop: rawProduct.shop || { _id: '', name: '' }
      });
      
      setProduct(enrichedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id || slug) {
      fetchProduct();
    }
  }, [id, slug]);

  if (loading) {
    return (
      <div className="container">
        <ProductLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <p className="mt-4 text-gray-600">Please try again later</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-4 text-gray-600">
          The product you are looking for does not exist
        </p>
      </div>
    );
  }

  return (
    <section className="single-product-page bg-secondary dark:bg-background">
      <Suspense fallback={<ProductLoader />}>
        <SingleProduct product={product} />
      </Suspense>

      {/* Related Products */}
      <div className="related-products py-20">
        <div className="container">
          <h2 className="section-title text-2xl font-bold text-gray-800 dark:text-white mb-8">
            Related Products
          </h2>
          <Suspense fallback={<ProductLoader />}>
            <RelatedProducts
              category={product.shop_category || product.category}
              currentProductId={product._id}
            />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <AddToCartWrapper 
          product={product} 
          redirectToCheckout={true}
        />
        <AddToWishlist product={product} />
      </div>
    </section>
  );
};

export default ProductPageContent;
