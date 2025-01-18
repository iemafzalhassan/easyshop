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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <div className="relative w-8 h-8 overflow-hidden rounded-full">
            <Image
              src={user.avatar || "/assets/icons/Avatar.png"}
              alt={user.name}
              width={32}
              height={32}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {profileLinks.map((link) => (
          <Link key={link.title} href={link.url}>
            <DropdownMenuItem className="cursor-pointer">
              <span className="mr-2">{link.icon}</span>
              {link.title}
            </DropdownMenuItem>
          </Link>
        ))}

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={onLogout}
        >
          <IoLogOut className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
