import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddedCart from "@/components/AddedCart";
import MobileBottomMenu from "@/components/MobileBottomMenu";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import CartInitializer from "@/components/cart/CartInitializer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "EasyShop - Next.js E-commerce Template",
  description:
    "EasyShop is the user-friendly and 100% SEO friendly Next.js eCommerce template perfect for launching your online store. With its clean design and customizable options, EasyShop makes selling online a breeze. Start building your dream store today and boost your online presence effortlessly!",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1.0',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'EasyShop - Iemafzalhassan',
    description: 'Your one-stop shop for all your shopping needs',
    url: 'https://easyshop.com',
    siteName: 'EasyShop',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EasyShop Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={roboto.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <CartInitializer />
            <header>
              <Navbar />
            </header>
            <main className="flex-1">{children}</main>
            <Footer />
            <AddedCart />
            <MobileBottomMenu />
            <ScrollToTopBtn />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
