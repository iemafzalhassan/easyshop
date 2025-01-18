"use client";

import { categories } from "@/config/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ShopsPage = () => {
  return (
    <div className="min-h-screen py-7 md:py-10">
      <div className="container">
        <h1 className="text-2xl md:text-3xl font-bold mb-7 md:mb-10">
          All Shops
        </h1>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.div variants={item} key={category.title}>
              <Link
                href={`/shops/${category.title}`}
                className="block bg-secondary hover:bg-accent transition-colors duration-300 p-4 md:p-6 rounded-lg text-center"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <Image
                    src={category.icon}
                    alt={category.title}
                    fill
                    className="object-contain"
                    sizes="80px"
                    priority
                    onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => (event.currentTarget.style.display = 'none')}
                  />
                </div>
                <span className="capitalize mt-2 block">{category.title}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopsPage;
