"use client";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import SearchBar from "@/components/shared/search-bar/SearchBar";
import { Logo } from "@/components/ui/logo/logo";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";
import { useScroll } from "@/hooks/use-scroll";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface Props {
  isFixed?: boolean;
  token?: string;
}

type MobileSection = "location" | "date" | "guests" | null;
type Category = "penginapan" | "pengalaman" | "layanan";
type Guests = { adult: number; child: number; baby: number };

const CATEGORIES: {
  key: Category;
  emoji: string;
  label: string;
  isNew?: boolean;
}[] = [
  { key: "penginapan", emoji: "🏠", label: "Penginapan" },
  { key: "pengalaman", emoji: "🎈", label: "Pengalaman", isNew: true },
  { key: "layanan", emoji: "🛎️", label: "Layanan", isNew: true },
];

const GUEST_ROWS = [
  { key: "adult" as const, label: "Dewasa", sub: "Usia 13+", min: 1 },
  { key: "child" as const, label: "Anak", sub: "Usia 2-12", min: 0 },
  { key: "baby" as const, label: "Bayi", sub: "Di bawah 2 tahun", min: 0 },
];

export default function Navbar({
  isFixed = true,
  token,
}: Props): React.ReactNode {
  const { scrollY } = useScroll();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("penginapan");

  // mobile overlay state
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
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

  // ── mobile search helpers ──────────────────────────────────────────────────

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
    setSearchOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* desktop backdrop */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/20 hidden md:block"
          onClick={() => setSearchOpen(false)}
        />
      )}

      {/* ── mobile full-screen search overlay ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-200 flex flex-col bg-white md:hidden">
          {/* top: category tabs + close */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <div className="flex gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    activeCategory === cat.key
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100"
            >
              <X size={16} />
            </button>
          </div>

          {/* body: accordion sections */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {/* Lokasi */}
            <div
              className={`rounded-2xl border transition ${
                mobileSection === "location"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200"
              }`}
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
                  className={`shrink-0 text-zinc-400 transition-transform ${
                    mobileSection === "location" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileSection === "location" && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900/20">
                    <Search size={15} className="shrink-0 text-zinc-400" />
                    <input
                      autoFocus
                      value={mobileLocation}
                      onChange={(e) => setMobileLocation(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setMobileSection("date");
                      }}
                      placeholder="Kota, tempat, atau destinasi..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tanggal */}
            <div
              className={`rounded-2xl border transition ${
                mobileSection === "date"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setMobileSection(mobileSection === "date" ? null : "date")
                }
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">
                    Tanggal perjalanan
                  </p>
                  <p className="text-sm text-zinc-400">
                    {mobileDateLabel ?? "Tambahkan tanggal"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-zinc-400 transition-transform ${
                    mobileSection === "date" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileSection === "date" && (
                <div className="px-2 pb-4">
                  <DateRangePicker
                    value={mobileDateRange}
                    onChange={(r: DateRange) => {
                      setMobileDateRange(r);
                      if (r.start && r.end) setMobileSection("guests");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Layanan / Peserta */}
            <div
              className={`rounded-2xl border transition ${
                mobileSection === "guests"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setMobileSection(mobileSection === "guests" ? null : "guests")
                }
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">Layanan</p>
                  <p className="text-sm text-zinc-400">
                    {mobileGuestLabel ?? "Tambahkan layanan"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-zinc-400 transition-transform ${
                    mobileSection === "guests" ? "rotate-180" : ""
                  }`}
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
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
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
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
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

          {/* bottom sticky bar */}
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
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <Search size={16} />
              Cari
            </button>
          </div>
        </div>
      )}

      <nav
        className={`w-full bg-white transition-shadow ${
          isFixed ? "fixed top-0" : "relative"
        } z-100 ${searchOpen || scrollY > 60 ? "shadow-custom" : "shadow-none"}`}
      >
        {/* ── main row ── */}
        <div className="mx-auto max-w-7xl px-6 py-3 lg:px-12">
          {/* mobile: logo + search icon */}
          <div className="flex items-center justify-between md:hidden">
            <Logo scrollY={scrollY} />
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-custom-sm transition hover:shadow-md active:scale-[0.98]"
            >
              <Search size={14} className="text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-700">Cari</span>
            </button>
          </div>

          {/* desktop: 3-col grid */}
          <div className="hidden md:grid md:grid-cols-3 md:items-center md:gap-4">
            {/* left: logo */}
            <Logo scrollY={scrollY} />

            {/* center: category tabs */}
            <div className="flex items-end justify-center gap-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setSearchOpen(true);
                  }}
                  className="relative flex flex-col items-center gap-1 pb-3 transition hover:opacity-80"
                >
                  {cat.isNew && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Baru
                    </span>
                  )}
                  <span className="text-3xl leading-none">{cat.emoji}</span>
                  <span
                    className={`text-xs font-semibold ${
                      activeCategory === cat.key
                        ? "text-zinc-900"
                        : "text-zinc-500"
                    }`}
                  >
                    {cat.label}
                  </span>
                  {activeCategory === cat.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-zinc-900" />
                  )}
                </button>
              ))}
            </div>

            {/* right: profile or login */}
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
                        className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-50"
                      >
                        <UserCircle size={15} className="text-zinc-400" />
                        Profil saya
                      </Link>
                      <Link
                        href="/journeys"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-50"
                      >
                        <Navigation size={15} className="text-zinc-400" />
                        Perjalanan
                      </Link>

                      <div className="border-t border-zinc-100" />

                      <button
                        onClick={handleLogout}
                        disabled={logout.isPending}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <LogOut size={15} />
                        {logout.isPending ? "Keluar..." : "Keluar"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:shadow-md"
                >
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
          {/* end desktop grid */}
        </div>
        {/* end outer wrapper */}

        {/* ── expanded search panel (desktop only) ── */}
        {searchOpen && (
          <div className="hidden border-t border-zinc-100 bg-white px-6 py-5 md:block lg:px-12">
            <div className="mx-auto max-w-3xl">
              <SearchBar onSearch={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
