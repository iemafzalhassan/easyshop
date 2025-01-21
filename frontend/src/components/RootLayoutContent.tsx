'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddedCart from "@/components/AddedCart";
import MobileBottomMenu from "@/components/MobileBottomMenu";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import CartInitializer from "@/components/cart/CartInitializer";
import { Toaster } from "@/components/ui/toaster";

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <CartInitializer />
      {!pathname?.startsWith('/auth') && (
        <header>
          <Navbar />
        </header>
      )}
      <main className="flex-1">{children}</main>
      {!pathname?.startsWith('/auth') && (
        <>
          <Footer />
          <AddedCart />
          <MobileBottomMenu />
          <ScrollToTopBtn />
        </>
      )}
      <Toaster />
    </div>
  );
}
