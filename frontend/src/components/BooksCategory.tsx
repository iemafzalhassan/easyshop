"use client";

import { api } from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import BooksSlider from "@/components/sliders/BooksSlider";

const BooksCategory = async () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/products/category/books", { params: { limit: 5 } });
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <section className="books-category pt-20">
      <div className="container">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
          <h1 className="text-2xl md:text-4xl font-semibold">
            Best Sellers in Books
          </h1>
          <Link
            href={"/shops/books"}
            className="hover:underline text-primary"
          >
            View Shop
          </Link>
        </div>

        <BooksSlider books={books} />
      </div>
    </section>
  );
};

export default BooksCategory;
