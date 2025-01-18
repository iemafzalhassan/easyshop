"use client";

import BookCard from "@/components/cards/BookCard";
import { api } from "@/services/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import BooksSlider from "@/components/sliders/BooksSlider";

const BooksCategory = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error: showError } = useToast();

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/products", { 
        params: { 
          category: "books",
          limit: 5 
        } 
      });
      setBooks(response.data.data.products || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      showError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed since we're not using any external values

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // fetchBooks is memoized so it won't cause infinite loops

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
        {loading ? (
          <div className="h-[40vh] flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : books.length > 0 ? (
          <BooksSlider books={books} />
        ) : (
          <div className="h-[40vh] flex justify-center items-center text-3xl font-semibold text-center">
            No books found
          </div>
        )}
      </div>
    </section>
  );
};

export default BooksCategory;
