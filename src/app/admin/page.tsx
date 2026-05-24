"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminAllBookings } from "@/features/admin/services/admin-service";
import { getExperiences } from "@/features/experiences/services/experience.service";
import { BookingResponse } from "@/features/book/services/booking-service";
import {
  Building2,
  CalendarDays,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  WAITING_PAYMENT: { label: "Menunggu Bayar", className: "bg-blue-50 text-blue-700 border-blue-200", icon: AlertCircle },
  CHECK_IN: { label: "Check In", className: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  DONE: { label: "Selesai", className: "bg-zinc-50 text-zinc-600 border-zinc-200", icon: CheckCircle2 },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  REVIEW: { label: "Review", className: "bg-purple-50 text-purple-700 border-purple-200", icon: AlertCircle },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, className: "bg-zinc-100 text-zinc-700 border-zinc-200", icon: AlertCircle };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-custom-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAdminAllBookings,
  });

  const { data: experiencesData, isLoading: expLoading } = useQuery({
    queryKey: ["experiences", {}],
    queryFn: () => getExperiences({}),
  });

  const bookings: BookingResponse[] = bookingsData?.data ?? [];
  const experiences = experiencesData?.data ?? [];

  const totalRevenue = bookings
    .filter((b) => b.payment_status === "PAID")
    .reduce((sum, b) => sum + b.total_price, 0);

  const activeBookings = bookings.filter(
    (b) => b.status === "CHECK_IN" || b.status === "WAITING_PAYMENT",
  ).length;

  const recentBookings = [...bookings]
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, 8);

  const isLoading = bookingsLoading || expLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Overview</h1>
        <p className="text-sm text-zinc-500">Ringkasan data platform Diengs.id</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Experience"
          value={isLoading ? "—" : experiences.length}
          sub="Listing aktif"
          icon={Building2}
          color="bg-primary-700"
        />
        <StatCard
          label="Total Booking"
          value={isLoading ? "—" : bookings.length}
          sub="Semua waktu"
          icon={CalendarDays}
          color="bg-blue-600"
        />
        <StatCard
          label="Booking Aktif"
          value={isLoading ? "—" : activeBookings}
          sub="Check-in & menunggu bayar"
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          label="Total Pendapatan"
          value={isLoading ? "—" : `Rp ${totalRevenue.toLocaleString("id-ID")}`}
          sub="Dari booking terbayar"
          icon={TrendingUp}
          color="bg-emerald-600"
        />
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-custom-sm">
        <div className="border-b border-zinc-100 px-5 py-4">
          <h2 className="font-semibold text-zinc-900">Booking Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">ID Booking</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">Check In</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">Check Out</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">Tamu</th>
                <th className="whitespace-nowrap px-5 py-3 text-right font-medium text-zinc-500">Total</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-medium text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-zinc-400">
                    Belum ada data booking
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-zinc-500">
                      {b.id.slice(0, 8)}…
                    </td>
                    <td className="px-5 py-3 text-zinc-700">
                      {format(new Date(b.check_in), "d MMM yyyy", { locale: localeId })}
                    </td>
                    <td className="px-5 py-3 text-zinc-700">
                      {format(new Date(b.check_out), "d MMM yyyy", { locale: localeId })}
                    </td>
                    <td className="px-5 py-3 text-zinc-700">{b.guest_count} tamu</td>
                    <td className="px-5 py-3 text-right font-medium text-zinc-900">
                      Rp {b.total_price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
