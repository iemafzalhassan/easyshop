"use client";

import { User, logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { deleteCookies } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { profileNavLinks } from "@/config/navigation";
import { useState } from "react";
import Modal from "@/components/Modal";

interface ProfileMenuProps {
  user: User | null;
  variant?: "desktop" | "mobile";
  onClose?: () => void;
}

export function ProfileMenu({ user, variant = "desktop", onClose }: ProfileMenuProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    await deleteCookies();
    router.push("/");
    onClose?.();
  };

  return (
    <>
      <div className={cn(
        "space-y-4",
        variant === "desktop" ? "p-0" : "p-6"
      )}>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-muted grid place-items-center">
            <CgProfile className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-medium">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {profileNavLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              onClick={onClose}
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {link.title}
            </Link>
          ))}
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="w-full rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent text-left"
          >
            Logout
          </button>
        </div>
      </div>

      <Modal
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
      >
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </Modal>
    </>
  );
}
