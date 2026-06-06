"use client";

import { Star, MessageSquarePlus } from "lucide-react";

interface Props {
  propertyTitle?: string;
}

const RATING_BARS = [
  { label: "5 ★", pct: 0 },
  { label: "4 ★", pct: 0 },
  { label: "3 ★", pct: 0 },
  { label: "2 ★", pct: 0 },
  { label: "1 ★", pct: 0 },
];

export function PropertyReviews({ propertyTitle }: Props) {
  return (
    <section id="reviews">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Star size={20} className="fill-amber-400 text-amber-400" />
        <h2 className="text-xl font-bold text-zinc-900">Ulasan Tamu</h2>
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {/* Rating summary */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-50 p-6 text-center">
          <p className="text-5xl font-bold text-zinc-900">—</p>
          <div className="mt-2 flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-zinc-200" />
            ))}
          </div>
          <p className="mt-2 text-sm text-zinc-400">Belum ada ulasan</p>
        </div>

        {/* Rating bars */}
        <div className="col-span-2 flex flex-col justify-center gap-2">
          {RATING_BARS.map(({ label, pct }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="w-8 text-right text-xs text-zinc-400">{label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-xs text-zinc-300">0</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <MessageSquarePlus size={24} className="text-zinc-400" />
        </div>
        <p className="mt-4 font-semibold text-zinc-700">
          Belum ada ulasan untuk {propertyTitle ?? "penginapan ini"}
        </p>
        <p className="mt-1.5 max-w-xs text-sm text-zinc-400">
          Jadilah tamu pertama yang memberikan ulasan setelah menginap di sini.
        </p>
      </div>
    </section>
  );
}
