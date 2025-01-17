"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo = ({ className, width = 40, height = 40 }: LogoProps) => {
  return (
    <Link href="/" className={cn("block relative", className)}>
      <Image
        src="/assets/logo.svg"
        alt="EasyShop Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
};

export default Logo;
