"use client";

import Button from "@/components/ui/button/button";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Home,
  LogIn,
  Moon,
  Star,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useCreatePayment } from "../hooks/useCreatePayment";
import { useGetBooking } from "../hooks/useGetBooking";
import { useGetPayment } from "../hooks/useGetPayment";

interface Props {
  bookingId: string;
  experienceId?: string;
}

// ── Status config ──────────────────────────────────────────────────────────────

type StatusKey =
  | "PENDING"
  | "WAITING_PAYMENT"
  | "UNAVAILABLE"
  | "CANCELLED"
  | "CHECK_IN"
  | "REVIEW"
  | "DONE";

type ColorKey = "amber" | "blue" | "green" | "red" | "purple" | "zinc";

interface StatusUI {
  icon: React.ReactNode;
  badge: string;
  color: ColorKey;
  title: string;
  desc: string;
}

const colorMap: Record<
  ColorKey,
  {
    ring: string;
    bg: string;
    icon: string;
    badge: string;
    border: string;
    text: string;
  }
> = {
  amber: {
    ring: "bg-amber-100",
    bg: "bg-amber-50",
    icon: "text-amber-600",
    badge: "bg-amber-500",
    border: "border-amber-200",
    text: "text-amber-800",
  },
  blue: {
    ring: "bg-blue-100",
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-500",
    border: "border-blue-200",
    text: "text-blue-800",
  },
  green: {
    ring: "bg-green-100",
    bg: "bg-green-50",
    icon: "text-green-600",
    badge: "bg-green-500",
    border: "border-green-200",
    text: "text-green-800",
  },
  red: {
    ring: "bg-red-100",
    bg: "bg-red-50",
    icon: "text-red-500",
    badge: "bg-red-500",
    border: "border-red-200",
    text: "text-red-800",
  },
  purple: {
    ring: "bg-purple-100",
    bg: "bg-purple-50",
    icon: "text-purple-600",
    badge: "bg-purple-500",
    border: "border-purple-200",
    text: "text-purple-800",
  },
  zinc: {
    ring: "bg-zinc-100",
    bg: "bg-zinc-50",
    icon: "text-zinc-500",
    badge: "bg-zinc-400",
    border: "border-zinc-200",
    text: "text-zinc-700",
  },
};

const statusUI: Record<StatusKey, StatusUI> = {
  PENDING: {
    icon: <Clock size={36} />,
    badge: "!",
    color: "amber",
    title: "Menunggu konfirmasi pemilik",
    desc: "Permintaan booking Anda sedang ditinjau oleh pemilik properti. Anda akan mendapat notifikasi dalam 1 × 24 jam.",
  },
  WAITING_PAYMENT: {
    icon: <Wallet size={36} />,
    badge: "💳",
    color: "blue",
    title: "Menunggu pembayaran",
    desc: "Pemilik telah mengkonfirmasi ketersediaan. Segera selesaikan pembayaran Anda sebelum batas waktu.",
  },
  UNAVAILABLE: {
    icon: <AlertCircle size={36} />,
    badge: "✕",
    color: "red",
    title: "Properti tidak tersedia",
    desc: "Mohon maaf, pemilik properti menyatakan bahwa kamar tidak tersedia pada tanggal yang Anda pilih.",
  },
  CANCELLED: {
    icon: <XCircle size={36} />,
    badge: "✕",
    color: "red",
    title: "Booking dibatalkan",
    desc: "Pemesanan ini telah dibatalkan. Jika Anda memerlukan bantuan, silakan hubungi layanan pelanggan kami.",
  },
  CHECK_IN: {
    icon: <LogIn size={36} />,
    badge: "✓",
    color: "green",
    title: "Sedang check in",
    desc: "Selamat datang! Anda sedang menikmati masa menginap. Pastikan mematuhi peraturan properti.",
  },
  REVIEW: {
    icon: <Star size={36} />,
    badge: "★",
    color: "purple",
    title: "Bagikan pengalamanmu",
    desc: "Masa menginap Anda telah selesai. Tinggalkan ulasan untuk membantu tamu lain dan pemilik properti.",
  },
  DONE: {
    icon: <CheckCircle2 size={36} />,
    badge: "✓",
    color: "green",
    title: "Perjalanan selesai",
    desc: "Pemesanan Anda telah selesai. Terima kasih telah mempercayakan perjalanan Anda bersama Diengs.id.",
  },
};

// ── Next steps per status ──────────────────────────────────────────────────────

function NextStepsCard({ status }: { status: StatusKey }) {
  if (status === "PENDING") {
    return (
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="font-semibold text-zinc-800">
          Apa yang terjadi selanjutnya?
        </h2>
        <ol className="space-y-4 text-sm">
          <TimelineStep
            num={1}
            title="Konfirmasi pemilik"
            desc="Kami mengirim permintaan ke pemilik untuk memeriksa ketersediaan."
            active
          />
          <TimelineStep
            num={2}
            title="Notifikasi dikirim"
            desc="Jika tersedia, Anda akan diminta untuk menyelesaikan pembayaran."
          />
          <TimelineStep
            num={3}
            title="Pembayaran & konfirmasi"
            desc="Booking dikonfirmasi setelah pembayaran diterima."
          />
        </ol>
      </div>
    );
  }

  if (status === "WAITING_PAYMENT") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-3">
        <h2 className="font-semibold text-blue-800">
          Segera lakukan pembayaran
        </h2>
        <p className="text-sm text-blue-700">
          Booking Anda akan otomatis dibatalkan jika pembayaran tidak
          diselesaikan tepat waktu.
        </p>
        <ol className="space-y-2 text-sm text-blue-700 list-decimal list-inside">
          <li>Transfer ke rekening yang tertera dari pemilik</li>
          <li>Konfirmasi pembayaran ke pemilik properti</li>
          <li>Tunggu konfirmasi booking dari pemilik</li>
        </ol>
      </div>
    );
  }

  if (status === "UNAVAILABLE" || status === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="font-semibold text-red-700 mb-2">Perlu bantuan?</h2>
        <p className="text-sm text-red-600">
          Hubungi tim kami melalui WhatsApp atau email jika ada pertanyaan
          terkait pemesanan ini.
        </p>
      </div>
    );
  }

  if (status === "CHECK_IN") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-2">
        <h2 className="font-semibold text-green-800">Tips selama menginap</h2>
        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
          <li>Jaga kebersihan dan kerapian kamar</li>
          <li>Patuhi jam ketenangan di malam hari</li>
          <li>Hubungi pemilik jika ada kebutuhan khusus</li>
        </ul>
      </div>
    );
  }

  if (status === "REVIEW") {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <h2 className="font-semibold text-purple-800 mb-2">
          Ulasan Anda berarti!
        </h2>
        <p className="text-sm text-purple-700">
          Berbagi pengalaman membantu tamu lain membuat keputusan yang lebih
          baik dan mendukung pemilik properti.
        </p>
      </div>
    );
  }

  if (status === "DONE") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h2 className="font-semibold text-green-800 mb-2">Terima kasih!</h2>
        <p className="text-sm text-green-700">
          Semoga perjalanan Anda menyenangkan. Sampai jumpa di petualangan
          berikutnya bersama Diengs.id!
        </p>
      </div>
    );
  }

  return null;
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function BookingConfirmation({
  bookingId,
  experienceId,
}: Props) {
  const { data, isLoading } = useGetBooking(bookingId);
  const { mutate: createPayment, isPending: isCreatingPayment } =
    useCreatePayment();
  const booking = data?.data;

  const statusKey = (booking?.status ?? "PENDING") as StatusKey;
  const ui = statusUI[statusKey] ?? statusUI.PENDING;
  const c = colorMap[ui.color];

  const isWaiting = statusKey === "WAITING_PAYMENT";
  const { data: paymentData } = useGetPayment(bookingId, isWaiting);
  const existingPaymentURL = paymentData?.data?.payment_url ?? null;

  function handlePay() {
    if (existingPaymentURL) {
      window.location.href = existingPaymentURL;
      return;
    }
    createPayment(bookingId, {
      onSuccess: (res) => {
        window.location.href = res.data.payment_url;
      },
    });
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-3xl mx-auto px-6 py-30 space-y-6">
        {/* Status card */}
        <div className="bg-white rounded-2xl border p-8 flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full ${c.ring} flex items-center justify-center ${c.icon}`}
            >
              {ui.icon}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full ${c.badge} flex items-center justify-center`}
            >
              <span className="text-white text-xs font-bold">{ui.badge}</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{ui.title}</h1>
            <p className="text-zinc-500 mt-2 text-sm max-w-md">{ui.desc}</p>
          </div>

          <div
            className={`${c.bg} border ${c.border} rounded-xl px-5 py-3 text-sm ${c.text} w-full max-w-sm`}
          >
            ID Pemesanan:{" "}
            <span className="font-mono font-semibold break-all">
              {bookingId}
            </span>
          </div>
        </div>

        {/* Booking detail card */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-zinc-800">Detail pemesanan</h2>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-zinc-100 rounded w-3/4" />
              ))}
            </div>
          ) : booking ? (
            <div className="divide-y">
              <DetailRow
                icon={<CalendarDays size={16} />}
                label="Check-in"
                value={formatDate(booking.check_in)}
              />
              <DetailRow
                icon={<CalendarDays size={16} />}
                label="Check-out"
                value={formatDate(booking.check_out)}
              />
              <DetailRow
                icon={<Moon size={16} />}
                label="Durasi"
                value={`${booking.total_night} malam`}
              />
              <DetailRow
                icon={<Users size={16} />}
                label="Tamu"
                value={`${booking.guest_count} tamu`}
              />
              <DetailRow
                icon={<Home size={16} />}
                label="Jumlah kamar"
                value={`${booking.quantity} kamar`}
              />
              <DetailRow
                icon={<Wallet size={16} />}
                label="Total harga"
                value={`Rp ${booking.total_price.toLocaleString("id-ID")}`}
              />
              {booking.first_payment && (
                <DetailRow
                  label="Opsi bayar"
                  value={
                    booking.first_payment === "DP"
                      ? "Uang muka (DP 30%)"
                      : "Bayar penuh"
                  }
                />
              )}
            </div>
          ) : (
            <p className="p-6 text-sm text-zinc-400">Data tidak tersedia.</p>
          )}
        </div>

        {/* Next steps — varies by status */}
        {booking && <NextStepsCard status={statusKey} />}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/book" className="flex-1">
            <Button variant="outline" className="w-full">
              Riwayat booking
            </Button>
          </Link>
          {statusKey === "WAITING_PAYMENT" ? (
            <Button
              className="flex-1"
              onClick={handlePay}
              disabled={isCreatingPayment}
            >
              {isCreatingPayment ? "Memproses..." : "Bayar sekarang"}
            </Button>
          ) : experienceId ? (
            <Link href={`/properties/${experienceId}`} className="flex-1">
              <Button className="w-full">Lihat properti</Button>
            </Link>
          ) : (
            <Link href="/" className="flex-1">
              <Button className="w-full">Kembali ke beranda</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr + "T00:00:00"), "EEEE, dd MMMM yyyy", {
      locale: idLocale,
    });
  } catch {
    return dateStr;
  }
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-zinc-800">{value}</span>
    </div>
  );
}

function TimelineStep({
  num,
  title,
  desc,
  active,
}: {
  num: number;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <li className="flex gap-4">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${active ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-400"}`}
      >
        {num}
      </div>
      <div>
        <p
          className={`font-medium ${active ? "text-zinc-900" : "text-zinc-400"}`}
        >
          {title}
        </p>
        <p
          className={`text-xs mt-0.5 ${active ? "text-zinc-500" : "text-zinc-300"}`}
        >
          {desc}
        </p>
      </div>
    </li>
  );
}
