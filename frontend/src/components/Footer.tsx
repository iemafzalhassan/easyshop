"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaHeart } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Logo from "@/assets/Logo";
import { FaGithub, FaLinkedinIn, FaUserLarge } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-secondary py-14">
      <div className="container">
        <div className="flex flex-col items-center">
          <Logo width={120} height={60} className="mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Subscribe now</h2>
          <p className="text-sm text-gray-400 max-w-sm text-center mb-4">
            Subscribe your email for newsletter and featured news based on your
            interest
          </p>

          <form className="flex justify-center items-center max-w-sm mx-auto w-full mb-16">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Write your email address"
              className="rounded-r-none focus-visible:ring-primary"
            />
            <Button type="submit" className="text-xl rounded-l-none bg-primary hover:bg-primary/90">
              <IoMdSend />
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-2 pt-2">
          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-4 text-primary">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="https://iemafzalhassan.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
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

          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-4 text-primary">Account</h3>
            <ul className="space-y-2">
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

          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-4 text-primary">Help Center</h3>
            <ul className="space-y-2">
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

          <div className="space-y-3 flex flex-col items-center">
            <h3 className="text-base font-semibold mb-4 text-primary">Follow Me</h3>
            <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 mb-4" />
            <div className="flex gap-3 justify-start">
              <Link
                href="https://www.iemafzalhassan.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaUserLarge className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/iemafzalhassan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaGithub className="w-5 h-5" />
              </Link>
              <Link
                href="https://twitter.com/iemafzalhassan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/iemafzalhassan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center">
            <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 mb-4" />
            <p className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200 pb-2">
              &copy; {new Date().getFullYear()} EasyShop | All rights Reserved. | Made with{" "}
              <span className="inline-block animate-pulse">
                <FaHeart className="inline-block text-red-500 text-[13px]" />
              </span>{" "}
              by{" "}
              <Link 
                href="https://iemafzalhassan.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative inline-block transition-colors hover:text-primary group"
              >
                <span className="relative inline-block transition-transform duration-300 group-hover:-translate-y-1">
                  Md. Afzal Hassan Ehsani.
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/20 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
