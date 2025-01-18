"use client";

import React from "react";
import CardOne from "@/components/cards/CardOne";
import CardTwo from "@/components/cards/CardTwo";
import CardThree from "@/components/cards/CardThree";
import CardFour from "@/components/cards/CardFour";
import BookCard from "@/components/cards/BookCard";
import { Product } from "@/types/product";

export type ProductCardVariants =
  | "default"
  | "card-one"
  | "card-two"
  | "card-three"
  | "card-four"
  | "book-card";

type ProductCardProps = {
  variants?: ProductCardVariants;
  product: Product;
};

const ProductCard = ({ variants = "default", product }: ProductCardProps) => {
  // Return early if product is undefined
  if (!product?._id) {
    console.warn('ProductCard: Product is undefined or missing _id');
    return null;
  }

  switch (variants) {
    case "card-one":
      return <CardOne {...product} />;

    case "card-two":
      return <CardTwo {...product} />;

    case "card-three":
      return <CardThree {...product} />;

    case "card-four":
      return <CardFour {...product} />;

    case "book-card":
      return <BookCard {...product} />;

    default:
      return <CardFour {...product} />;
  }
};

export default ProductCard;
