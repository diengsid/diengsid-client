"use client";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MapPin, Minus, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── guest types ──────────────────────────────────────────────────────────────

export type Guests = { adult: number; child: number; baby: number };

const GUEST_ROWS = [
  { key: "adult" as const, label: "Dewasa", sub: "Usia 13+", min: 1 },
  { key: "child" as const, label: "Anak", sub: "Usia 2–12", min: 0 },
  { key: "baby" as const, label: "Bayi", sub: "Di bawah 2 tahun", min: 0 },
];

// ─── quick location suggestions ───────────────────────────────────────────────

const SUGGESTIONS = ["Dieng", "Wonosobo", "Sikunir", "Telaga Warna", "Batur"];

// ─── props ────────────────────────────────────────────────────────────────────

type Props = {
  defaultLocation?: string;
  defaultCheckIn?: Date | null;
  defaultCheckOut?: Date | null;
  defaultGuests?: Guests;
  compact?: boolean;
  onSearch?: () => void;
};

// ─── component ────────────────────────────────────────────────────────────────

export default function SearchBar({
  defaultLocation = "",
  defaultCheckIn = null,
  defaultCheckOut = null,
  defaultGuests,
  compact = false,
  onSearch,
}: Props) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<"location" | "date" | "guests" | null>(null);
  const [location, setLocation] = useState(defaultLocation);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: defaultCheckIn,
    end: defaultCheckOut,
  });
  const [guests, setGuests] = useState<Guests>(
    defaultGuests ?? { adult: 1, child: 0, baby: 0 },
  );

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── guest counter ─────────────────────────────────────────────────────────

  const updateGuest = (key: keyof Guests, delta: 1 | -1) => {
    setGuests((prev) => {
      const next = prev[key] + delta;
      const row = GUEST_ROWS.find((r) => r.key === key)!;
      if (next < row.min) return prev;
      if (key !== "baby" && delta === 1 && prev.adult + prev.child >= 10) return prev;
      return { ...prev, [key]: next };
    });
  };

  // ── labels ────────────────────────────────────────────────────────────────

  const dateLabel =
    dateRange.start
      ? `${format(dateRange.start, "d MMM", { locale: id })}${
          dateRange.end ? ` – ${format(dateRange.end, "d MMM", { locale: id })}` : ""
        }`
      : null;

  const totalGuests = guests.adult + guests.child;
  const guestLabel =
    totalGuests > 1 || guests.baby > 0
      ? `${totalGuests} tamu${guests.baby > 0 ? `, ${guests.baby} bayi` : ""}`
      : null;

  // ── search ────────────────────────────────────────────────────────────────

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    if (dateRange.start) params.set("check_in", format(dateRange.start, "yyyy-MM-dd"));
    if (dateRange.end) params.set("check_out", format(dateRange.end, "yyyy-MM-dd"));
    params.set("adults", String(guests.adult));
    if (guests.child > 0) params.set("children", String(guests.child));
    if (guests.baby > 0) params.set("babies", String(guests.baby));
    setActive(null);
    onSearch?.();
    router.push(`/search?${params.toString()}`);
  };

  // ── section button helper ──────────────────────────────────────────────────

  const section = (
    key: "location" | "date" | "guests",
    label: string,
    value: string | null,
    placeholder: string,
  ) => (
    <button
      type="button"
      onClick={() => setActive(active === key ? null : key)}
      className={cn(
        "flex flex-1 flex-col items-start rounded-full px-5 text-left transition hover:bg-zinc-100",
        compact ? "py-2" : "py-3",
        active === key && "bg-zinc-100",
      )}
    >
      <span className="text-xs font-semibold text-zinc-900">{label}</span>
      <span className={cn("truncate text-sm", value ? "text-zinc-800" : "text-zinc-400")}>
        {value ?? placeholder}
      </span>
    </button>
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div ref={ref} className="relative w-full">
      {/* ── pill ── */}
      <div className="flex items-center rounded-full bg-white p-2 shadow-custom">
        {section("location", "Lokasi", location || null, "Cari destinasi")}
        <div className="h-8 w-px shrink-0 bg-zinc-200" />
        {section("date", "Kapan", dateLabel, "Tambahkan tanggal")}
        <div className="h-8 w-px shrink-0 bg-zinc-200" />
        {section("guests", "Peserta", guestLabel, "Tambahkan tamu")}

        <button
          type="button"
          onClick={handleSearch}
          className={cn(
            "ml-2 flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 font-medium text-white transition hover:bg-primary-700",
            compact ? "py-2.5 text-sm" : "py-3.5",
          )}
        >
          <Search size={compact ? 16 : 18} />
          {!compact && <span className="hidden md:inline">Cari</span>}
        </button>
      </div>

      {/* ── location dropdown ── */}
      {active === "location" && (
        <div className="absolute left-0 top-full z-9999 mt-3 w-80 rounded-2xl bg-white p-4 shadow-custom-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Destinasi
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 focus-within:border-primary-700 focus-within:ring-1 focus-within:ring-primary-700/20">
            <MapPin size={15} className="shrink-0 text-zinc-400" />
            <input
              autoFocus
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Kota, tempat, atau destinasi..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
          <div className="mt-3 space-y-0.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setLocation(s);
                  setActive("date");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-50"
              >
                <MapPin size={14} className="shrink-0 text-zinc-400" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── date dropdown ── */}
      {active === "date" && (
        <div className="absolute left-0 right-0 top-full z-9999 mt-3 rounded-2xl bg-white shadow-custom-lg overflow-hidden">
          <DateRangePicker
            value={dateRange}
            onChange={(r: DateRange) => {
              setDateRange(r);
              if (r.start && r.end) setActive("guests");
            }}
          />
        </div>
      )}

      {/* ── guests dropdown ── */}
      {active === "guests" && (
        <div className="absolute right-0 top-full z-9999 mt-3 w-80 rounded-2xl bg-white p-5 shadow-custom-lg">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Tamu
          </p>
          <div className="space-y-5">
            {GUEST_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{row.label}</p>
                  <p className="text-xs text-zinc-500">{row.sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateGuest(row.key, -1)}
                    disabled={guests[row.key] <= row.min}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center text-sm font-medium">{guests[row.key]}</span>
                  <button
                    type="button"
                    onClick={() => updateGuest(row.key, 1)}
                    disabled={row.key !== "baby" && guests.adult + guests.child >= 10}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Cari sekarang
          </button>
        </div>
      )}
    </div>
  );
}
