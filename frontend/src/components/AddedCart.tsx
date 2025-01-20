"use client";

import {
  handleCartOpen,
  removeFromCart,
  incrementAmount,
  decrementAmount,
} from "@/lib/features/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { totalPrice } from "@/lib/utils";
import { formatPrice } from "@/utils/format";
import { BsCartCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { colors } from "@/data/colors";

interface Color {
  id: number;
  name: string;
  value: string;
}

const ContainerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: "100%",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      type: "tween",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 90,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
  },
};

const AddedCart = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { cartItems, isCartOpen } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isHidden =
    pathname.includes("contact") ||
    pathname.includes("profile") ||
    pathname.includes("checkout");

  const reversedItems = [...cartItems].reverse();

  return (
    <AnimatePresence mode="wait">
      {isCartOpen && (
        <motion.div
          variants={ContainerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="card-sidebar fixed top-0 right-0 w-full h-screen z-50 flex justify-end"
        >
          <div
            className="overlay absolute top-0 left-0 w-full h-full bg-black/50"
            onClick={() => dispatch(handleCartOpen(false))}
          />
          <motion.div
            variants={itemVariants}
            className="content relative w-full sm:w-[25rem] h-full bg-background overflow-y-auto"
          >
            <div className="sticky top-0 flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
              <h2 className="text-lg font-medium">Shopping Cart ({cartItems.length})</h2>
              <button
                onClick={() => dispatch(handleCartOpen(false))}
                className="rounded-full hover:bg-accent p-2"
              >
                <HiMiniXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {reversedItems.map((item) => {
                const itemColor = colors.find(
                  (color) => color.name.toLowerCase() === item.selectedColor?.toLowerCase()
                );

                return (
                  <motion.div
                    key={`${item._id}-${item.selectedColor}-${item.selectedSize}`}
                    variants={itemVariants}
                    className="flex gap-4 rounded-lg border p-3"
                  >
                    <div className="relative aspect-square w-20 overflow-hidden rounded-lg bg-accent">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/products/${item._id}`}
                        className="font-medium hover:underline"
                      >
                        {item.title}
                      </Link>

                      <div className="mt-2 space-y-1 text-sm">
                        {item.selectedColor && (
                          <p className="flex items-center gap-2">
                            Color:{" "}
                            <span
                              className="h-4 w-4 rounded-full border"
                              style={{
                                backgroundColor: itemColor?.value,
                              }}
                            />
                          </p>
                        )}
                        {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                        <p>Quantity: {item.amount}</p>
                        <p>Price: {formatPrice(item.price)}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch(decrementAmount(item._id))}
                            className="rounded-md border p-1 hover:bg-accent"
                            disabled={item.amount === 1}
                          >
                            -
                          </button>
                          <span>{item.amount}</span>
                          <button
                            onClick={() => dispatch(incrementAmount(item._id))}
                            className="rounded-md border p-1 hover:bg-accent"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="text-sm text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {cartItems.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 space-y-4">
                <div className="flex items-center justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice(cartItems))}</span>
                </div>

                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddedCart;
