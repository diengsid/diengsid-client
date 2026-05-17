"use client";

import { BookingResponse } from "@/features/book/services/booking-service";
import { CalendarDays, Clock, Users } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useGetMyBookings } from "../hooks/useGetMyBookings";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING:         { label: "Menunggu konfirmasi", className: "bg-amber-50 text-amber-600 border-amber-200" },
  WAITING_PAYMENT: { label: "Menunggu pembayaran", className: "bg-blue-50 text-blue-600 border-blue-200" },
  CHECK_IN:        { label: "Check in",            className: "bg-green-50 text-green-600 border-green-200" },
  REVIEW:          { label: "Ulasan",              className: "bg-purple-50 text-purple-600 border-purple-200" },
  DONE:            { label: "Selesai",             className: "bg-zinc-50 text-zinc-500 border-zinc-200" },
  CANCELLED:       { label: "Dibatalkan",          className: "bg-red-50 text-red-500 border-red-200" },
  UNAVAILABLE:     { label: "Tidak tersedia",      className: "bg-red-50 text-red-500 border-red-200" },
};

const paymentConfig: Record<string, { label: string; className: string }> = {
  UNPAID:   { label: "Belum dibayar", className: "text-red-500" },
  PAID:     { label: "Lunas",         className: "text-green-600" },
  REFUNDED: { label: "Dikembalikan",  className: "text-blue-500" },
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export default function BookingHistory(): React.ReactNode {
  const { data, isLoading, isError } = useGetMyBookings();
  const bookings = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-zinc-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <p className="text-sm">Gagal memuat riwayat booking.</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
        <CalendarDays size={48} className="text-zinc-200" />
        <p className="text-sm">Belum ada riwayat booking.</p>
        <Link href="/" className="text-sm text-zinc-700 underline font-medium">
          Jelajahi properti
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}

function BookingCard({ booking: b }: { booking: BookingResponse }) {
  const status = statusConfig[b.status] ?? { label: b.status, className: "bg-zinc-100 text-zinc-500 border-zinc-200" };
  const payment = paymentConfig[b.payment_status] ?? { label: b.payment_status, className: "text-zinc-500" };

  return (
    <Link
      href={`/book/confirmation/${b.id}`}
      className="block bg-white rounded-2xl border border-zinc-100 p-5 hover:shadow-md transition group"
    >
      {/* Top row: status + created date */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.className}`}>
          {status.label}
        </span>
        <span className="text-xs text-zinc-400 shrink-0">
          {formatDate(new Date(b.created_at * 1000).toISOString().slice(0, 10))}
        </span>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={15} className="text-zinc-400 shrink-0" />
        <span className="text-sm font-medium">
          {formatDate(b.check_in)} — {formatDate(b.check_out)}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
        <span className="flex items-center gap-1">
          <Clock size={13} />
          {b.total_night} malam
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} />
          {b.guest_count} tamu
        </span>
      </div>

      {/* Price + payment */}
      <div className="flex items-end justify-between pt-3 border-t border-zinc-100">
        <div>
          <p className="text-xs text-zinc-400">Total harga</p>
          <p className="text-base font-semibold">{formatPrice(b.total_price)}</p>
        </div>
        <span className={`text-xs font-medium ${payment.className}`}>
          {payment.label}
        </span>
      </div>
    </Link>
  );
}
