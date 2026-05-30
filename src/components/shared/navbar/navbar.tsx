/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import SearchBar from "@/components/shared/search-bar/SearchBar";
import { Logo } from "@/components/ui/logo/logo";
import Login from "@/features/auth/components/login";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronDown,
  LogOut,
  Minus,
  Navigation,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  isFixed?: boolean;
  token?: string;
  showCategoryTabs?: boolean;
}

type MobileSection = "location" | "date" | "guests" | null;
type Category = "penginapan" | "pengalaman" | "layanan" | "wisata";
type Guests = { adult: number; child: number; baby: number };

const CATEGORIES: {
  key: Category;
  label: string;
  href: string;
  isNew?: boolean;
}[] = [
  { key: "penginapan", label: "Penginapan", href: "/" },
  { key: "wisata", label: "Wisata", href: "/wisata" },
  {
    key: "pengalaman",
    label: "Pengalaman",
    href: "/pengalaman",
    isNew: true,
  },
  { key: "layanan", label: "Layanan", href: "/layanan", isNew: true },
];

const GUEST_ROWS = [
  { key: "adult" as const, label: "Dewasa", sub: "Usia 13+", min: 1 },
  { key: "child" as const, label: "Anak", sub: "Usia 2-12", min: 0 },
  { key: "baby" as const, label: "Bayi", sub: "Di bawah 2 tahun", min: 0 },
];

// ─── compact search pill ──────────────────────────────────────────────────────

function CompactPill({
  onClick,
  location,
  dateLabel,
  guestLabel,
  className,
}: {
  onClick: () => void;
  location: string;
  dateLabel: string;
  guestLabel: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-0 rounded-full border border-zinc-300 bg-white shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]",
        className,
      )}
    >
      <span className="px-4 py-2.5 text-sm font-semibold text-zinc-800 border-r border-zinc-200">
        {location}
      </span>
      <span className="px-4 py-2.5 text-sm text-zinc-500 border-r border-zinc-200">
        {dateLabel}
      </span>
      <span className="pl-4 pr-2 py-2.5 text-sm text-zinc-500">
        {guestLabel}
      </span>
      <div className="mr-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shrink-0">
        <Search size={14} />
      </div>
    </button>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export default function Navbar({
  isFixed = true,
  token,
  showCategoryTabs = false,
}: Props): React.ReactNode {
  const { scrollY } = useScroll();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const isOnHomePage = pathname === "/";

  // Compact mode: NOT home page, OR scrolled past threshold on home page
  const isCompact = !isOnHomePage || scrollY > 80;

  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Close search dropdown when entering compact mode by scrolling
  useEffect(() => {
    if (!isCompact) setSearchOpen(false);
  }, [isCompact]);

  // Active category from pathname — match against each category's href
  const activeCategory: Category =
    CATEGORIES.find((c) => c.href !== "/" && pathname.startsWith(c.href))
      ?.key ?? "penginapan";

  // Compact pill labels — from URL search params if on search page
  const summaryLocation = searchParams.get("q") || "Ke mana saja";
  const rawCheckIn = searchParams.get("check_in");
  const rawCheckOut = searchParams.get("check_out");
  const summaryDates =
    rawCheckIn && rawCheckOut
      ? `${format(parseISO(rawCheckIn), "d MMM", { locale: id })} – ${format(parseISO(rawCheckOut), "d MMM", { locale: id })}`
      : rawCheckIn
        ? format(parseISO(rawCheckIn), "d MMM", { locale: id })
        : "Waktu apa saja";
  const guestTotal =
    parseInt(searchParams.get("adults") ?? "0") +
    parseInt(searchParams.get("children") ?? "0");
  const summaryGuests =
    guestTotal > 0 ? `${guestTotal} tamu` : "Tambahkan tamu";

  // ── mobile overlay ──────────────────────────────────────────────────────────

  const [mobileSection, setMobileSection] = useState<MobileSection>("location");
  const [mobileLocation, setMobileLocation] = useState("");
  const [mobileDateRange, setMobileDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [mobileGuests, setMobileGuests] = useState<Guests>({
    adult: 1,
    child: 0,
    baby: 0,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUser(!!token);
  const logout = useLogout();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      )
        setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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

  const firstName = user?.name?.split(" ")[0] ?? null;
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  // ── mobile search helpers ─────────────────────────────────────────────────

  const updateMobileGuest = (key: keyof Guests, delta: 1 | -1) => {
    setMobileGuests((prev) => {
      const next = prev[key] + delta;
      const row = GUEST_ROWS.find((r) => r.key === key)!;
      if (next < row.min) return prev;
      if (key !== "baby" && delta === 1 && prev.adult + prev.child >= 10)
        return prev;
      return { ...prev, [key]: next };
    });
  };

  const mobileDateLabel = mobileDateRange.start
    ? `${format(mobileDateRange.start, "d MMM", { locale: id })}${
        mobileDateRange.end
          ? ` – ${format(mobileDateRange.end, "d MMM", { locale: id })}`
          : ""
      }`
    : null;

  const totalMobileGuests = mobileGuests.adult + mobileGuests.child;
  const mobileGuestLabel =
    totalMobileGuests > 1 || mobileGuests.baby > 0
      ? `${totalMobileGuests} tamu${mobileGuests.baby > 0 ? `, ${mobileGuests.baby} bayi` : ""}`
      : null;

  const clearMobileSearch = () => {
    setMobileLocation("");
    setMobileDateRange({ start: null, end: null });
    setMobileGuests({ adult: 1, child: 0, baby: 0 });
  };

  const handleMobileSearch = () => {
    const params = new URLSearchParams();
    if (mobileLocation.trim()) params.set("q", mobileLocation.trim());
    if (mobileDateRange.start)
      params.set("check_in", format(mobileDateRange.start, "yyyy-MM-dd"));
    if (mobileDateRange.end)
      params.set("check_out", format(mobileDateRange.end, "yyyy-MM-dd"));
    params.set("adults", String(mobileGuests.adult));
    if (mobileGuests.child > 0)
      params.set("children", String(mobileGuests.child));
    if (mobileGuests.baby > 0) params.set("babies", String(mobileGuests.baby));
    setMobileOpen(false);
    router.push(`/search/homes?${params.toString()}`);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── mobile full-screen search overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white md:hidden">
          {/* top */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <div className="flex gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push(cat.href);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition",
                    activeCategory === cat.key
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-500 hover:bg-zinc-100",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-100"
            >
              <X size={16} />
            </button>
          </div>

          {/* accordion sections */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {/* Lokasi */}
            <div
              className={cn(
                "rounded-2xl border transition",
                mobileSection === "location"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setMobileSection(
                    mobileSection === "location" ? null : "location",
                  )
                }
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">Lokasi</p>
                  {mobileSection !== "location" && (
                    <p className="text-sm text-zinc-400">
                      {mobileLocation || "Cari destinasi"}
                    </p>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform",
                    mobileSection === "location" && "rotate-180",
                  )}
                />
              </button>
              {mobileSection === "location" && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 focus-within:border-zinc-900">
                    <Search size={15} className="shrink-0 text-zinc-400" />
                    <input
                      autoFocus
                      value={mobileLocation}
                      onChange={(e) => setMobileLocation(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setMobileSection("date")
                      }
                      placeholder="Kota, tempat, atau destinasi..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tanggal */}
            <div
              className={cn(
                "rounded-2xl border transition",
                mobileSection === "date"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setMobileSection(mobileSection === "date" ? null : "date")
                }
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">Tanggal</p>
                  <p className="text-sm text-zinc-400">
                    {mobileDateLabel ?? "Tambahkan tanggal"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform",
                    mobileSection === "date" && "rotate-180",
                  )}
                />
              </button>
              {mobileSection === "date" && (
                <div className="px-2 pb-4">
                  <DateRangePicker
                    value={mobileDateRange}
                    onChange={(r) => {
                      setMobileDateRange(r);
                      if (r.start && r.end) setMobileSection("guests");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tamu */}
            <div
              className={cn(
                "rounded-2xl border transition",
                mobileSection === "guests"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setMobileSection(mobileSection === "guests" ? null : "guests")
                }
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">Tamu</p>
                  <p className="text-sm text-zinc-400">
                    {mobileGuestLabel ?? "Tambahkan tamu"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform",
                    mobileSection === "guests" && "rotate-180",
                  )}
                />
              </button>
              {mobileSection === "guests" && (
                <div className="space-y-4 px-4 pb-4">
                  {GUEST_ROWS.map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {row.label}
                        </p>
                        <p className="text-xs text-zinc-500">{row.sub}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateMobileGuest(row.key, -1)}
                          disabled={mobileGuests[row.key] <= row.min}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-500 disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm font-medium">
                          {mobileGuests[row.key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateMobileGuest(row.key, 1)}
                          disabled={
                            row.key !== "baby" &&
                            mobileGuests.adult + mobileGuests.child >= 10
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-500 disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* bottom bar */}
          <div className="flex items-center justify-between border-t border-zinc-100 bg-white px-4 py-4">
            <button
              type="button"
              onClick={clearMobileSearch}
              className="text-sm font-medium text-zinc-700 underline underline-offset-2"
            >
              Hapus semua
            </button>
            <button
              type="button"
              onClick={handleMobileSearch}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Search size={16} />
              Cari
            </button>
          </div>
        </div>
      )}

      {/* ── desktop search backdrop ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/20 hidden md:block"
          onClick={() => setSearchOpen(false)}
        />
      )}

      {/* ── main nav ── */}
      <nav
        className={cn(
          "w-full bg-white transition-shadow z-[100]",
          isFixed ? "fixed top-0" : "relative",
          searchOpen || scrollY > 60 ? "shadow-custom" : "shadow-none",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 py-3 lg:px-12">
          {/* ── mobile row ── */}
          <div className="flex items-center gap-3 md:hidden">
            <Logo scrollY={scrollY} />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex flex-1 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 shadow-sm active:scale-[0.98] transition-transform"
            >
              <Search size={15} className="shrink-0 text-zinc-400" />
              <span className="text-sm text-zinc-400">Mulai pencarian</span>
            </button>
          </div>

          {/* ── desktop row ── */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
            {/* left: logo */}
            <Logo scrollY={scrollY} />

            {/* center: search widget */}
            <div className="flex flex-1 justify-center mx-4 max-w-2xl">
              {!isCompact ? (
                // Expanded search bar inline (home page, top)
                <div className="w-full">
                  <SearchBar
                    onSearch={() => {}}
                    defaultLocation={searchParams.get("q") ?? ""}
                    defaultCheckIn={rawCheckIn ? parseISO(rawCheckIn) : null}
                    defaultCheckOut={rawCheckOut ? parseISO(rawCheckOut) : null}
                    defaultGuests={{
                      adult: parseInt(searchParams.get("adults") ?? "1"),
                      child: parseInt(searchParams.get("children") ?? "0"),
                      baby: parseInt(searchParams.get("babies") ?? "0"),
                    }}
                  />
                </div>
              ) : (
                // Compact pill

                <CompactPill
                  onClick={() => setSearchOpen((v) => !v)}
                  location={summaryLocation}
                  dateLabel={summaryDates}
                  guestLabel={summaryGuests}
                />
              )}
            </div>

            {/* right: profile / login */}
            <div className="flex items-center justify-end gap-2">
              {token ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu((v) => !v)}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 p-1 pr-3 transition hover:shadow-md"
                  >
                    {user?.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white">
                        {initials}
                      </div>
                    )}
                    <span className="max-w-24 truncate text-sm font-medium text-zinc-800">
                      {firstName ?? "..."}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-custom-lg">
                      <div className="border-b border-zinc-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-zinc-900">
                          {user?.name ?? "..."}
                        </p>
                        <p className="truncate text-xs text-zinc-400">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50"
                      >
                        <UserCircle size={15} className="text-zinc-400" />
                        Profil saya
                      </Link>
                      <Link
                        href="/booking"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50"
                      >
                        <Navigation size={15} className="text-zinc-400" />
                        Perjalanan
                      </Link>
                      <div className="border-t border-zinc-100" />
                      <button
                        onClick={handleLogout}
                        disabled={logout.isPending}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        <LogOut size={15} />
                        {logout.isPending ? "Keluar..." : "Keluar"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:shadow-md transition"
                >
                  Masuk / Daftar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── category tabs row (home page only) ── */}
        {showCategoryTabs && (
          <div className="border-t border-zinc-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-12 flex justify-center gap-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => router.push(cat.href)}
                  className="relative flex flex-col items-center gap-1 py-3 transition hover:opacity-80 group"
                >
                  {cat.isNew && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Soon
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium transition",
                      activeCategory === cat.key
                        ? "text-zinc-900"
                        : "text-zinc-500 group-hover:text-zinc-700",
                    )}
                  >
                    {cat.label}
                  </span>
                  {activeCategory === cat.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-zinc-900" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── expanded search dropdown (compact mode, pill clicked) ── */}
        {searchOpen && isCompact && (
          <div className="hidden md:block border-t border-zinc-100 bg-white px-6 py-5 lg:px-12 relative z-[110]">
            <div className="mx-auto max-w-3xl">
              <SearchBar
                onSearch={() => setSearchOpen(false)}
                defaultLocation={searchParams.get("q") ?? ""}
                defaultCheckIn={rawCheckIn ? parseISO(rawCheckIn) : null}
                defaultCheckOut={rawCheckOut ? parseISO(rawCheckOut) : null}
                defaultGuests={{
                  adult: parseInt(searchParams.get("adults") ?? "1"),
                  child: parseInt(searchParams.get("children") ?? "0"),
                  baby: parseInt(searchParams.get("babies") ?? "0"),
                }}
              />
            </div>
          </div>
        )}
      </nav>

      {/* ── auth modal overlay ── */}
      {authOpen && (
        <div className="fixed inset-0 z-300 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAuthOpen(false)}
          />
          <div className="relative z-10 w-full md:w-auto">
            <Login
              onClose={() => setAuthOpen(false)}
              onSuccess={() => {
                setAuthOpen(false);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
