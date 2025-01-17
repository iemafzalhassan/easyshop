"use client";

import React from "react";
import CardOne from "@/components/cards/CardOne";
import CardTwo from "@/components/cards/CardTwo";
import CardThree from "@/components/cards/CardThree";
import CardFour from "@/components/cards/CardFour";
import BookCard from "@/components/cards/BookCard";

export type ProductCardVariants =
  | "default"
  | "card-one"
  | "card-two"
  | "card-three"
  | "card-four"
  | "book-card";

type ProductCardProps = {
  variants?: ProductCardVariants;
  product: AllProduct | SingleProductType;
};

const ProductCard = ({ variants = "default", product }: ProductCardProps) => {
  switch (variants) {
    case "card-one":
      return <CardOne {...(product as AllProduct)} />;

    case "card-two":
      return <CardTwo {...(product as AllProduct)} />;

    case "card-three":
      return <CardThree {...(product as AllProduct)} />;

    case "card-four":
      return <CardFour {...(product as AllProduct)} />;

    case "book-card":
      return <BookCard {...(product as SingleProductType)} />;

    default:
      return <CardFour {...(product as AllProduct)} />;
  }
};

export default ProductCard;
