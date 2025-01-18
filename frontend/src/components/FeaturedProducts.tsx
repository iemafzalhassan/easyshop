"use client";

import { productService } from "@/services/product.service";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import FeaturedNav from "@/components/FeaturedNav";
import ProductCard from "@/components/cards/ProductCard";
import Skeleton from "@/components/loader/Skeleton";
import { useToast } from "@/hooks/useToast";
import type { Product } from "@/types/product.d";
import { setProducts, setLoading, setError, shouldRefetchProducts } from "@/store/slices/product-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type FeaturedParams = {
  featured?: string;
};

const FeaturedProducts = ({ featured }: { featured?: string }) => {
  const dispatch = useAppDispatch();
  const { products, loading, error, lastFetch } = useAppSelector((state) => state.products);
  const { error: showError } = useToast();

  const fetchProducts = useCallback(async (force = false) => {
    // Check if we need to fetch
    const shouldFetch = force || shouldRefetchProducts({ products: { lastFetch } });
    if (!shouldFetch) return;

    try {
      dispatch(setLoading(true));
      const response = await productService.getProducts({
        category: featured || 'gadgets',
        limit: 8,
        featured: true
      });
      
      if (response.status === 'success' && Array.isArray(response.data.products)) {
        const formattedProducts = response.data.products.map(product => ({
          ...product,
          image: Array.isArray(product.image) ? product.image : [product.image],
          rating: product.rating || 0,
          reviews: product.reviews?.length || 0,
          shop: product.shop || { _id: '', name: '' }
        }));
        dispatch(setProducts(formattedProducts));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch products';
      dispatch(setError(message));
      showError(message);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, featured, showError, lastFetch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => fetchProducts(true)}
          className="mt-4 text-primary hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-8 py-8">
      <div className="container">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Browse our curated selection of featured products
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              View All
            </Link>
          </div>

          {/* Navigation */}
          <FeaturedNav />

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    unit_of_measure: product.unit_of_measure || 'piece',
                    shop_category: product.shop_category || product.category || 'gadgets'
                  }}
                  variants="card-four"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
