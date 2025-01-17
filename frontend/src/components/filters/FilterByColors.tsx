"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colors } from "@/data/colors";

interface Color {
  id: number;
  name: string;
  value: string;
}

const FilterByColors = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeColor, setActiveColor] = useState<Color | undefined>();

  useEffect(() => {
    const activeParams = searchParams.get("color");
    if (activeParams) {
      const foundColor = colors.find(
        (color) => color.name.toLowerCase() === activeParams.toLowerCase()
      );
      setActiveColor(foundColor);
    }
  }, [searchParams]);

  const handleActiveParams = (color: Color) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("color", color.name.toLowerCase());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            {activeColor ? (
              <>
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: activeColor.value }}
                />
                <span>{activeColor.name}</span>
              </>
            ) : (
              "Colors"
            )}
          </div>
          <IoIosArrowDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleActiveParams(color)}
          >
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: color.value }}
            />
            <span>{color.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterByColors;
