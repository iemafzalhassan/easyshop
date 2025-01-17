"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { colors } from "@/data/colors";

interface Color {
  id: number;
  name: string;
  value: string;
}

interface Props {
  colors?: string[];
  productId: string;
}

const SelectVariants = ({ colors: givenColors, productId }: Props) => {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { items } = useAppSelector((state) => state.cart);

  // filtering which colors are available
  const availableColors = colors.filter((col) =>
    givenColors?.includes(col.name.toLowerCase())
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId,
        selectedColor,
        quantity,
      })
    );
  };

  const isInCart = items.find(
    (item) =>
      item.productId === productId && item.selectedColor === selectedColor
  );

  return (
    <div className="flex flex-col gap-4">
      {givenColors && (
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Available Colors</h3>
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.name.toLowerCase())}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color.name.toLowerCase()
                    ? "border-primary"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="font-medium">Quantity</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : prev))}
          >
            -
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </Button>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={givenColors ? !selectedColor || isInCart : false}
      >
        {isInCart ? "Already in Cart" : "Add to Cart"}
      </Button>
    </div>
  );
};

export default SelectVariants;
