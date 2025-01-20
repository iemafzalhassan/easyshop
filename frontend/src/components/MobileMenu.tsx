"use client";

import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "./ui/button";
import Logo from "@/assets/Logo";
import { ToggleTheme } from "./ToggleTheme";
import { useRouter } from "next/navigation";

interface Link {
  title: string;
  url: string;
  external?: boolean;
  subLinks?: Link[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Link[];
}

const MobileMenu = ({ isOpen, onClose, links }: MobileMenuProps) => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full border-l bg-background p-6 shadow-lg sm:w-[350px]">
        <div className="flex items-center justify-between">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <HiOutlineXMark className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8">
          <nav className="flex flex-col space-y-4">
            {links.map((link) => (
              <div key={link.title}>
                {link.subLinks ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold">{link.title}</h4>
                    <div className="ml-4 flex flex-col space-y-2">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.title}
                          href={subLink.url}
                          target={subLink.external ? "_blank" : undefined}
                          rel={subLink.external ? "noopener noreferrer" : undefined}
                          className="text-muted-foreground hover:text-primary"
                          onClick={onClose}
                        >
                          {subLink.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.url}
                    className="text-lg font-medium"
                    onClick={onClose}
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-6">
            <ToggleTheme />
          </div>

          {!currentUser && (
            <div className="mt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  router.push('/login');
                }}
              >
                Login
              </Button>
              <Button
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  router.push('/register');
                }}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
