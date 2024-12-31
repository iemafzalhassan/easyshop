import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import AddedCart from "@/components/AddedCart";
import StoreProvider from "./StoreProvider";
import MobileBottomMenu from "@/components/MobileBottomMenu";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | EasyShop",
    default: "EasyShop",
  },
  description:
    "EasyShop is the user-friendly and 100% SEO friendly Next.js eCommerce template perfect for launching your online store. With its clean design and customizable options, EasyShop makes selling online a breeze. Start building your dream store today and boost your online presence effortlessly!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <Navbar />
            </header>
            {children}
            <Footer />
            <AddedCart />
            <MobileBottomMenu />
            <Toaster />
            <ScrollToTopBtn />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
