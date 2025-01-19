"use client";

import { toggleWishlist } from "@/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useMemo } from "react";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { Product } from "@/types/product";

const ContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
  },
};

type AddToWishlistProps = {
  product: Product;
};

const AddToWishlist = ({ product }: AddToWishlistProps) => {
  const { wishlists } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const isInWishlist = useMemo(
    () => wishlists.some(
      (wishlist) => wishlist._id === product._id
    ),
    [wishlists, product]
  );

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <AnimatePresence mode="wait">
      <motion.button
        variants={ContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleToggleWishlist}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <motion.div variants={item}>
          {isInWishlist ? (
            <IoMdHeart className="text-2xl text-red-500" />
          ) : (
            <IoIosHeartEmpty className="text-2xl text-gray-600 dark:text-gray-300" />
          )}
        </motion.div>
      </motion.button>
    </AnimatePresence>
  );
};

export default AddToWishlist;
