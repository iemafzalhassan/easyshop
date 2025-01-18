"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

type BooksProduct = {
  _id: string;
  title: string;
  image: string[];
  // add other properties as needed
};

type BookSliderProps = {
  books: BooksProduct[];
  loading?: boolean;
};

const BooksSlider = ({ books, loading }: BookSliderProps) => {
  const getImageUrl = (book: BooksProduct) => {
    if (!book.image || !Array.isArray(book.image) || book.image.length === 0) {
      return '/assets/images/products/books/book1.png'; // Using an existing book image as fallback
    }
    return book.image[0];
  };

  return (
    <Carousel
      plugins={
        [
          // AutoPlay({
          //   delay: 5000,
          // }),
        ]
      }
    >
      <CarouselContent>
        {books?.map((book, index) => (
          <CarouselItem
            className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/6"
            key={book._id || index}
          >
            <Link href={`/products/${book._id}`}>
              <Image
                width={400}
                height={600}
                alt={book.title || 'Book cover'}
                src={getImageUrl(book)}
                className="rounded-lg"
              />
            </Link>
          </CarouselItem>
        ))}
        {/*
        {loading &&
          [...Array(10)].map((_, index) => (
            <CarouselItem
              className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/6"
              key={index}
            >
              <Skeleton
                key={index}
                className="bg-secondary aspect-[1/1.5] rounded-lg"
              ></Skeleton>
            </CarouselItem>
          ))} */}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
};

export default BooksSlider;
