"use client";

import { Logo } from "@/components/ui/logo/logo";
import Login from "@/features/auth/components/login";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";
import { useScroll } from "@/hooks/use-scroll";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Navigation, Search, User, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  isFixed?: boolean;
  token?: string;
}

export default function Navbar({
  isFixed = true,
  token,
}: Props): React.ReactNode {
  const { scrollY } = useScroll();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { data: user } = useCurrentUser(!!token);
  const logout = useLogout();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["current-user"] });
        setShowProfileMenu(false);
        router.push("/");
        router.refresh();
      },
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    router.refresh();
  };

  const firstName = user?.name?.split(" ")[0] ?? null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <>
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

          {/* Auth area */}
          {!token ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="items-center hidden md:flex gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 transition cursor-pointer shrink-0"
            >
              <User size={16} />
              Masuk / Daftar
            </button>
          ) : (
            <div
              className="relative hidden md:block shrink-0"
              ref={profileMenuRef}
            >
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-zinc-300 p-1 pr-3 hover:shadow-md transition cursor-pointer"
              >
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium max-w-28 truncate">
                  {firstName ?? "..."}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-sm font-semibold truncate">
                      {user?.name ?? "..."}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                  >
                    <UserCircle size={16} className="text-zinc-500" />
                    Profil saya
                  </Link>
                  <Link
                    href="/journeys"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                  >
                    <Navigation size={16} className="text-zinc-500" />
                    Perjalanan
                  </Link>

                  <div className="border-t border-zinc-100" />

                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {logout.isPending ? "Keluar..." : "Keluar"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Auth modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-200 flex items-end md:items-center justify-center bg-zinc-900/50"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:w-auto"
          >
            <Login
              onClose={() => setShowAuthModal(false)}
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
