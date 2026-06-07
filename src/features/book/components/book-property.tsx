"use client";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import Button from "@/components/ui/button/button";
import Modal from "@/components/ui/modal/modal";
import Login from "@/features/auth/components/login";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { useFindProperty } from "@/features/properties/hooks/useFindProperty";
import { useBookingCalculation } from "@/hooks/use-booking-calculation";
import clsx from "clsx";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarDays, Minus, Phone, Plus, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useCreateBooking } from "../hooks/useCreateBooking";

interface Props {
  token: string;
  propertyId: string;
  dateRange: DateRange;
  rentableId?: string;
}

type Guests = { adult: number; child: number };

export default function BookProperty({
  token,
  propertyId,
  dateRange: initialDateRange,
  rentableId,
}: Props): React.ReactNode {
  const router = useRouter();

  const [openAuth, setOpenAuth] = useState(false);
  const [openEditDate, setOpenEditDate] = useState(false);
  const [openEditGuest, setOpenEditGuest] = useState(false);

  const [localDateRange, setLocalDateRange] =
    useState<DateRange>(initialDateRange);
  const [pendingDateRange, setPendingDateRange] =
    useState<DateRange>(initialDateRange);

  const [guests, setGuests] = useState<Guests>({ adult: 1, child: 0 });
  const [quantity, setQuantity] = useState(1);
  const [firstPayment, setFirstPayment] = useState<"FULL" | "DP">("FULL");
  const [phoneOverride, setPhoneOverride] = useState<string | null>(null);

  const { data: currentUser } = useCurrentUser(!!token);
  const phoneNumber = phoneOverride ?? currentUser?.phone_number ?? "";
  const setPhoneNumber = (v: string) => setPhoneOverride(v);

  const { data, isFetching } = useFindProperty(propertyId);
  const property = data?.data;
  const rentable =
    property?.rentable.find((r) => r.id === rentableId) ??
    property?.rentable[0];

  const {
    totalDays,
    totalPrice,
    totalDiscount,
    finalPrice,
    hasDiscount,
    discountPercent,
  } = useBookingCalculation({ dateRange: localDateRange, rentable });

  const totalWithQuantity = finalPrice * quantity;
  const dpAmount = Math.ceil(totalWithQuantity * 0.3);
  const amountDue = firstPayment === "DP" ? dpAmount : totalWithQuantity;
  const totalGuests = guests.adult + guests.child;

  const { mutate, isPending } = useCreateBooking();

  useEffect(() => {
    document.body.style.overflow =
      openAuth || openEditDate || openEditGuest ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openAuth, openEditDate, openEditGuest]);

  const handleSubmit = () => {
    if (!token) {
      setOpenAuth(true);
      return;
    }
    if (!localDateRange.start || !localDateRange.end || !rentable) return;

    mutate(
      {
        rentable_id: rentable.id,
        property_id: property?.id ?? "",
        check_in: format(localDateRange.start, "yyyy-MM-dd"),
        check_out: format(localDateRange.end, "yyyy-MM-dd"),
        quantity,
        guest_count: totalGuests,
        first_payment: firstPayment,
        phone_number: phoneNumber,
      },
      {
        onSuccess: (res) =>
          router.push(
            `/booking/konfirmasi/${res.data.id}?property_id=${propertyId}`,
          ),
      },
    );
  };

  const canBook =
    !!localDateRange.start &&
    !!localDateRange.end &&
    !!rentable &&
    !isFetching &&
    phoneNumber.trim().length >= 8;

  // ── Guest helpers ────────────────────────────────────────────────────────────
  const updateGuest = (key: keyof Guests, delta: number) => {
    setGuests((prev) => {
      if (!rentable) return prev;
      const next = prev[key] + delta;
      if (next < 0) return prev;
      if (key === "adult" && next < 1) return prev;
      if (
        key !== "adult" &&
        prev.adult + prev.child + delta > rentable.capacity
      )
        return prev;
      return { ...prev, [key]: next };
    });
  };

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/penginapan/${propertyId}?${new URLSearchParams({
              ...(localDateRange.start ? { check_in: format(localDateRange.start, "yyyy-MM-dd") } : {}),
              ...(localDateRange.end ? { check_out: format(localDateRange.end, "yyyy-MM-dd") } : {}),
              ...(rentableId ? { rentable_id: rentableId } : {}),
            }).toString()}`}>
            <Button variant="ghost" size="sm">
              <X size={20} />
            </Button>
          </Link>
          <Link href="/">
            <Image
              src="/logo2.png"
              alt="diengsid"
              width={120}
              height={32}
              priority
            />
          </Link>
          <div className="w-8" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-36 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              Homestay ini memerlukan konfirmasi ketersediaan dari pemilik. Anda
              akan menerima konfirmasi dalam{" "}
              <span className="font-semibold">1 × 24 jam</span>.
            </div>

            <h1 className="text-2xl font-semibold">Tinjau pemesanan</h1>

            {/* Property card */}
            <div className="flex gap-4 border rounded-xl p-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                {(property?.thumbnail_url ??
                  property?.images?.[0]?.image_url) && (
                  <Image
                    src={
                      property.thumbnail_url ?? property.images![0].image_url
                    }
                    alt={property.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {property?.title ?? "Memuat..."}
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {rentable?.name ?? "—"}
                </p>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {property?.address}
                </p>
              </div>
            </div>

            {/* Dates — editable */}
            <div className="border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">
                    Tanggal
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    {localDateRange.start && localDateRange.end ? (
                      <>
                        {format(localDateRange.start, "dd MMM yyyy", {
                          locale: idLocale,
                        })}{" "}
                        →{" "}
                        {format(localDateRange.end, "dd MMM yyyy", {
                          locale: idLocale,
                        })}
                        <span className="text-zinc-400 font-normal ml-2">
                          ({totalDays} malam)
                        </span>
                      </>
                    ) : (
                      <span className="text-zinc-400">Belum dipilih</span>
                    )}
                  </p>
                </div>
                <Button
                  variant="third"
                  size="sm"
                  onClick={() => {
                    setPendingDateRange(localDateRange);
                    setOpenEditDate(true);
                  }}
                >
                  Ubah
                </Button>
              </div>

              {/* Guests — editable */}
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wide">
                    Tamu
                  </p>
                  <p className="text-sm font-medium mt-0.5">
                    {totalGuests} tamu
                    {guests.child > 0 &&
                      ` (${guests.adult} dewasa, ${guests.child} anak)`}
                  </p>
                </div>
                <Button
                  variant="third"
                  size="sm"
                  onClick={() => setOpenEditGuest(true)}
                >
                  Ubah
                </Button>
              </div>
            </div>

            {/* Quantity */}
            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Jumlah kamar / unit</p>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    Stok tersedia: {rentable?.stock ?? "—"}
                  </p>
                </div>
                <StepperControl
                  value={quantity}
                  min={1}
                  max={rentable?.stock ?? 1}
                  onChange={setQuantity}
                />
              </div>
            </div>

            {/* Phone number */}
            <div className="border rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-zinc-400 shrink-0" />
                <p className="font-medium">Nomor WhatsApp</p>
              </div>
              <p className="text-sm text-zinc-500">
                Konfirmasi booking akan dikirim ke nomor ini.
              </p>
              <div className={`flex items-center gap-2 border rounded-lg overflow-hidden focus-within:ring-2 mt-1 ${phoneNumber.trim().length > 0 && phoneNumber.trim().length < 8 ? "border-red-400 focus-within:ring-red-400" : "focus-within:ring-zinc-900"}`}>
                <span className="bg-zinc-50 border-r px-3 py-2.5 text-sm text-zinc-500 shrink-0">
                  +62
                </span>
                <input
                  type="tel"
                  placeholder="8xx xxxx xxxx"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                />
              </div>
              {phoneNumber.trim().length === 0 && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600 mt-1">
                  <span>⚠️</span>
                  Nomor WhatsApp wajib diisi untuk konfirmasi booking.
                </p>
              )}
              {phoneNumber.trim().length > 0 && phoneNumber.trim().length < 8 && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                  <span>⚠️</span>
                  Nomor terlalu pendek, minimal 8 digit.
                </p>
              )}
            </div>

            {/* Payment option */}
            <div className="border rounded-xl p-4 space-y-4">
              <p className="font-medium">Opsi pembayaran</p>
              {(["FULL"] as const).map((opt) => (
                <label
                  key={opt}
                  className={clsx(
                    "flex gap-3 items-start cursor-pointer rounded-xl border p-3 transition-colors",
                    firstPayment === opt
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200",
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt}
                    checked={firstPayment === opt}
                    onChange={() => setFirstPayment(opt)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">
                      Bayar Penuh
                      {/* {opt === "FULL" ? "Bayar penuh" : "Uang muka (DP 30%)"} */}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {opt === "FULL"
                        ? `Rp. ${totalWithQuantity.toLocaleString("id-ID")}`
                        : `Bayar Rp. ${dpAmount.toLocaleString("id-ID")} sekarang · sisa dilunasi saat check-in`}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border rounded-xl p-4 space-y-3">
              <p className="font-medium">Rincian harga</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    Rp. {rentable?.base_price.toLocaleString("id-ID")} ×{" "}
                    {totalDays} malam × {quantity} kamar
                  </span>
                  <span>
                    Rp. {(totalPrice * quantity).toLocaleString("id-ID")}
                  </span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-green-700">
                    <span>Diskon {discountPercent}%</span>
                    <span>
                      − Rp. {(totalDiscount * quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rp. {totalWithQuantity.toLocaleString("id-ID")}</span>
              </div>
              {firstPayment === "DP" && (
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Dibayar sekarang (30%)</span>
                  <span>Rp. {dpAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
            </div>

            {/* Cancel policy */}
            <div className="border rounded-xl p-4 text-sm text-zinc-600">
              <p className="font-medium text-zinc-800 mb-1">
                Kebijakan pembatalan
              </p>
              <p>
                Pembatalan gratis dalam 24 jam pertama setelah pemesanan.
                Setelah itu, biaya 50% akan dikenakan.
              </p>
            </div>

          </div>

          {/* ── RIGHT COLUMN (desktop) ───────────────────────────────────────── */}
          <aside className="hidden lg:block w-85 shrink-0">
            <div className="sticky top-24 border rounded-2xl p-6 shadow-lg space-y-5">
              {/* Property mini */}
              <div className="flex gap-3 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                  {(property?.thumbnail_url ??
                    property?.images?.[0]?.image_url) && (
                    <Image
                      src={
                        property.thumbnail_url ?? property.images![0].image_url
                      }
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm leading-snug line-clamp-2">
                    {property?.title}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {rentable?.name}
                  </p>
                </div>
              </div>

              <hr />

              {/* Summary rows */}
              <div className="space-y-2 text-sm">
                <SummaryRow
                  icon={<CalendarDays size={14} />}
                  label="Check-in"
                  value={
                    localDateRange.start
                      ? format(localDateRange.start, "dd MMM yyyy", {
                          locale: idLocale,
                        })
                      : "—"
                  }
                />
                <SummaryRow
                  icon={<CalendarDays size={14} />}
                  label="Check-out"
                  value={
                    localDateRange.end
                      ? format(localDateRange.end, "dd MMM yyyy", {
                          locale: idLocale,
                        })
                      : "—"
                  }
                />
                <SummaryRow
                  icon={<Users size={14} />}
                  label="Tamu"
                  value={`${totalGuests} orang`}
                />
              </div>

              <hr />

              {/* Price */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    Rp. {rentable?.base_price.toLocaleString("id-ID")} ×{" "}
                    {totalDays} mlm × {quantity}
                  </span>
                  <span>
                    Rp. {(totalPrice * quantity).toLocaleString("id-ID")}
                  </span>
                </div>
                {hasDiscount && (
                  <div className="flex justify-between text-green-700">
                    <span>Diskon {discountPercent}%</span>
                    <span>
                      − Rp. {(totalDiscount * quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-semibold border-t pt-4">
                <span>
                  {firstPayment === "DP" ? "Bayar sekarang" : "Total"}
                </span>
                <span>Rp. {amountDue.toLocaleString("id-ID")}</span>
              </div>

              <Button
                className="w-full rounded-full!"
                disabled={!canBook}
                loading={isPending}
                onClick={handleSubmit}
              >
                Konfirmasi pemesanan
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile sticky bottom ─────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex items-center justify-between gap-4 ">
        <div>
          <p className="text-xs text-zinc-400">
            {firstPayment === "DP" ? "Bayar sekarang" : "Total"}
          </p>
          <p className="font-semibold text-base">
            Rp. {amountDue.toLocaleString("id-ID")}
          </p>
        </div>
        <Button
          className="rounded-full! shrink-0"
          disabled={!canBook}
          loading={isPending}
          onClick={handleSubmit}
        >
          Konfirmasi
        </Button>
      </div>

      {/* ── Modal: Edit tanggal ──────────────────────────────────────────────── */}
      <Modal isOpen={openEditDate} onClose={() => setOpenEditDate(false)}>
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Ubah tanggal</h3>
          <DateRangePicker
            value={pendingDateRange}
            onChange={setPendingDateRange}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setOpenEditDate(false)}>
              Batal
            </Button>
            <Button
              disabled={!pendingDateRange.start || !pendingDateRange.end}
              onClick={() => {
                setLocalDateRange(pendingDateRange);
                setOpenEditDate(false);
              }}
            >
              Terapkan
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Edit tamu ─────────────────────────────────────────────────── */}
      <Modal isOpen={openEditGuest} onClose={() => setOpenEditGuest(false)}>
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Ubah jumlah tamu</h3>
          <div className="space-y-5">
            <GuestRow
              title="Dewasa"
              subtitle="Usia 13+"
              value={guests.adult}
              onInc={() => updateGuest("adult", 1)}
              onDec={() => updateGuest("adult", -1)}
              disableDec={guests.adult <= 1}
              disableInc={totalGuests >= (rentable?.capacity ?? 0)}
            />
            <GuestRow
              title="Anak"
              subtitle="Usia 2–12"
              value={guests.child}
              onInc={() => updateGuest("child", 1)}
              onDec={() => updateGuest("child", -1)}
              disableDec={guests.child <= 0}
              disableInc={totalGuests >= (rentable?.capacity ?? 0)}
            />
          </div>
          <p className="text-xs text-zinc-400">Maksimum 10 tamu</p>
          <div className="flex justify-end">
            <Button onClick={() => setOpenEditGuest(false)}>Selesai</Button>
          </div>
        </div>
      </Modal>

      {/* ── Login overlay ────────────────────────────────────────────────────── */}
      {openAuth && (
        <div className="w-full h-full flex items-center justify-center fixed top-0 left-0 bg-zinc-900/40 z-50">
          <Login onClose={() => setOpenAuth(false)} />
        </div>
      )}
    </>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-zinc-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StepperControl({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30 hover:bg-zinc-50 cursor-pointer"
      >
        <Minus size={14} />
      </button>
      <span className="w-4 text-center font-medium">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30 hover:bg-zinc-50 cursor-pointer"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function GuestRow({
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
  onInc: () => void;
  onDec: () => void;
  disableInc?: boolean;
  disableDec?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-zinc-400">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec}
          disabled={disableDec}
          className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-zinc-50"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center text-sm font-medium">{value}</span>
        <button
          onClick={onInc}
          disabled={disableInc}
          className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30 cursor-pointer hover:bg-zinc-50"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
