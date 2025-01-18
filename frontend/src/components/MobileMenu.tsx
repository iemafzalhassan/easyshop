"use client";

import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "./ui/button";
import Logo from "@/assets/Logo";
import { ToggleTheme } from "./ToggleTheme";

interface Link {
  title: string;
  url: string;
  subLinks?: Link[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Link[];
}

const MobileMenu = ({ isOpen, onClose, links }: MobileMenuProps) => {
  const { currentUser } = useAppSelector((state) => state.auth);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 bottom-0 w-[300px] bg-background z-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <Logo />
          <button
            type="button"
            className="text-xl p-1 h-6 w-6 bg-primary rounded-full flex justify-center items-center text-white"
            onClick={onClose}
            title="close"
          >
            <HiOutlineXMark />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <ul className="px-5 relative mt-3">
            <li className="absolute top-0 right-4">
              <ToggleTheme />
            </li>
            {links.map((link, index) =>
              link.subLinks ? (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{link.title}</h3>
                  <div className="ml-4 space-y-2">
                    {link.subLinks.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subLink.url}
                        className="block text-muted-foreground hover:text-foreground"
                        onClick={onClose}
                      >
                        {subLink.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  href={link.url}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  {link.title}
                </Link>
              )
            )}
          </ul>

          {!currentUser && (
            <div className="mt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={onClose}
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                className="w-full justify-start"
                onClick={onClose}
                asChild
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
