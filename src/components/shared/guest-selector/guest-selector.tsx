"use client";

import clsx from "clsx";
import { ChevronUp, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function GuestSelector() {
  const [open, setOpen] = useState(false);

  const [guests, setGuests] = useState({
    adult: 1,
    child: 0,
    baby: 0,
    pet: 0,
  });

  const maxGuest = 3;

  const totalGuest = guests.adult + guests.child;

  const update = (key: keyof typeof guests, type: "inc" | "dec") => {
    setGuests((prev) => {
      const value = prev[key];

      if (type === "inc") {
        if (key !== "baby" && totalGuest >= maxGuest) return prev;
        return { ...prev, [key]: value + 1 };
      }

      if (type === "dec") {
        if (value <= 0) return prev;
        if (key === "adult" && value <= 1) return prev;
        return { ...prev, [key]: value - 1 };
      }

      return prev;
    });
  };

  return (
    <div className="w-full max-w-md">
      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="border rounded-2xl p-3 flex justify-between items-center cursor-pointer"
      >
        <div>
          <div className="text-xs font-semibold">Tamu</div>
          <div className="text-xs">
            {totalGuest} tamu
            {guests.baby > 0 && `, ${guests.baby} bayi`}
          </div>
        </div>

        <ChevronUp
          size={18}
          className={clsx("transition-transform", open && "rotate-180")}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="mt-2 border z-2 absolute rounded-2xl p-5 bg-white shadow-xl space-y-6">
          <Row
            title="Dewasa"
            subtitle="Usia 13+"
            value={guests.adult}
            onInc={() => update("adult", "inc")}
            onDec={() => update("adult", "dec")}
            disableInc={totalGuest >= maxGuest}
            disableDec={guests.adult <= 1}
          />

          <Row
            title="Anak"
            subtitle="Usia 2–12"
            value={guests.child}
            onInc={() => update("child", "inc")}
            onDec={() => update("child", "dec")}
            disableInc={totalGuest >= maxGuest}
            disableDec={guests.child <= 0}
          />

          <Row
            title="Bayi"
            subtitle="Di bawah 2 tahun"
            value={guests.baby}
            onInc={() => update("baby", "inc")}
            onDec={() => update("baby", "dec")}
            disableDec={guests.baby <= 0}
          />

          <Row
            title="Hewan peliharaan"
            subtitle="Membawa hewan pemandu?"
            value={guests.pet}
            onInc={() => update("pet", "inc")}
            onDec={() => update("pet", "dec")}
            disableInc
            disableDec
          />

          {/* NOTE */}
          <p className="text-sm text-gray-500">
            Tempat ini mengizinkan jumlah tamu maksimum 10 orang, tidak termasuk
            bayi. Hewan peliharaan tidak diizinkan.
          </p>

          {/* FOOTER */}
          <div className="flex justify-end">
            <button onClick={() => setOpen(false)} className="font-semibold">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  title,
  subtitle,
  value,
  onInc,
  onDec,
  disableInc,
  disableDec,
}: {
  title: string;
  subtitle: string;
  value: number;
  onInc?: () => void;
  onDec?: () => void;
  disableInc?: boolean;
  disableDec?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={disableDec}
          className={clsx(
            "w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer",
            disableDec && "opacity-30 cursor-not-allowed",
          )}
        >
          <Minus size={16} />
        </button>

        <div className="w-5 text-center">{value}</div>

        <button
          onClick={onInc}
          disabled={disableInc}
          className={clsx(
            "w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer",
            disableInc && "opacity-30 cursor-not-allowed",
          )}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
