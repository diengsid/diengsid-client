"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Guests = { adult: number; child: number; baby: number };

const GUEST_ROWS = [
  { key: "adult" as const, label: "Dewasa", sub: "Usia 13+", min: 1 },
  { key: "child" as const, label: "Anak", sub: "Usia 2–12", min: 0 },
  { key: "baby" as const, label: "Bayi", sub: "Di bawah 2 tahun", min: 0 },
];

export default function GuestSelector() {
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adult: 1, child: 0, baby: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const update = (key: keyof Guests, delta: 1 | -1) => {
    setGuests((prev) => {
      const next = prev[key] + delta;
      const row = GUEST_ROWS.find((r) => r.key === key)!;
      if (next < row.min) return prev;
      if (key !== "baby" && delta === 1 && prev.adult + prev.child >= 10)
        return prev;
      return { ...prev, [key]: next };
    });
  };

  const totalGuests = guests.adult + guests.child;
  const guestLabel =
    totalGuests > 1 || guests.baby > 0
      ? `${totalGuests} tamu${guests.baby > 0 ? `, ${guests.baby} bayi` : ""}`
      : "1 tamu";

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition",
          open ? "border-zinc-400 ring-1 ring-zinc-300" : "border-zinc-200 hover:border-zinc-300",
        )}
      >
        <div className="flex items-center gap-2">
          <Users size={16} className="shrink-0 text-zinc-400" />
          <div>
            <p className="text-xs font-semibold text-zinc-500">Tamu</p>
            <p className="text-sm text-zinc-800">{guestLabel}</p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={cn("text-zinc-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-zinc-100 bg-white p-5 shadow-xl">
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
                    onClick={() => update(row.key, -1)}
                    disabled={guests[row.key] <= row.min}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center text-sm font-medium text-zinc-900">
                    {guests[row.key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => update(row.key, 1)}
                    disabled={row.key !== "baby" && guests.adult + guests.child >= 10}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-5 w-full cursor-pointer rounded-xl border border-zinc-200 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}
