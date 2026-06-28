"use client";

import clsx from "clsx";
import { Bed, Bell, Mountain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { label: "Penginapan", path: "/", icon: Bed },
  { label: "Pengalaman", path: "/pengalaman", icon: Mountain },
  { label: "Layanan", path: "/layanan", icon: Bell },
];

export default function MenuBar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <div className="border-b mt-18 border-zinc-100 bg-white w-full">
      <div className="max-w-7xl px-2 py-3 md:px-12 lg:px-35 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max md:min-w-0">
          {menus.map(({ label, path, icon: Icon }) => (
            <Link
              key={label}
              href={path}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 text-sm transition-colors whitespace-nowrap",
                isActive(path)
                  ? "border border-zinc-800 rounded-full text-zinc-900 font-medium"
                  : "text-zinc-500 hover:text-zinc-800",
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
