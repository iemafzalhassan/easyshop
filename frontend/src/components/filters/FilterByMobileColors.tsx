"use client";

import { colors } from "@/data/colors";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Color {
  id: number;
  name: string;
  value: string;
}

const FilterByMobileColors = () => {
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
    <div className="filterby-colors">
      <h3 className="font-medium mb-3">Colors</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => handleActiveParams(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              activeColor?.id === color.id ? "border-primary" : "border-transparent"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterByMobileColors;
