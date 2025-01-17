"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Logo from "./ui/Logo";

const Footer = () => {
  return (
    <footer className="bg-secondary py-24">
      <div className="container">
        <div className="flex flex-col items-center">
          <Logo width={120} height={60} className="mb-6" />
          <h2 className="text-3xl font-semibold">Subscribe now</h2>
          <p className="mt-3 max-w-sm text-center dark:text-gray-400">
            Subscribe your email for newsletter and featured news based on your
            interest
          </p>

          <form className="flex justify-center items-center max-w-sm mx-auto w-full mt-3">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Write your email address"
            />
            <Button type="submit" className="text-2xl">
              <IoMdSend />
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Company
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy & Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-primary transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Help Center</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <Link
                href="https://www.iemafzalhassan.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaFacebookF />
              </Link>
              <Link
                href="https://github.com/iemafzalhassan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaTwitter />
              </Link>
              <Link
                href="https://www.linkedin.com/in/iemafzalhassan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().getFullYear()} EasyShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
