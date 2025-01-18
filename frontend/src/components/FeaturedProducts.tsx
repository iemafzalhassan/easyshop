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

  // Effect for initial load and refresh
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Effect for handling visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts(true); // Force refresh when tab becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchProducts]);

  // Effect for handling focus (window switching)
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts(true); // Force refresh when window gains focus
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProducts]);

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="mt-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            variants="card-two"
            product={{
              ...product,
              unit_of_measure: product.unit_of_measure || 'piece',
              shop_category: product.shop_category || product.category || 'gadgets'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="featured-products">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold sm:text-2xl">Featured Products</h2>
              <p className="text-base text-gray-500">
                Browse our featured collection of products
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <FeaturedNav />

          {renderProducts()}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
