"use client";

import NoProductFound from "@/components/NoProductFound";
import Paginations from "@/components/Paginations";
import ProductCard from "@/components/cards/ProductCard";
import { useToast } from "@/hooks/useToast";
import { useCallback, useEffect, useMemo } from "react";
import { api } from "@/services/api";
import { SearchParamsType } from "@/types/searchParams";
import { setProducts, setLoading, setError, shouldRefetchProducts, invalidateCache } from "@/lib/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

type CategoryPageProps = {
  searchParams: SearchParamsType;
  params: {
    shop: string;
    category?: string;
  };
};

const ProductGrid = ({ params, searchParams }: CategoryPageProps) => {
  const dispatch = useAppDispatch();
  const { products, loading, error, lastFetch } = useAppSelector((state) => state.products);
  const { error: showError } = useToast();

  // Define interface for query parameters
  interface QueryParams {
    limit: number;
    page: string | number;
    category?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    sort?: string;
    search?: string;
  }

  // Memoize the query parameters
  const queryParams = useMemo(() => {
    const baseParams: QueryParams = {
      limit: 12,
      page: searchParams?.page || 1,
      category: params.shop
    };
    
    if (searchParams?.minPrice) baseParams.minPrice = searchParams.minPrice;
    if (searchParams?.maxPrice) baseParams.maxPrice = searchParams.maxPrice;
    if (searchParams?.sort) baseParams.sort = searchParams.sort;
    if (searchParams?.search) baseParams.search = searchParams.search;
    
    return baseParams;
  }, [searchParams, params.shop]);

  // Memoize the error handler
  const handleError = useCallback((message: string) => {
    dispatch(setError(message));
    showError(message);
  }, [dispatch, showError]);

  const fetchProducts = useCallback(async (force = false) => {
    // Check if we need to fetch
    const shouldFetch = force || shouldRefetchProducts({ products: { lastFetch } });
    if (!shouldFetch) return;

    try {
      dispatch(setLoading(true));
      const response = await api.get('/api/v1/products', {
        params: queryParams
      });
      
      dispatch(setProducts(response.data.data.products || []));
    } catch (error) {
      handleError('Failed to fetch products');
    } finally {
      dispatch(setLoading(false));
    }
  }, [queryParams, dispatch, handleError, lastFetch]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!products.length) {
    return <NoProductFound />;
  }

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {/* Add pagination if needed */}
    </div>
  );
};

export default ProductGrid;
