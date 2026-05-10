"use client";

import { Logo } from "@/components/ui/logo/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Search } from "lucide-react";
import type React from "react";

interface Props {
  isFixed?: boolean;
}

export default function Navbar({ isFixed = true }: Props): React.ReactNode {
  const { scrollY } = useScroll();

  return (
    <nav
      className={`${
        scrollY > 300 ? "shadow-none" : "shadow-custom"
      } py-4 w-full ${isFixed ? "fixed" : ""} z-100 bg-white top-0`}
    >
      <div className="flex gap-x-2 px-6 lg:px-12 justify-between max-w-7xl items-center mx-auto">
        {/* Logo */}
        <Logo scrollY={scrollY} />

        {/* Search Bar */}
        <div
          className={`${
            scrollY > 340 || !isFixed ? "flex" : "hidden"
          } max-w-md w-full items-center gap-2 rounded-full bg-white shadow-custom`}
        >
          <input
            type="text"
            placeholder="Cari destinasi ..."
            className="flex-1 px-4 py-3 text-sm text-gray-700 outline-none bg-transparent"
          />
          <button className="flex items-center justify-center rounded-full bg-primary p-3 transition hover:bg-primary-600 text-white">
            <Search size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
