"use client";

import { useGetAttractions } from "@/features/attractions/hooks/useGetAttractions";
import { Attraction } from "@/features/attractions/schemas/schema-attraction";
import { cn } from "@/lib/utils";
import { MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES = ["alam", "budaya", "kuliner", "religi", "petualangan", "hiburan"];

const CATEGORY_LABEL: Record<string, string> = {
  alam: "Alam",
  budaya: "Budaya",
  kuliner: "Kuliner",
  religi: "Religi",
  petualangan: "Petualangan",
  hiburan: "Hiburan",
};

const CATEGORY_COLOR: Record<string, string> = {
  alam: "bg-emerald-100 text-emerald-700",
  budaya: "bg-amber-100 text-amber-700",
  kuliner: "bg-orange-100 text-orange-700",
  religi: "bg-purple-100 text-purple-700",
  petualangan: "bg-blue-100 text-blue-700",
  hiburan: "bg-pink-100 text-pink-700",
};

function AttractionCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="h-44 w-full animate-pulse bg-zinc-100" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-3 w-full animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-3 w-5/6 animate-pulse rounded-lg bg-zinc-100" />
      </div>
    </div>
  );
}

function AttractionCard({ a }: { a: Attraction }) {
  const colorCls = CATEGORY_COLOR[a.category ?? ""] ?? "bg-zinc-100 text-zinc-600";

  return (
    <Link
      href={`/wisata/${a.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
        {a.image_url ? (
          <Image
            fill
            src={a.image_url}
            alt={a.name}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin size={32} className="text-zinc-300" />
          </div>
        )}
        {a.category && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium",
              colorCls,
            )}
          >
            {CATEGORY_LABEL[a.category] ?? a.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-semibold text-zinc-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
          {a.name}
        </h3>
        {a.address && (
          <p className="flex items-start gap-1 text-xs text-zinc-400">
            <MapPin size={11} className="mt-0.5 shrink-0" />
            <span className="line-clamp-1">{a.address}</span>
          </p>
        )}
        {a.description && (
          <p
            className="mt-1 text-sm text-zinc-500 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: a.description }}
          />
        )}
      </div>
    </Link>
  );
}

export function AttractionGrid() {
  const { data, isFetching } = useGetAttractions();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const attractions = data?.data ?? [];

  const filtered = attractions.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.address ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari wisata..."
          className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none focus:border-primary-700"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            activeCategory === "all"
              ? "bg-zinc-900 text-white"
              : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
          )}
        >
          Semua
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              activeCategory === c
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
            )}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isFetching ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AttractionCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-20 text-center text-zinc-400">
          Tidak ada wisata ditemukan
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AttractionCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
