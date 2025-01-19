"use client";

import { productService } from "@/services/product.service";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import FeaturedNav from "@/components/FeaturedNav";
import ProductCard from "@/components/cards/ProductCard";
import Skeleton from "@/components/loader/Skeleton";
import { useToast } from "@/hooks/useToast";
import type { Product } from "@/types/product.d";
import { setProducts, setLoading, setError, shouldRefetchProducts } from "@/lib/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";

type FeaturedParams = {
  featured?: string;
};

const FeaturedProducts = ({ featured }: { featured?: string }) => {
  const dispatch = useAppDispatch();
  const { products, loading, error, lastFetch } = useAppSelector((state) => state.products);
  const { error: showError } = useToast();
  const lastFeaturedRef = useRef(featured);

  const fetchProducts = useCallback(async (force = false) => {
    // Check if we need to fetch
    const shouldFetch = force || 
      shouldRefetchProducts(lastFetch) || 
      lastFeaturedRef.current !== featured;
    
    if (!shouldFetch) return;

    try {
      dispatch(setLoading(true));
      dispatch(setError(null)); // Clear any previous errors
      
      const params = {
        category: featured || 'gadgets',
        limit: 8,
        featured: true
      };

      const response = await productService.getProducts(params);

      if (response.status === 'success' && Array.isArray(response.data.products)) {
        const formattedProducts = response.data.products.map(product => {
          // Ensure shop_category is set correctly
          const shop_category = product.shop_category || product.category || featured || 'gadgets';
          
          // Format image paths
          const formatImagePath = (img: string) => {
            if (img.startsWith('http')) return img;
            if (img.startsWith('/assets/images/products/')) return img;
            
            // Default images for each category
            const defaultImages: Record<string, string> = {
              'bags': '/assets/images/products/bags/bag2.png',
              'bakery': '/assets/images/products/bakery/bakery22.png',
              'books': '/assets/images/products/books/book9.png',
              'clothing': '/assets/images/products/clothing/hoodie1.png',
              'furniture': '/assets/images/products/furniture/furn17.png',
              'gadgets': '/assets/images/products/gadgets/DZIR-615Z10.png',
              'grocery': '/assets/images/products/grocery/broccoli.png',
              'makeup': '/assets/images/products/makeup/makeup23.png',
              'medicine': '/assets/images/products/medicine/medicine19.png'
            };

            const category = shop_category.toLowerCase();

            // If no specific image is provided or if it's empty, use the default image for the category
            if (!img || img.trim() === '') {
              return defaultImages[category] || defaultImages['gadgets'];
            }
            
            // Remove any leading slashes
            const cleanPath = img.replace(/^\/+/, '');
            
            // Return the full path
            return `/assets/images/products/${category}/${cleanPath}`;
          };
          
          return {
            ...product,
            // Handle image array
            image: Array.isArray(product.image) && product.image.length > 0 
              ? product.image.map(formatImagePath).filter(Boolean)
              : [],
            // Handle single imageUrl
            imageUrl: product.imageUrl ? formatImagePath(product.imageUrl) : undefined,
            rating: product.rating || 0,
            reviews: product.reviews || [],
            shop: typeof product.shop === 'string' 
              ? { _id: product.shop, name: '' }
              : product.shop || { _id: '', name: '' },
            unit_of_measure: product.unit_of_measure || 'piece',
            shop_category
          };
        });

        dispatch(setProducts(formattedProducts));
        lastFeaturedRef.current = featured;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error in fetchProducts:', error);
      const message = error.response?.data?.message || error.message || 'Failed to fetch products';
      dispatch(setError(message));
      showError(message);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, featured, showError, lastFetch]); // Only depend on stable dependencies

  // Only fetch on mount or when featured changes
  useEffect(() => {
    fetchProducts(false);
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
              {products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    variants="card-four"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No products found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Current category: {featured || 'gadgets'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
