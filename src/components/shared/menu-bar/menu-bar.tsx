"use client";
import Button from "@/components/ui/button/button";
import clsx from "clsx";
import { Navigation, Search, User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type Menu = {
  label: string;
  path: string;
  icon: LucideIcon;
};

const menuUnathorize: Menu[] = [
  {
    label: "Telusuri",
    path: "/",
    icon: Search,
  },
  // {
  //   label: "Favorit",
  //   path: "/wishlists",
  //   icon: Heart,
  // },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
];

interface Props {
  token?: string;
}

export default function MenuBar({ token }: Props): React.ReactNode {
  const pathname = usePathname();

  const menu = !token
    ? menuUnathorize
    : [
        ...menuUnathorize.slice(0, 1),
        {
          label: "Perjalanan",
          path: "/journeys",
          icon: Navigation,
        },
        ...menuUnathorize.slice(1),
      ];

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  const [translateY, setTranslateY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setTranslateY((prev) => Math.max(prev - 10, 0));

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        "w-full border-t ease-in-out transition-all delay-150 border-zinc-100  bottom-0 fixed bg-white flex p-2 items-center px-10",
        {
          "justify-between": token,
        },
        {
          "justify-around": !token,
        },
      )}
      style={{
        transform: `translateY(${translateY}px)`,
      }}
    >
      {menu.map((item) => {
        const Icon = item.icon;
        return (
          <Button variant="ghost" asChild key={item.label}>
            <Link
              href={item.path}
              className="flex flex-col justify-around  items-center"
            >
              <Icon
                strokeWidth={isActive(item.path) ? 2.5 : 2}
                size={26}
                className={clsx({
                  "text-primary-800": isActive(item.path),
                })}
              />
              <span
                className={clsx("text-[10px]", {
                  "text-primary-800 font-bold!": isActive(item.path),
                })}
              >
                {item.label}
              </span>
            </Link>
          </Button>
        );
      })}

      {/* <Button variant="ghost" asChild>
        <Link to="/" className="flex flex-col justify-center items-center">
          <Heart strokeWidth={2.5} className="text-black" />
          <span className="font-medium text-black text-[10px]">Favorit</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/" className="flex flex-col justify-center items-center">
          <User strokeWidth={2.5} className="text-black" />
          <span className="font-medium text-black text-[10px]">Masuk</span>
        </Link>
      </Button> */}
    </div>
  );
}
