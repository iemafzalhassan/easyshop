"use client";

import { setCurrentUser } from "@/lib/features/auth/authSlice";
import { handleCartOpen } from "@/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoChevronDownOutline } from "react-icons/io5";
import { BsCartCheckFill } from "react-icons/bs";
import MobileMenu from "./MobileMenu";
import { ProfileMenu } from "./ProfileMenu";
import SearchBar from "./SearchBar";
import { ToggleTheme } from "./ToggleTheme";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("@/assets/Logo"), {
  ssr: false,
  loading: () => (
    <div className="w-[40px] h-[40px] bg-secondary animate-pulse rounded-lg" />
  ),
});

const links = [
  {
    title: "Shops",
    url: "/shops",
  },
  {
    title: "Contact",
    url: "/contact",
  },
  {
    title: "Offers",
    url: "/offers",
  },
  {
    title: "Pages",
    url: "",
    subLinks: [
      {
        title: "Profile",
        url: "/profile",
      },
      {
        title: "Contact Us",
        url: "/contact",
      },
      {
        title: "About Me",
        url: "https://iemafzalhassan.tech",
        external: true
      },
    ],
  },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { currentUser } = useAppSelector((state) => state.auth);
  const { cartItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await authService.checkAuth();
        if (isAuthenticated) {
          const user = await authService.getProfile();
          if (user) {
            dispatch(setCurrentUser(user));
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    checkAuth();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(setCurrentUser(null));
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginClick = useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  const handleSignupClick = useCallback(() => {
    router.push('/auth/register');
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <button
          className="mr-2 block lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
        </Link>

        <div className="hidden lg:flex lg:gap-x-12">
          {links.map((link, index) =>
            link.subLinks ? (
              <div key={index} className="relative group">
                <button className="inline-flex items-center text-sm font-medium text-muted-foreground">
                  {link.title}
                  <IoChevronDownOutline className="ml-1 h-3 w-3" />
                </button>
                <div className="absolute left-0 top-full hidden pt-2 group-hover:block">
                  <div className="w-48 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                    {link.subLinks.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subLink.url}
                        target={subLink.external ? "_blank" : undefined}
                        rel={subLink.external ? "noopener noreferrer" : undefined}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {subLink.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={index}
                href={link.url}
                className="text-sm font-medium text-muted-foreground"
              >
                {link.title}
              </Link>
            )
          )}
        </div>

        <div className="ml-auto flex items-center gap-x-4">
          <SearchBar />
          <ToggleTheme />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(handleCartOpen(true))}
            className="relative hidden md:flex"
          >
            <BsCartCheckFill className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
          {currentUser ? (
            <ProfileMenu user={currentUser} onLogout={handleLogout} />
          ) : (
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-transparent hover:bg-accent"
              >
                Login
              </button>
              <button
                onClick={() => window.location.href = '/auth/register'}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-gradient hover:text-primary border-2 border-primary hover:bg-background text-white"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={links}
      />
    </header>
  );
};

export default Navbar;
