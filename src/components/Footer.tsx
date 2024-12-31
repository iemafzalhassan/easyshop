import Logo from "@/assets/Logo";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer className="bg-secondary py-24">
      <div className="container">
        <div className="flex flex-col items-center">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10 gap-14">
          <div>
            <Logo />
            <div className="dark:text-gray-400">
              <p className="mt-6">Bihar, India</p>

              <a href="mailto:demo@gmail.com" className="block mt-3">
                demo@gmail.com
              </a>
              <a href="tel:+919999999999" className="block mt-1">
                +91 9999999999
              </a>

              <div className="flex flex-wrap gap-3 items-center mt-4">
                <Button
                  variant="outline"
                  className="rounded-full h-10 w-10 hover:bg-primary hover:text-white p-0"
                >
                  <FaFacebookF />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-10 w-10 hover:bg-primary hover:text-white p-0"
                >
                  <FaTwitter />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full h-10 w-10 hover:bg-primary hover:text-white p-0"
                >
                  <FaInstagram />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold">Explore</h4>
            <ul className="mt-6 dark:text-gray-300 [&>li]:mb-3">
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"/shops"}
                >
                  Shops
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"/offers"}
                >
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  Flash Deals
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  Coupon
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold">Customer Service</h4>
            <ul className="mt-6 dark:text-gray-300 [&>li]:mb-3">
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  FAQ & Helps
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  Vendor Refund Policies
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  Customer Refund Policies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold">Our Information</h4>
            <ul className="mt-6 dark:text-gray-300 [&>li]:mb-3">
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  Manufacturers
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  Privacy policies
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"#"}
                >
                  Terms & conditions
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline hover:text-primary transition-all duration-300"
                  href={"/contact"}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
