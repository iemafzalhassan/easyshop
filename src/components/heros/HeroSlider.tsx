"use client";

import AutoPlay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SearchBar from "../SearchBar";

type HeroSliderProps = {
  autoPlay?: boolean;
  loop?: boolean;
  heroImages: {
    bgImg: string;
  }[];
  content?: {
    contentClass?: string;
    title: string;
    searchBar?: boolean;
    titleClass?: string;
  };
};

const HeroSlider = ({
  heroImages,
  loop = true,
  autoPlay = true,
  content,
}: HeroSliderProps) => {
  return heroImages.length === 1 ? (
    <div
      className={
        "bg-center bg-cover aspect-[1015/402] max-h-[650px] p-0 w-full relative"
      }
    >
      <Image
        height={600}
        width={1000}
        src={heroImages[0].bgImg}
        alt="hero"
        className="w-full h-full object-cover"
      />
      {content && (
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col gap-4 px-default",
            content.contentClass
          )}
        >
          <h1
            className={cn(
              "text-3xl font-semibold md:text-4xl lg:text-5xl text-center",
              content.titleClass
            )}
          >
            {content.title}
          </h1>
          {content.searchBar && <SearchBar />}
        </div>
      )}
    </div>
  ) : (
    <div className="w-full">
      <Carousel
        plugins={
          autoPlay
            ? [
                AutoPlay({
                  delay: 5000,
                }),
              ]
            : undefined
        }
        opts={{
          loop,
        }}
      >
        <CarouselContent>
          {heroImages.map((hero, index) => (
            <CarouselItem
              key={index}
              className={`bg-center bg-cover aspect-[1015/402] max-h-[650px] p-0 w-full`}
            >
              <Image
                height={600}
                width={1000}
                src={hero.bgImg}
                alt="hero"
                className="w-full h-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default HeroSlider;
