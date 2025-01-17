"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
import ShopSelect from "@/components/ShopSelect";
import ClearFilter from "@/components/filters/ClearFilter";
import FilterByColors from "@/components/filters/FilterByColors";
import FilterByPrize from "@/components/filters/FilterByPrice";
import MobileFilter from "@/components/filters/MobileFilter";
import SortBy, { SortByProps } from "@/components/filters/SortBy";
import Skeleton from "@/components/loader/Skeleton";

type SortBy =
  | {
      useSortBy?: true;
      sortingOptions?: SortByProps;
    }
  | { useSortBy?: false };

export type FilterOptions = {
  useColor?: boolean;
  usePrice?: boolean;
  useClear?: boolean;
  useCategory?: boolean;
  sidebar?: ReactNode;
} & SortBy;

const FilterNav = ({
  useClear = true,
  useSortBy = true,
  usePrice,
  useColor,
  sidebar,
}: FilterOptions) => {
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 || document.body.scrollTop > 100) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex gap-4 items-center flex-wrap">
          <Skeleton className="w-[60px] h-[40px] rounded-full" />
          <Skeleton className="w-[60px] h-[40px] rounded-full" />
          <Skeleton className="w-[60px] h-[40px] rounded-full" />
        </div>
      }
    >
      <div
        className={`${
          isScroll ? "shadow-lg" : ""
        } w-full bg-secondary sticky top-0 left-0 py-3 px-default z-50 transition-shadow duration-200`}
      >
        <div className="hidden flex-wrap gap-4 items-center justify-end sm:flex">
          {useClear && <ClearFilter />}
          {sidebar}
          {useColor && <FilterByColors />}
          {usePrice && <FilterByPrize />}
          {useSortBy && <SortBy />}
        </div>

        <div className="flex justify-between items-center sm:hidden">
          <MobileFilter />
          <ShopSelect />
        </div>
      </div>
    </Suspense>
  );
};

export default FilterNav;
