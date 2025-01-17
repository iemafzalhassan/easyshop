"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PriceOption = {
  maxPrice: string;
  minPrice: string;
};

const priceOptions = [
  {
    title: "Under $25",
    minPrice: "",
    maxPrice: "25",
  },
  {
    title: "$25 to $50",
    minPrice: "25",
    maxPrice: "50",
  },
  {
    title: "$50 to $100",
    minPrice: "50",
    maxPrice: "100",
  },
  {
    title: "$100 to $200",
    minPrice: "100",
    maxPrice: "200",
  },
  {
    title: "$200 & Above",
    minPrice: "200",
    maxPrice: "",
  },
];

const FilterByPrize = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("");
  const [priceData, setPriceData] = useState({
    min: "",
    max: "",
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPriceData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { min, max } = priceData;
    if (min && max && Number(min) > Number(max)) {
      alert("Maximum price must be greater than minimum price");
      return;
    }
    handleActiveParams({ maxPrice: max, minPrice: min });
  };

  const handleActiveParams = ({ maxPrice, minPrice }: PriceOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");

    if (min && max) {
      setActiveFilter(`$${min} to $${max}`);
    } else if (min && !max) {
      setActiveFilter(`$${min} & above`);
    } else if (max && !min) {
      setActiveFilter(`under $${max}`);
    } else {
      setActiveFilter("");
    }

    return () => {};
  }, [searchParams]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-3">
          <span>{activeFilter || "Price"}</span>
          <span className="text-base text-muted-foreground">
            <IoIosArrowDown />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto max-w-[250px] p-4 max-h-[70vh] overflow-auto narrowScrollbar">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter By Price</h4>
            <ul>
              {priceOptions.map((price) => (
                <li key={price.title}>
                  <DropdownMenuItem
                    className="cursor-pointer block py-2 px-3 hover:bg-accent text-muted-foreground w-full h-full"
                    onClick={() => handleActiveParams(price)}
                  >
                    {price.title}
                  </DropdownMenuItem>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid items-center gap-4">
                {/* <Label htmlFor="Min">Min</Label> */}
                <Input
                  id="Min"
                  placeholder="$Min"
                  className="h-8"
                  name="min"
                  type="number"
                  defaultValue={priceData.min}
                  min={1}
                  onChange={handleChange}
                />
              </div>
              <div className="grid items-center gap-4">
                {/* <Label htmlFor="Max">Max</Label> */}
                <Input
                  id="Max"
                  placeholder="$Max"
                  className="h-8"
                  name="max"
                  min={1}
                  defaultValue={priceData.max}
                  type="number"
                  onChange={handleChange}
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="outline"
              className="uppercase h-8 w-full mt-3"
            >
              <DropdownMenuItem className="w-full flex justify-center items-center cursor-pointer">
                Go
              </DropdownMenuItem>
            </Button>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterByPrize;
