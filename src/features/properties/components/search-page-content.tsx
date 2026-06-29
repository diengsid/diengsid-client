"use client";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import { getAttractions } from "@/features/attractions/services/attraction-service";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Calendar,
  ChevronDown,
  Map,
  MapPin,
  Minus,
  Plus,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGetProperties } from "../hooks/useGetProperties";
import { SearchPropertyRequest } from "../schemas/schema-property";
import SearchPropertyCard from "./search-card";

const SearchMap = dynamic(() => import("./search-map"), { ssr: false });

// ─── skeleton ─────────────────────────────────────────────────────────────────

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

// ─── constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPES: { label: string; value: string }[] = [
  { label: "Homestay", value: "homestay" },
  { label: "Villa", value: "villa" },
  { label: "Hotel", value: "hotel" },
  { label: "Guesthouse", value: "guesthouse" },
  { label: "Cabin", value: "cabin" },
  { label: "Apartemen", value: "apartment" },
];

// ─── props ────────────────────────────────────────────────────────────────────

interface Props {
  search: SearchPropertyRequest;
  location?: string;
  checkIn?: string;
  checkOut?: string;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function SearchPageContent({
  search,
  location,
  checkIn,
  checkOut,
}: Props) {
  const { data, isFetching } = useGetProperties(search);
  const properties = Array.isArray(data?.data) ? data.data : [];
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const activeType = searchParams.get("property_type") ?? "";
  const activeAttractionId = searchParams.get("attraction_id") ?? "";
  const paramCheckIn = searchParams.get("check_in") ?? "";
  const paramCheckOut = searchParams.get("check_out") ?? "";
  const paramAdults = parseInt(searchParams.get("adults") ?? "1") || 1;
  const paramChildren = parseInt(searchParams.get("children") ?? "0") || 0;
  const totalGuests = paramAdults + paramChildren;

  // ── dropdown state ───────────────────────────────────────────────────────────

  type Panel = "date" | "guests" | "nearby" | null;
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // local draft state for dropdowns
  const [draftDate, setDraftDate] = useState<DateRange>({
    start: paramCheckIn ? parseISO(paramCheckIn) : null,
    end: paramCheckOut ? parseISO(paramCheckOut) : null,
  });
  const [draftAdults, setDraftAdults] = useState(paramAdults);
  const [draftChildren, setDraftChildren] = useState(paramChildren);

  // reset drafts when panel opens
  const togglePanel = (panel: Panel) => {
    if (openPanel === panel) {
      setOpenPanel(null);
      return;
    }
    setDraftDate({
      start: paramCheckIn ? parseISO(paramCheckIn) : null,
      end: paramCheckOut ? parseISO(paramCheckOut) : null,
    });
    setDraftAdults(paramAdults);
    setDraftChildren(paramChildren);
    setOpenPanel(panel);
  };

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── URL update helpers ───────────────────────────────────────────────────────

  const pushParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    router.push(`?${params.toString()}`);
  };

  const applyPropertyType = (value: string) => {
    pushParams({ property_type: activeType === value ? null : value });
  };

  const applyDate = () => {
    pushParams({
      check_in: draftDate.start ? format(draftDate.start, "yyyy-MM-dd") : null,
      check_out: draftDate.end ? format(draftDate.end, "yyyy-MM-dd") : null,
    });
    setOpenPanel(null);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushParams({ check_in: null, check_out: null });
  };

  const applyGuests = () => {
    pushParams({
      adults: String(draftAdults),
      children: draftChildren > 0 ? String(draftChildren) : null,
    });
    setOpenPanel(null);
  };

  const clearGuests = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushParams({ adults: null, children: null });
  };

  const applyAttraction = (attractionId: string, name: string) => {
    pushParams({
      attraction_id: activeAttractionId === attractionId ? null : attractionId,
      q: activeAttractionId === attractionId ? null : name,
    });
    setOpenPanel(null);
  };

  const clearAttraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushParams({ attraction_id: null, q: null });
  };

  // ── attractions for "nearby" dropdown ────────────────────────────────────────

  const { data: attractionsData } = useQuery({
    queryKey: ["attractions"],
    queryFn: getAttractions,
    staleTime: 10 * 60 * 1000,
  });
  const allAttractions = attractionsData?.data ?? [];
  const activeAttractionName =
    allAttractions.find((a) => a.id === activeAttractionId)?.name ?? null;

  // ── label helpers ─────────────────────────────────────────────────────────────

  const dateLabel = (() => {
    if (!paramCheckIn) return null;
    const start = parseISO(paramCheckIn);
    const end = paramCheckOut ? parseISO(paramCheckOut) : null;
    return end
      ? `${format(start, "d MMM", { locale: idLocale })} – ${format(end, "d MMM", { locale: idLocale })}`
      : format(start, "d MMM", { locale: idLocale });
  })();

  const guestLabel = totalGuests > 1 ? `${totalGuests} tamu` : null;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col">
      {/* ── filter bar ── */}
      <div
        ref={panelRef}
        className="border-b border-zinc-100 bg-white sticky top-0 z-30"
      >
        {/* scrollable button row — dropdowns are NOT rendered here to avoid overflow clipping */}
        <div className="px-4 md:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">

          {/* tanggal trigger */}
          <button
            onClick={() => togglePanel("date")}
            className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs md:text-sm font-medium transition ${
              dateLabel
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
            }`}
          >
            <Calendar size={13} />
            <span>{dateLabel ?? "Tanggal"}</span>
            {dateLabel ? (
              <X size={12} onClick={clearDate} className="ml-0.5" />
            ) : (
              <ChevronDown size={12} />
            )}
          </button>

          {/* tamu trigger */}
          <button
            onClick={() => togglePanel("guests")}
            className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs md:text-sm font-medium transition ${
              guestLabel
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
            }`}
          >
            <span>{guestLabel ?? "Tamu"}</span>
            {guestLabel ? (
              <X size={12} onClick={clearGuests} className="ml-0.5" />
            ) : (
              <ChevronDown size={12} />
            )}
          </button>

          {/* dekat wisata trigger */}
          <button
            onClick={() => togglePanel("nearby")}
            className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs md:text-sm font-medium transition ${
              activeAttractionName
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
            }`}
          >
            <MapPin size={13} />
            <span className="max-w-28 truncate">
              {activeAttractionName ?? "Dekat wisata"}
            </span>
            {activeAttractionName ? (
              <X size={12} onClick={clearAttraction} className="ml-0.5 shrink-0" />
            ) : (
              <ChevronDown size={12} className="shrink-0" />
            )}
          </button>

          {/* divider */}
          <div className="shrink-0 h-6 w-px bg-zinc-200 mx-1" />

          {/* tipe properti */}
          {PROPERTY_TYPES.map((f) => {
            const isActive = activeType === f.value;
            return (
              <button
                key={f.value}
                onClick={() => applyPropertyType(f.value)}
                className={`shrink-0 rounded-full border px-3 py-2 text-xs md:text-sm transition whitespace-nowrap font-medium ${
                  isActive
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ── dropdowns — outside overflow-x-auto so they're not clipped ── */}

        {openPanel === "date" && (
          <div className="absolute left-4 top-full z-50 mt-1 rounded-2xl bg-white shadow-xl border border-zinc-100 overflow-hidden min-w-sm">
            <DateRangePicker
              value={draftDate}
              onChange={(r) => setDraftDate(r)}
              singleMonth
            />
            <div className="flex justify-end gap-2 px-4 pb-4">
              <button
                onClick={() => {
                  setDraftDate({ start: null, end: null });
                  pushParams({ check_in: null, check_out: null });
                  setOpenPanel(null);
                }}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition"
              >
                Hapus
              </button>
              <button
                onClick={applyDate}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition"
              >
                Terapkan
              </button>
            </div>
          </div>
        )}

        {openPanel === "guests" && (
          <div className="absolute left-4 top-full z-50 mt-1 min-w-sm rounded-2xl bg-white p-4 shadow-xl border border-zinc-100">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Jumlah Tamu
            </p>
            <div className="space-y-4">
              {(
                [
                  { label: "Dewasa", sub: "Usia 13+", key: "adults" as const, val: draftAdults, set: setDraftAdults, min: 1 },
                  { label: "Anak", sub: "Usia 2–12", key: "children" as const, val: draftChildren, set: setDraftChildren, min: 0 },
                ] as const
              ).map((row) => (
                <div key={row.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{row.label}</p>
                    <p className="text-xs text-zinc-400">{row.sub}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => row.set((v) => Math.max(row.min, v - 1))}
                      disabled={row.val <= row.min}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-500 disabled:opacity-30 transition"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{row.val}</span>
                    <button
                      onClick={() => row.set((v) => v + 1)}
                      disabled={draftAdults + draftChildren >= 10}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-500 disabled:opacity-30 transition"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={applyGuests}
              className="mt-4 w-full rounded-xl bg-zinc-900 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition"
            >
              Terapkan
            </button>
          </div>
        )}

        {openPanel === "nearby" && (
          <div className="absolute left-4 top-full z-50 mt-1 min-w-sm rounded-2xl bg-white p-3 shadow-xl border border-zinc-100">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 px-1">
              Dekat Wisata
            </p>
            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {allAttractions.length === 0 ? (
                <p className="py-4 text-center text-xs text-zinc-400">Memuat...</p>
              ) : (
                allAttractions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => applyAttraction(a.id, a.name)}
                    className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition ${
                      activeAttractionId === a.id
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <MapPin size={13} className="shrink-0 opacity-60" />
                    <span className="flex-1 line-clamp-1">{a.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── main area ── */}
      <div className="flex items-start">
        <div
          className={`w-full md:flex-1 min-h-screen px-4 md:px-6 py-4 pb-24 md:pb-6 ${
            showMobileMap ? "hidden md:block" : "block"
          }`}
        >
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
                <p className="text-sm mt-1">Coba ubah filter atau kata kunci.</p>
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

        {showMobileMap && (
          <div
            className="block md:hidden w-full"
            style={{ height: "calc(100dvh - 112px)" }}
          >
            <SearchMap properties={properties} hoveredId={hoveredId} />
          </div>
        )}

        <div className="hidden md:block w-[45%] shrink-0 sticky top-0 h-screen">
          <SearchMap properties={properties} hoveredId={hoveredId} />
        </div>
      </div>

      {/* ── mobile map toggle ── */}
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
