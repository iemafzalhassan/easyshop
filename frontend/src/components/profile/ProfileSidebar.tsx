"use client";

import { deleteCookies } from "@/app/actions";
import { setAuthenticated, removeCurrentUser } from "@/lib/features/auth/authSlice";
import { clearCart } from "@/lib/features/cart/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

const links = [
  {
    title: "Profile",
    url: "/profile",
    icon: "👤",
  },
  {
    title: "Change Password",
    url: "/profile/change-password",
    icon: "🔒",
  },
  {
    title: "My Orders",
    url: "/profile/orders",
    icon: "📦",
  },
  {
    title: "My Wishlists",
    url: "/profile/wishlists",
    icon: "❤️",
  },
];

const ProfileSidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isConfirm, setIsConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await deleteCookies("token");
      dispatch(removeCurrentUser());
      dispatch(clearCart());
      setIsConfirm(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div className="rounded-lg bg-card shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="p-4 md:p-6">
          <AnimatePresence>
            <ul className="space-y-2">
              {links.map((link) => (
                <motion.li
                  key={link.url}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.url}
                    className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      pathname === link.url
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.title}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setIsConfirm(true)}
                  className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <span className="text-lg">🚪</span>
                  Logout
                </button>
              </motion.li>
            </ul>
          </AnimatePresence>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isConfirm} onClose={() => setIsConfirm(false)}>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Confirm Logout</h3>
          <p className="mb-6 text-muted-foreground">
            Are you sure you want to logout? Your cart will be cleared.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileSidebar;
