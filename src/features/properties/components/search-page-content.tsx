"use client";

import { Map, SlidersHorizontal, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useGetProperties } from "../hooks/useGetProperties";
import { SearchPropertyRequest } from "../schemas/schema-property";
import SearchPropertyCard from "./search-card";

const SearchMap = dynamic(() => import("./search-map"), { ssr: false });

function SearchCardSkeleton() {
  return (
    <div className="flex gap-3 p-2 animate-pulse">
      <div className="w-36 h-28 md:w-44 md:h-36 shrink-0 rounded-xl bg-zinc-200" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-16 rounded bg-zinc-200" />
        <div className="h-4 w-2/3 rounded bg-zinc-200" />
        <div className="h-3 w-full rounded bg-zinc-200" />
        <div className="h-3 w-4/5 rounded bg-zinc-200" />
        <div className="h-4 w-1/3 rounded bg-zinc-200 mt-4" />
      </div>
    </div>
  );
}

const AMENITY_FILTERS = [
  "Wifi",
  "Dapur",
  "AC",
  "TV",
  "Parkir gratis",
  "Mesin cuci",
  "1+ kamar mandi",
  "1+ tempat tidur",
  "Diizinkan membawa hewan peliharaan",
  "Pemanas",
];

interface Props {
  search: SearchPropertyRequest;
  location?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function SearchPageContent({
  search,
  location,
  checkIn,
  checkOut,
}: Props) {
  const { data, isFetching } = useGetProperties(search);
  const properties = data?.data ?? [];
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  return (
    <div className="flex flex-col">
      {/* ── filter bar ── */}
      <div className="border-b border-zinc-100 bg-white px-4 md:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar sticky top-0 z-30">
        <button className="flex items-center gap-1.5 shrink-0 rounded-full border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400 transition">
          <SlidersHorizontal size={13} />
          <span className="hidden sm:inline">Filter</span>
        </button>
        {AMENITY_FILTERS.map((f) => (
          <button
            key={f}
            className="shrink-0 rounded-full border border-zinc-200 px-3 py-2 text-xs md:text-sm text-zinc-600 hover:border-zinc-400 transition whitespace-nowrap"
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── main area ── */}
      <div className="flex items-start">
        {/* left: list — hidden on mobile when map is shown */}
        <div
          className={`w-full md:flex-1 min-h-screen px-4 md:px-6 py-4 pb-24 md:pb-6 ${showMobileMap ? "hidden md:block" : "block"}`}
        >
          {/* result count */}
          <p className="text-sm font-semibold text-zinc-800 mb-1">
            {isFetching
              ? "Memuat properti..."
              : `${properties.length > 0 ? `Lebih dari ${properties.length}` : "Tidak ada"} properti${location ? ` di ${location}` : ""}`}
          </p>
          {!isFetching && properties.length > 0 && (
            <p className="text-xs text-zinc-400 mb-4 flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400" />
              Harga sudah mencakup semua biaya
            </p>
          )}

          <div className="divide-y divide-zinc-100">
            {isFetching ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SearchCardSkeleton key={i} />
              ))
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                <p className="text-base">Tidak ada properti yang ditemukan.</p>
                <p className="text-sm mt-1">
                  Coba ubah filter atau kata kunci.
                </p>
              </div>
            ) : (
              properties.map((p) => (
                <div key={p.id} className="py-2.5">
                  <SearchPropertyCard
                    property={p}
                    isHovered={hoveredId === p.id}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* mobile map overlay */}
        {showMobileMap && (
          <div
            className="block md:hidden w-full"
            style={{ height: "calc(100dvh - 112px)" }}
          >
            <SearchMap properties={properties} hoveredId={hoveredId} />
          </div>
        )}

        {/* right: sticky map (desktop) */}
        <div className="hidden md:block w-[45%] shrink-0 sticky top-0 h-screen">
          <SearchMap properties={properties} hoveredId={hoveredId} />
        </div>
      </div>

      {/* ── mobile fixed map toggle button ── */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          onClick={() => setShowMobileMap((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-lg active:scale-95 transition-transform"
        >
          {showMobileMap ? (
            <>
              <X size={15} />
              Tampilkan daftar
            </>
          ) : (
            <>
              <Map size={15} />
              Tampilkan peta
            </>
          )}
        </button>
      </div>
    </div>
  );
}
