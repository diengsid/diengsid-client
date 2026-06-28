"use client";

import { useGetAttractions } from "@/features/attractions/hooks/useGetAttractions";
import { Attraction } from "@/features/attractions/schemas/schema-attraction";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Church,
  Compass,
  Landmark,
  Mountain,
  Music,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const CATEGORIES = [
  { key: "alam", label: "Alam", icon: Mountain },
  { key: "budaya", label: "Budaya", icon: Landmark },
  { key: "kuliner", label: "Kuliner", icon: UtensilsCrossed },
  { key: "religi", label: "Religi", icon: Church },
  { key: "petualangan", label: "Petualangan", icon: Compass },
  { key: "hiburan", label: "Hiburan", icon: Music },
] as const;

// ── skeleton card ────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="flex w-44 shrink-0 flex-col gap-2">
      <div className="h-44 w-44 animate-pulse rounded-2xl bg-zinc-200" />
      <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-zinc-200" />
    </div>
  );
}

// ── attraction card ──────────────────────────────────────────────────────────

function AttractionCard({ a }: { a: Attraction }) {
  return (
    <Link
      href={`/search/homes?attraction_id=${a.id}`}
      className="group flex w-44 shrink-0 flex-col gap-2"
    >
      <div className="relative h-44 w-44 overflow-hidden rounded-2xl bg-zinc-200">
        {a.image_url ? (
          <Image
            fill
            src={a.image_url}
            alt={a.name}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : null}
      </div>
      <p className="line-clamp-2 text-center text-sm text-zinc-800">
        Penginapan dekat {a.name}
      </p>
    </Link>
  );
}

// ── main component ───────────────────────────────────────────────────────────

export default function AttractionRecomendation() {
  const { data, isFetching } = useGetAttractions();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const attractions = data?.data ?? [];
  const filtered =
    activeCategory === "all"
      ? attractions
      : attractions.filter((a) => a.category === activeCategory);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  return (
    <section className="px-4 py-6 md:px-12 lg:px-20">
      {/* header row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-zinc-900">Wisata Populer</h2>
          <Link
            href="/wisata"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition"
          >
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* nav arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* category filter */}
      <div className="mb-5 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition",
            activeCategory === "all"
              ? "border border-zinc-800 font-medium text-zinc-900"
              : "text-zinc-500 hover:text-zinc-800",
          )}
        >
          Semua
        </button>
        {CATEGORIES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveCategory(key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition",
              activeCategory === key
                ? "border border-zinc-800 font-medium text-zinc-900"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {isFetching ? (
          Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <p className="py-8 text-sm text-zinc-400">
            Tidak ada wisata ditemukan.
          </p>
        ) : (
          filtered.map((a) => <AttractionCard key={a.id} a={a} />)
        )}
      </div>
    </section>
  );
}
