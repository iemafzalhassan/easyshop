"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const shops = [
  { title: "gadgets", icon: "/assets/icons/gadgets.png" },
  { title: "grocery", icon: "/assets/icons/grocery.png" },
  { title: "bakery", icon: "/assets/icons/bakery.png" },
  { title: "clothing", icon: "/assets/icons/clothing.png" },
  { title: "makeup", icon: "/assets/icons/makeup.png" },
  { title: "bags", icon: "/assets/icons/bag.png" },
  { title: "furniture", icon: "/assets/icons/furniture.png" },
  { title: "books", icon: "/assets/icons/books.png" },
  { title: "medicine", icon: "/assets/icons/medicine.png" },
];

const FeaturedNav = () => {
  const searchParams = useSearchParams();
  const activeShop = searchParams?.get("featured") || "gadgets";

  return (
    <div className="flex gap-4 items-center flex-wrap">
      <AnimatePresence>
        {shops.map((shop) => (
          <Link
            href={`?featured=${shop.title.toLowerCase()}`}
            type="button"
            key={shop.title}
            className={cn(
              "relative flex gap-2 items-center px-4 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-300",
              {
                "bg-accent": activeShop === shop.title.toLowerCase(),
              }
            )}
          >
            <div className="w-5 h-5 relative">
              <Image
                src={shop.icon}
                alt={shop.title}
                fill
                className="object-contain"
                sizes="20px"
              />
            </div>
            <span className="capitalize">{shop.title}</span>
          </Link>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FeaturedNav;
