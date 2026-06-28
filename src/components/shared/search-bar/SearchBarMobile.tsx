"use client";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import { getAttractions } from "@/features/attractions/services/attraction-service";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronDown, MapPin, Minus, Plus, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Section = "location" | "date" | "guests" | null;
type Guests = { adult: number; child: number; baby: number };

const GUEST_ROWS = [
  { key: "adult" as const, label: "Dewasa", sub: "Usia 13+", min: 1 },
  { key: "child" as const, label: "Anak", sub: "Usia 2-12", min: 0 },
  { key: "baby" as const, label: "Bayi", sub: "Di bawah 2 tahun", min: 0 },
];

export default function SearchBarMobile() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("location");
  const [location, setLocation] = useState("");
  const [attractionId, setAttractionId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [guests, setGuests] = useState<Guests>({ adult: 1, child: 0, baby: 0 });

  const { data: attractionsData } = useQuery({
    queryKey: ["attractions"],
    queryFn: getAttractions,
    staleTime: 10 * 60 * 1000,
  });
  const attractions = attractionsData?.data ?? [];
  const filtered = location.trim()
    ? attractions.filter((a) =>
        a.name.toLowerCase().includes(location.toLowerCase()),
      )
    : attractions;

  const updateGuest = (key: keyof Guests, delta: 1 | -1) => {
    setGuests((prev) => {
      const next = prev[key] + delta;
      const row = GUEST_ROWS.find((r) => r.key === key)!;
      if (next < row.min) return prev;
      if (key !== "baby" && delta === 1 && prev.adult + prev.child >= 10)
        return prev;
      return { ...prev, [key]: next };
    });
  };

  const dateLabel = dateRange.start
    ? `${format(dateRange.start, "d MMM", { locale: id })}${
        dateRange.end
          ? ` – ${format(dateRange.end, "d MMM", { locale: id })}`
          : ""
      }`
    : null;

  const totalGuests = guests.adult + guests.child;
  const guestLabel =
    totalGuests > 1 || guests.baby > 0
      ? `${totalGuests} tamu${guests.baby > 0 ? `, ${guests.baby} bayi` : ""}`
      : null;

  const summaryLocation = searchParams.get("q") || "Ke mana saja";
  const rawCheckIn = searchParams.get("check_in");
  const rawCheckOut = searchParams.get("check_out");
  const summaryDates =
    rawCheckIn && rawCheckOut
      ? `${format(new Date(rawCheckIn), "d MMM", { locale: id })} – ${format(new Date(rawCheckOut), "d MMM", { locale: id })}`
      : "Waktu apa saja";

  const clearAll = () => {
    setLocation("");
    setAttractionId(null);
    setDateRange({ start: null, end: null });
    setGuests({ adult: 1, child: 0, baby: 0 });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (attractionId) {
      params.set("attraction_id", attractionId);
    } else if (location.trim()) {
      params.set("q", location.trim());
    }
    if (dateRange.start)
      params.set("check_in", format(dateRange.start, "yyyy-MM-dd"));
    if (dateRange.end)
      params.set("check_out", format(dateRange.end, "yyyy-MM-dd"));
    params.set("adults", String(guests.adult));
    if (guests.child > 0) params.set("children", String(guests.child));
    if (guests.baby > 0) params.set("babies", String(guests.baby));
    setOpen(false);
    router.push(`/search/homes?${params.toString()}`);
  };

  const toggle = (s: Section) => setSection((prev) => (prev === s ? null : s));

  return (
    <>
      {/* ── compact pill trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm active:scale-[0.98] transition-transform"
      >
        <Search size={16} className="shrink-0 text-zinc-400" />
        <div className="flex flex-1 flex-col items-start text-left">
          <span className="text-sm font-medium text-zinc-800">
            {summaryLocation}
          </span>
          <span className="text-xs text-zinc-400">{summaryDates}</span>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Search size={13} />
        </div>
      </button>

      {/* ── full-screen overlay ── */}
      {open && (
        <div className="fixed inset-0 z-10000 flex flex-col bg-white">
          {/* header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <p className="text-sm font-semibold text-zinc-900">
              Cari Penginapan
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-100"
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
                section === "location"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200",
              )}
            >
              <button
                type="button"
                onClick={() => toggle("location")}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">Lokasi</p>
                  {section !== "location" && (
                    <p className="text-sm text-zinc-400">
                      {location || "Cari destinasi"}
                    </p>
                  )}
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform",
                    section === "location" && "rotate-180",
                  )}
                />
              </button>
              {section === "location" && (
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 focus-within:border-zinc-900">
                    <Search size={15} className="shrink-0 text-zinc-400" />
                    <input
                      autoFocus
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setAttractionId(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && toggle("date")}
                      placeholder="Kota, tempat, atau destinasi..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
                    />
                    {location && (
                      <button type="button" onClick={() => setLocation("")}>
                        <X size={14} className="text-zinc-400" />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 max-h-52 overflow-y-auto space-y-0.5">
                    {filtered.map((attraction) => (
                      <button
                        key={attraction.id}
                        type="button"
                        onClick={() => {
                          setLocation(attraction.name);
                          setAttractionId(attraction.id);
                          setSection("date");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
                      >
                        <MapPin size={14} className="shrink-0 text-zinc-400" />
                        <span className="line-clamp-1">{attraction.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tanggal */}
            <div
              className={cn(
                "rounded-2xl border transition",
                section === "date"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200",
              )}
            >
              <button
                type="button"
                onClick={() => toggle("date")}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">Tanggal</p>
                  <p className="text-sm text-zinc-400">
                    {dateLabel ?? "Tambahkan tanggal"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform",
                    section === "date" && "rotate-180",
                  )}
                />
              </button>
              {section === "date" && (
                <div className="px-2 pb-4">
                  <DateRangePicker
                    value={dateRange}
                    onChange={(r) => {
                      setDateRange(r);
                      if (r.start && r.end) setSection("guests");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Tamu */}
            <div
              className={cn(
                "rounded-2xl border transition",
                section === "guests"
                  ? "border-zinc-900 shadow-md"
                  : "border-zinc-200",
              )}
            >
              <button
                type="button"
                onClick={() => toggle("guests")}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-zinc-900">Tamu</p>
                  <p className="text-sm text-zinc-400">
                    {guestLabel ?? "Tambahkan tamu"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform",
                    section === "guests" && "rotate-180",
                  )}
                />
              </button>
              {section === "guests" && (
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
                          onClick={() => updateGuest(row.key, -1)}
                          disabled={guests[row.key] <= row.min}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm font-medium">
                          {guests[row.key]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateGuest(row.key, 1)}
                          disabled={
                            row.key !== "baby" &&
                            guests.adult + guests.child >= 10
                          }
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed"
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
              onClick={clearAll}
              className="cursor-pointer text-sm font-medium text-zinc-700 underline underline-offset-2"
            >
              Hapus semua
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Search size={16} />
              Cari
            </button>
          </div>
        </div>
      )}
    </>
  );
}
