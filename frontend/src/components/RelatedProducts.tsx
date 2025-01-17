"use client";

import { api } from "@/services/api";
import layoutSettings from "@/lib/layoutSettings";
import { rgx } from "@/lib/utils";
import { useEffect, useState } from "react";
import ProductCard from "./cards/ProductCard";

type RelatedProductsProps = {
  category: string;
  shop_category: string;
  product: any;
};

const RelatedProducts = async ({
  category,
  shop_category,
  product,
}: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get(`/products/related/${product._id}`);
      setRelatedProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  useEffect(() => {
    fetchRelatedProducts();
  }, [product]);

  const settings = layoutSettings?.[shop_category];

  return (
    <>
      {relatedProducts.map((relatedProduct) => (
        <ProductCard
          product={relatedProduct}
          variants={settings.productCardVariants}
          key={relatedProduct._id}
        />
      ))}
    </>
  );
};

export default RelatedProducts;
