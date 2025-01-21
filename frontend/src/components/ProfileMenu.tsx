"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/services/auth.service";
import Image from "next/image";
import Link from "next/link";
import { BsCartCheckFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaHeart } from "react-icons/fa";
import { IoBagCheckOutline, IoLogOut } from "react-icons/io5";
import { useEffect, useState } from "react";

const DEFAULT_AVATAR = "/assets/icons/avatar.png";

const profileLinks = [
  {
    title: "Profile",
    url: "/profile",
    icon: <CgProfile />,
  },
  {
    title: "My Orders",
    url: "/profile/orders",
    icon: <BsCartCheckFill />,
  },
  {
    title: "My Wishlists",
    url: "/profile/wishlists",
    icon: <FaHeart />,
  },
  {
    title: "Check out",
    url: "/checkout",
    icon: <IoBagCheckOutline />,
  },
];

interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
}

export function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || DEFAULT_AVATAR);

  useEffect(() => {
    setAvatarSrc(user?.avatar || DEFAULT_AVATAR);
  }, [user?.avatar]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center outline-none">
          <div className="relative w-8 h-8 overflow-hidden rounded-full">
            <Image
              src={avatarSrc}
              alt={user?.name || "User"}
              width={32}
              height={32}
              className="object-cover w-full h-full"
              onError={() => setAvatarSrc(DEFAULT_AVATAR)}
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {profileLinks.map((link) => (
          <DropdownMenuItem key={link.url} asChild>
            <Link
              href={link.url}
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              {link.icon}
              <span>{link.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <IoLogOut />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
