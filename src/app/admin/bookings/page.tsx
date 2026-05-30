"use client";

import {
  adminCheckoutBooking,
  adminCompleteBooking,
  adminConfirmBooking,
  getAdminAllBookings,
} from "@/features/admin/services/admin-service";
import { BookingResponse } from "@/features/book/services/booking-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  LogOut,
  Search,
  Star,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  WAITING_PAYMENT: {
    label: "Menunggu Bayar",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: AlertCircle,
  },
  CHECK_IN: {
    label: "Check In",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  DONE: {
    label: "Selesai",
    badgeClass: "bg-zinc-50 text-zinc-600 border-zinc-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Dibatalkan",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  REVIEW: {
    label: "Review",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Star,
  },
  UNAVAILABLE: {
    label: "Tidak Tersedia",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    icon: XCircle,
  },
};

const PAYMENT_CONFIG: Record<string, { label: string; className: string }> = {
  UNPAID: { label: "Belum Bayar", className: "text-red-600" },
  PAID: { label: "Lunas", className: "text-green-600" },
  REFUNDED: { label: "Refund", className: "text-zinc-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    badgeClass: "bg-zinc-100 text-zinc-600 border-zinc-200",
    icon: AlertCircle,
  };
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.badgeClass}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function ActionMenu({ booking }: { booking: BookingResponse }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const confirm = useMutation({
    mutationFn: () => adminConfirmBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success("Booking dikonfirmasi");
      setOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const checkout = useMutation({
    mutationFn: () => adminCheckoutBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success("Check out berhasil");
      setOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const complete = useMutation({
    mutationFn: () => adminCompleteBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success("Booking selesai");
      setOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const canConfirm = booking.status === "PENDING";
  const canCheckout = booking.status === "CHECK_IN";
  const canComplete = booking.status === "CHECK_IN";

  if (!canConfirm && !canCheckout && !canComplete) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition"
      >
        Aksi <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-zinc-100 bg-white shadow-custom-lg overflow-hidden">
            {canConfirm && (
              <button
                onClick={() => confirm.mutate()}
                disabled={confirm.isPending}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-50"
              >
                <CheckCircle2 size={14} className="text-green-600" />
                Konfirmasi
              </button>
            )}
            {canCheckout && (
              <button
                onClick={() => checkout.mutate()}
                disabled={checkout.isPending}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-50"
              >
                <LogOut size={14} className="text-blue-600" />
                Check Out
              </button>
            )}
            {canComplete && (
              <button
                onClick={() => complete.mutate()}
                disabled={complete.isPending}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-50"
              >
                <Star size={14} className="text-purple-600" />
                Selesaikan
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const ALL_STATUSES = ["all", ...Object.keys(STATUS_CONFIG)];

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAdminAllBookings,
  });

  const bookings: BookingResponse[] = Array.isArray(data?.data) ? data.data : [];

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.user_id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.created_at - a.created_at);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Bookings</h1>
        <p className="text-sm text-zinc-500">{bookings.length} booking total</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID booking atau user..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-700"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-700"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "Semua Status" : (STATUS_CONFIG[s]?.label ?? s)}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-custom-sm ">
        <div className="">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">
                  ID
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">
                  Check In
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">
                  Check Out
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">
                  Malam
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">
                  Tamu
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-zinc-500">
                  Total
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">
                  Pembayaran
                </th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-zinc-400"
                  >
                    Tidak ada booking ditemukan
                  </td>
                </tr>
              ) : (
                sorted.map((b) => {
                  const paymentCfg = PAYMENT_CONFIG[b.payment_status] ?? {
                    label: b.payment_status,
                    className: "text-zinc-500",
                  };
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-zinc-400">
                        {b.id.slice(0, 8)}…
                      </td>
                      <td className="px-5 py-3 text-zinc-700">
                        {format(new Date(b.check_in), "d MMM yy", {
                          locale: localeId,
                        })}
                      </td>
                      <td className="px-5 py-3 text-zinc-700">
                        {format(new Date(b.check_out), "d MMM yy", {
                          locale: localeId,
                        })}
                      </td>
                      <td className="px-5 py-3 text-zinc-700">
                        {b.total_night}
                      </td>
                      <td className="px-5 py-3 text-zinc-700">
                        {b.guest_count}
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-zinc-900">
                        Rp {b.total_price.toLocaleString("id-ID")}
                      </td>
                      <td
                        className={`px-5 py-3 text-xs font-medium ${paymentCfg.className}`}
                      >
                        {paymentCfg.label}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-3">
                        <ActionMenu booking={b} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
