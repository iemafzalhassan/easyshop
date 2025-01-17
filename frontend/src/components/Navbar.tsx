"use client";

import { authenticated, deleteCookies } from "@/app/actions";
import { setAuthenticated } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoChevronDownOutline } from "react-icons/io5";
import MobileMenu from "./MobileMenu";
import Modal from "./Modal";
import { ProfileMenu } from "./ProfileMenu";
import SearchBar from "./SearchBar";
import { ToggleTheme } from "./ToggleTheme";
import LoginForm from "./forms/LoginForm";
import SignupForm from "./forms/SignupForm";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("./ui/Logo"), {
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
        title: "Checkout",
        url: "/checkout",
      },
      {
        title: "Orders",
        url: "/profile/orders",
      },
    ],
  },
];

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authentication = async () => {
      try {
        const res = await authenticated();
        dispatch(setAuthenticated(res));
      } catch (error) {
        console.error("Authentication error:", error);
        dispatch(setAuthenticated(false));
      } finally {
        setIsLoading(false);
      }
    };

    authentication();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await deleteCookies("token");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setIsConfirm(false);
      dispatch(setAuthenticated(false));
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className="navbar px-default py-3 bg-secondary shadow-lg border-b sticky top-0 left-0 z-50">
        <nav className="flex gap-6 items-center justify-between">
          <div className="left flex gap-6 items-center flex-1">
            <Link href="/" className="block">
              <Logo />
            </Link>

            <div className="search flex-1 max-w-sm hidden md:block">
              <SearchBar />
            </div>
          </div>

          <div className="right flex items-center gap-3">
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) =>
                link.subLinks ? (
                  <div
                    key={link.title}
                    className="relative group cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <span>{link.title}</span>
                      <IoChevronDownOutline className="text-lg" />
                    </div>

                    <div className="absolute top-full pt-2 left-0 hidden group-hover:block">
                      <div className="bg-secondary p-2 rounded-lg shadow-lg min-w-[150px]">
                        {link.subLinks.map((subLink) => (
                          <Link
                            key={subLink.title}
                            href={subLink.url}
                            className="block px-3 py-1.5 rounded-md hover:bg-accent"
                          >
                            {subLink.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link key={link.title} href={link.url}>
                    {link.title}
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <ToggleTheme />

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <ProfileMenu
                      isConfirm={isConfirm}
                      setIsConfirm={setIsConfirm}
                      handleLogout={handleLogout}
                    />
                  ) : (
                    <Button
                      onClick={() => setIsOpen(true)}
                      className="hidden md:block"
                    >
                      Login
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsMobileOpen(true)}
              >
                <HiMenuAlt2 className="text-2xl" />
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <MobileMenu
        isOpen={isMobileOpen}
        setIsOpen={setIsMobileOpen}
        links={links}
        isAuthenticated={isAuthenticated}
        setIsLoginOpen={setIsOpen}
      />

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={isRegisterTab ? "Create Account" : "Login"}
      >
        {isRegisterTab ? (
          <SignupForm setIsRegisterTab={setIsRegisterTab} setIsOpen={setIsOpen} />
        ) : (
          <LoginForm setIsRegisterTab={setIsRegisterTab} setIsOpen={setIsOpen} />
        )}
      </Modal>
    </>
  );
};

export default Navbar;
