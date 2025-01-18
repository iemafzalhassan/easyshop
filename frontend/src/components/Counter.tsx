"use client";

import {
  CartItem,
  updateQuantity,
} from "@/lib/features/cart/cartSlice";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type CounterProps = {
  product?: CartItem;
  className?: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
};

const Counter = ({ 
  className, 
  product,
  value: controlledValue,
  onChange,
  min = 1,
  max = 99,
}: CounterProps) => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useDispatch();

  const currentValue = controlledValue ?? (product ? 
    cartItems.find(item => item._id === product._id)?.quantity ?? 1
    : 1);

  const handleCount = (increment: boolean) => {
    const newValue = increment ? currentValue + 1 : currentValue - 1;
    
    if (newValue < min || newValue > max) return;

    if (product) {
      dispatch(updateQuantity({ _id: product._id, quantity: newValue }));
    }
    
    onChange?.(newValue);
  };

  return (
    <div className={cn("flex items-center gap-2 max-w-[200px]", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentValue <= min}
        onClick={() => handleCount(false)}
      >
        -
      </Button>
      <Input
        type="number"
        className="text-center h-8 w-16"
        value={currentValue}
        readOnly
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentValue >= max}
        onClick={() => handleCount(true)}
      >
        +
      </Button>
    </div>
  );
};

export default Counter;
