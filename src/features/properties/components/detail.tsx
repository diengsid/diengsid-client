/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { AmenityIcon } from "@/features/admin/components/amenity-icon";
import { getNearbyAttractions } from "@/features/attractions/services/attraction-service";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar,
  Clock,
  DoorClosed,
  MapPin,
  PenLine,
  Ruler,
  ShieldCheck,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import GuestSelector from "@/components/shared/guest-selector/guest-selector";
import Button from "@/components/ui/button/button";
import InputDateRange from "@/components/ui/input-date-range/input-date-range";
import Modal from "@/components/ui/modal/modal";

import { useBookingCalculation } from "@/hooks/use-booking-calculation";
import { useQueryParams } from "@/hooks/use-query-params";
import { scrollToId } from "@/lib/utils";
import { useAvailability } from "../hooks/useAvailability";
import { useFindProperty } from "../hooks/useFindProperty";
import type { Amenity } from "../schemas/schema-property";

import DetailImageProperty from "./detail-image";
import NavItem from "./nav-detail";
import { PropertyRecommendations } from "./property-recommendations";
import { PropertyReviews } from "./property-reviews";
import RoomList from "./rooms/list";

const MapViewer = dynamic(
  () => import("../../../components/shared/map-viewer/MapViewer"),
  { ssr: false },
);

interface Props {
  propertyId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  rentableId: string;
}

export default function DetailProperty({
  propertyId,
  checkIn,
  checkOut,
  rentableId,
}: Props) {
  const { setParams } = useQueryParams();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>({
    start: checkIn,
    end: checkOut,
  });
  const { data, isFetching } = useFindProperty(propertyId);
  const property = data?.data;
  const rating = 0; // replace with real API data when available

  const rentableID = useMemo(() => {
    if (!property?.rentable.length) return "";
    const rentableFromProps = property.rentable.find(
      (item) => item.id === rentableId,
    );
    return rentableFromProps?.id ?? property.rentable[0].id;
  }, [property?.rentable, rentableId]);

  const rentable = property?.rentable?.find((num) => num.id === rentableID);
  const { disabledDates } = useAvailability(rentableID);

  const {
    totalDays,
    totalPrice,
    totalDiscount,
    finalPrice,
    discountPercent,
    hasDiscount,
    isReady,
  } = useBookingCalculation({ dateRange, rentable });

  const { data: nearbyData } = useQuery({
    queryKey: ["nearby-attractions", propertyId],
    queryFn: () => getNearbyAttractions(propertyId),
    enabled: !!propertyId,
  });
  const nearbyAttractions = nearbyData?.data ?? [];

  const [modalBook, setModalBook] = useState<boolean>(false);

  useEffect(() => {
    if (!rentableID || rentableID === rentableId) return;
    setParams({ rentable_id: rentableID });
  }, [rentableID, rentableId, setParams]);

  const isLoadingPrice = isFetching || !property || !isReady;

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isFetching && !property) {
    return (
      <div className="mx-auto max-w-6xl w-full animate-pulse px-4 md:px-0">
        <div className="relative aspect-square md:hidden rounded-2xl bg-zinc-200" />
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 w-full h-113 mt-10">
          <div className="row-span-2 col-span-2 rounded-l-2xl bg-zinc-200" />
          <div className="bg-zinc-200" />
          <div className="rounded-tr-2xl bg-zinc-200" />
          <div className="bg-zinc-200" />
          <div className="rounded-br-2xl bg-zinc-200" />
        </div>
        <div className="flex gap-12 mt-8">
          <div className="w-full space-y-6">
            <div className="h-8 w-2/3 rounded-xl bg-zinc-200" />
            <div className="h-4 w-1/3 rounded-lg bg-zinc-200" />
            <div className="flex items-center gap-4 border-y py-5">
              <div className="h-12 w-12 rounded-full bg-zinc-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 rounded-lg bg-zinc-200" />
                <div className="h-3 w-56 rounded-lg bg-zinc-200" />
              </div>
            </div>
            <div className="space-y-2 border-b pb-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded-lg bg-zinc-200"
                  style={{ width: `${90 - i * 10}%` }}
                />
              ))}
            </div>
            <div className="border-b pb-8 space-y-4">
              <div className="h-5 w-24 rounded-lg bg-zinc-200" />
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-zinc-200 shrink-0" />
                    <div className="h-3 w-20 rounded-lg bg-zinc-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block mt-10 shrink-0">
            <div className="w-88 rounded-2xl border border-zinc-100 p-6 space-y-4">
              <div className="h-7 w-40 rounded-lg bg-zinc-200" />
              <div className="h-4 w-24 rounded-lg bg-zinc-200" />
              <div className="h-12 w-full rounded-xl bg-zinc-200" />
              <div className="h-12 w-full rounded-xl bg-zinc-200" />
              <div className="h-11 w-full rounded-xl bg-zinc-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDateChange = (value: DateRange) => {
    setDateRange(value);
    setParams({
      check_in: value.start ? format(value.start, "yyyy-MM-dd") : null,
      check_out: value.end ? format(value.end, "yyyy-MM-dd") : null,
    });
  };

  const handlePesan = () => {
    if (!dateRange.start || !dateRange.end || !rentableID) return;
    const queryParams = new URLSearchParams({
      start_date: format(dateRange.start, "yyyy-MM-dd"),
      end_date: format(dateRange.end, "yyyy-MM-dd"),
      rentable_id: rentableID,
    });
    router.push(`/booking/penginapan/${propertyId}?${queryParams.toString()}`);
  };

  // ── Price render ──────────────────────────────────────────────────────────
  const renderPrice = (compact = false) => {
    if (isLoadingPrice || totalDays === 0 || !rentable) {
      return (
        <p className="text-sm text-zinc-500">
          Pilih tanggal &amp; kamar untuk melihat harga
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-0.5">
        {hasDiscount && (
          <p className="text-xs text-zinc-400 line-through">
            Rp {totalPrice.toLocaleString("id-ID")}
          </p>
        )}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span
            className={`font-bold text-zinc-900 ${compact ? "text-base" : "text-xl"}`}
          >
            Rp {finalPrice.toLocaleString("id-ID")}
          </span>
          {hasDiscount && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              -{discountPercent}%
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400">untuk {totalDays} malam</p>
      </div>
    );
  };

  // ── Calendar header ───────────────────────────────────────────────────────
  const renderCalendarHeader = () => {
    if (totalDays === 0) {
      return (
        <h2 className="text-xl font-semibold text-zinc-900">
          {checkOut === null
            ? "Pilih tanggal check-out"
            : "Pilih tanggal menginap"}
        </h2>
      );
    }
    return (
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          {totalDays} malam di {property?.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-400 flex items-center gap-1.5">
          <Calendar size={13} />
          {format(checkIn!, "dd MMM yyyy", { locale: id })} —{" "}
          {format(checkOut!, "dd MMM yyyy", { locale: id })}
        </p>
      </div>
    );
  };

  // ── Amenities grouped ─────────────────────────────────────────────────────
  const amenityGroups = Object.entries(
    (property?.amenities ?? []).reduce<Record<string, Amenity[]>>((acc, a) => {
      const cat = a.category?.trim() || "Lainnya";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(a);
      return acc;
    }, {}),
  );

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <>
      <NavItem totalDays={totalDays} />

      <div className="mx-auto max-w-6xl w-full">
        {/* ── Gallery ── */}
        <section id="photos">
          <DetailImageProperty images={property?.images} />
        </section>

        <div className="flex gap-12 mt-8">
          {/* ════ LEFT CONTENT ════════════════════════════════════════════════ */}
          <div className="min-w-0 flex-1 px-4 pb-32 md:px-0">
            {/* Title + address */}
            <div>
              <h1 className="text-2xl font-bold capitalize text-zinc-900 md:text-3xl">
                {property?.title}
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                <MapPin size={14} className="shrink-0 text-emerald-500" />
                {property?.address}
              </div>

              {/* Quick badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {property?.property_type && (
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium capitalize text-zinc-600">
                    {property.property_type}
                  </span>
                )}
                <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <ShieldCheck size={11} />
                  Terverifikasi
                </span>
                {rating > 0 && (
                  <span className="flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    <Star size={11} />
                    {rating} · Host Pilihan
                  </span>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <hr className="my-6 border-zinc-100" />

            {/* Host */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-100">
                <Image
                  width={48}
                  height={48}
                  src={
                    property?.host?.profile_picture_url || "/host_avatar.png"
                  }
                  alt={property?.host?.name ?? "host"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-zinc-900">
                  Tuan rumah: {property?.host?.name}
                </p>
                <p className="text-sm text-zinc-400">
                  Host teladan · berpengalaman
                </p>
              </div>
            </div>

            {/* ── Divider ── */}
            <hr className="my-6 border-zinc-100" />

            {/* Description */}
            <section id="description">
              <div
                className="prose prose-sm prose-zinc max-w-none font-light
                prose-headings:font-semibold prose-headings:text-zinc-900
                prose-p:text-zinc-600 prose-p:leading-relaxed
                prose-a:text-emerald-700 prose-strong:text-zinc-800"
                dangerouslySetInnerHTML={{
                  __html: property?.description ?? "",
                }}
              />
            </section>

            {/* ── Amenities ── */}
            {amenityGroups.length > 0 && (
              <>
                <hr className="my-8 border-zinc-100" />
                <section id="amenities">
                  <h2 className="text-xl font-bold text-zinc-900">Fasilitas</h2>
                  <div className="mt-5 space-y-6">
                    {amenityGroups.map(([category, items]) => (
                      <div key={category}>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          {category}
                        </p>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 sm:grid-cols-3">
                          {items.map((amenity) => (
                            <div
                              key={amenity.id}
                              className="flex items-center gap-2.5"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                                <AmenityIcon
                                  icon={amenity.icon ?? ""}
                                  size={17}
                                />
                              </div>
                              <span className="text-sm text-zinc-700">
                                {amenity.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ── Rooms ── */}
            <hr className="my-8 border-zinc-100" />
            <section id="rooms">
              <h2 className="text-xl font-bold text-zinc-900">
                {property?.property_type == "room"
                  ? "Pilih Kamar"
                  : "Detail Properti"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">{property?.title}</p>
              <div className="mt-5">
                <RoomList
                  selectRentableId={rentableID}
                  rentables={property?.rentable ?? []}
                />
              </div>
            </section>

            {/* ── Calendar ── */}
            <hr className="my-8 border-zinc-100" />
            <section className="relative z-0" id="calendars">
              {renderCalendarHeader()}
              <div className="mt-4">
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateChange}
                  disabledDates={disabledDates}
                />
              </div>
            </section>

            {/* ── Map ── */}
            <hr className="my-8 border-zinc-100" />
            <section id="locations">
              <h2 className="text-xl font-bold text-zinc-900">Lokasi</h2>
              <p className="mt-1 mb-4 flex items-center gap-1.5 text-sm text-zinc-500">
                <MapPin size={14} className="text-emerald-500" />
                {property?.address}
              </p>
              <div className="overflow-hidden rounded-2xl">
                <MapViewer
                  center={[property?.lat ?? -7.205, property?.lng ?? 109.906]}
                  zoom={14}
                  markers={[
                    {
                      id: "1",
                      position: [
                        property?.lat ?? -7.205,
                        property?.lng ?? 109.906,
                      ],
                      label: property?.title,
                    },
                  ]}
                />
              </div>
            </section>

            {/* ── Nearby Attractions ── */}
            {nearbyAttractions.length > 0 && (
              <>
                <hr className="my-8 border-zinc-100" />
                <section>
                  <h2 className="text-xl font-bold text-zinc-900">
                    Wisata Terdekat
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Destinasi populer di sekitar penginapan ini
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {nearbyAttractions.map(
                      ({ attraction: a, distance_km, duration_minutes }) => (
                        <Link
                          key={a.id}
                          href={`/wisata/${a.slug}`}
                          className="group flex gap-3 rounded-xl border border-zinc-100 bg-white p-3 transition hover:border-emerald-200 hover:shadow-md"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                            {a.image_url ? (
                              <Image
                                fill
                                src={a.image_url}
                                alt={a.name}
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <MapPin size={20} className="text-zinc-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                              {a.name}
                            </p>
                            {a.category && (
                              <span className="mt-0.5 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] capitalize text-zinc-500">
                                {a.category}
                              </span>
                            )}
                            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                              {distance_km != null && (
                                <span className="flex items-center gap-1 text-xs text-zinc-400">
                                  <Ruler size={11} />
                                  {distance_km} km
                                </span>
                              )}
                              {duration_minutes != null && (
                                <span className="flex items-center gap-1 text-xs text-zinc-400">
                                  <Clock size={11} />
                                  {duration_minutes} menit
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ),
                    )}
                  </div>
                </section>
              </>
            )}
            {/* ── Reviews ── */}
            <hr className="my-8 border-zinc-100" />
            <PropertyReviews propertyTitle={property?.title} />

            {/* ── Recommendations ── */}
            <hr className="my-8 border-zinc-100" />
            <PropertyRecommendations
              currentId={propertyId}
              propertyType={property?.property_type}
            />
          </div>

          {/* ════ RIGHT BOOKING SIDEBAR ════════════════════════════════════ */}
          <div className="hidden md:block shrink-0">
            <div className="sticky top-24 w-88">
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg p-6 space-y-5">
                {/* Price */}
                <div
                  className="cursor-pointer rounded-xl bg-zinc-50 p-4 transition hover:bg-zinc-100"
                  onClick={() => setModalBook(true)}
                >
                  {renderPrice()}
                </div>

                {/* Date */}
                <InputDateRange value={dateRange} onChange={handleDateChange} />

                {/* Guests */}
                <GuestSelector />

                {/* Room selector */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-700">
                    <DoorClosed size={16} className="text-zinc-400" />
                    <span>{rentable ? rentable.name : "Pilih kamar"}</span>
                  </div>
                  <button
                    onClick={() => scrollToId("rooms")}
                    className="flex cursor-pointer items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
                  >
                    <PenLine size={13} />
                    Ubah
                  </button>
                </div>

                {/* CTA */}
                <Button
                  className="w-full rounded-xl!"
                  disabled={isLoadingPrice || totalDays === 0}
                  onClick={handlePesan}
                >
                  Pesan Sekarang
                </Button>

                <p className="text-center text-xs text-zinc-400">
                  Belum ada biaya yang dikenakan sekarang
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-4 flex flex-col gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  Pembayaran aman &amp; terenkripsi
                </span>
                {rating > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Star size={13} className="text-amber-400" />
                    Host Pilihan · Rating {rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════ MOBILE BOTTOM BAR ════════════════════════════════════════════ */}
        <div className="fixed cursor-pointer bottom-0 left-0 right-0 z-50 border-t border-zinc-100 bg-white px-4 py-3 shadow-lg md:hidden">
          <div
            className="mb-2 flex items-center gap-1 text-sm"
            onClick={() => scrollToId("rooms")}
          >
            <DoorClosed size={14} className="text-zinc-400" />
            <span className="font-medium text-zinc-700 underline">
              {rentable ? rentable.name : "Pilih kamar"}
            </span>
            {checkIn && checkOut && totalDays > 0 && (
              <span className="text-zinc-400">
                · {format(checkIn, "dd MMM", { locale: id })} –{" "}
                {format(checkOut, "dd MMM", { locale: id })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setModalBook(true)}
            >
              {renderPrice(true)}
            </div>
            <Button
              className="rounded-xl! px-6"
              disabled={isLoadingPrice || totalDays === 0}
              onClick={handlePesan}
            >
              Pesan
            </Button>
          </div>
        </div>

        {/* ════ PRICE BREAKDOWN MODAL ════════════════════════════════════════ */}
        <Modal isOpen={modalBook} onClose={() => setModalBook(false)}>
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Rincian Harga</h3>
              {rentable && (
                <p className="mt-0.5 text-sm text-zinc-400">{rentable.name}</p>
              )}
            </div>

            <div className="rounded-xl bg-zinc-50 p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">
                  {totalDays} malam × Rp{" "}
                  {rentable?.base_price.toLocaleString("id-ID")}
                </span>
                <span className="font-medium">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon {discountPercent}%</span>
                  <span>− Rp {totalDiscount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <hr className="border-zinc-200" />
              <div className="flex justify-between font-bold text-zinc-900">
                <span>Total</span>
                <span>Rp {finalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <Button
              className="w-full rounded-xl! md:hidden"
              disabled={isLoadingPrice || totalDays === 0}
              onClick={handlePesan}
            >
              Pesan Sekarang
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
