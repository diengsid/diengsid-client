/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { AmenityIcon } from "@/features/admin/components/amenity-icon";
import { format } from "date-fns";
import { DoorClosed, PenLine } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import GuestSelector from "@/components/shared/guest-selector/guest-selector";
import Button from "@/components/ui/button/button";
import InputDateRange from "@/components/ui/input-date-range/input-date-range";

import { useAvailability } from "../hooks/useAvailability";
import { useFindProperty } from "../hooks/useFindProperty";
import type { Amenity } from "../schemas/schema-property";

import Modal from "@/components/ui/modal/modal";
import { useBookingCalculation } from "@/hooks/use-booking-calculation";
import { useQueryParams } from "@/hooks/use-query-params";
import { scrollToId } from "@/lib/utils";
import { id } from "date-fns/locale";
import DetailImageProperty from "./detail-image";
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
  const rentableID = useMemo(() => {
    if (!property?.rentable.length) return "";

    const rentableFromProps = property.rentable.find(
      (item) => item.id === rentableId,
    );

    return rentableFromProps?.id ?? property.rentable[0].id;
  }, [property?.rentable, rentableId]);

  const rentable = property?.rentable?.find((num) => num.id === rentableID);

  const { disabledDates } = useAvailability(rentableID);

  console.log(disabledDates);
  // Ganti semua kalkulasi manual dengan hook ini
  const {
    totalDays,
    basePrice,
    totalPrice,
    totalDiscount,
    finalPrice,
    pricePerNight,
    discountPercent,
    hasDiscount,
    isReady,
  } = useBookingCalculation({ dateRange, rentable });

  const [modalBook, setModalBook] = useState<boolean>(false);

  useEffect(() => {
    if (!rentableID || rentableID === rentableId) return;

    setParams({
      rentable_id: rentableID,
    });
  }, [rentableID, rentableId, setParams]);

  const isLoadingPrice = isFetching || !property || !isReady;

  if (isFetching && !property) {
    return (
      <div className="max-w-6xl mx-auto w-full animate-pulse">
        {/* image skeleton */}
        <div className="relative aspect-square md:hidden rounded-2xl bg-zinc-200" />
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 w-full h-113 mt-10">
          <div className="row-span-2 col-span-2 rounded-l-2xl bg-zinc-200" />
          <div className="bg-zinc-200" />
          <div className="rounded-tr-2xl bg-zinc-200" />
          <div className="bg-zinc-200" />
          <div className="rounded-br-2xl bg-zinc-200" />
        </div>

        <div className="flex gap-x-20 mt-6 px-6 md:px-0">
          {/* left skeleton */}
          <div className="w-full space-y-6">
            {/* title */}
            <div className="h-7 w-2/3 rounded-lg bg-zinc-200" />
            {/* address */}
            <div className="h-4 w-1/3 rounded-lg bg-zinc-200" />

            {/* host */}
            <div className="flex items-center gap-4 border-y py-4">
              <div className="h-11 w-11 rounded-full bg-zinc-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-40 rounded-lg bg-zinc-200" />
                <div className="h-3 w-56 rounded-lg bg-zinc-200" />
              </div>
            </div>

            {/* description */}
            <div className="space-y-2 border-b pb-6">
              <div className="h-3 w-full rounded-lg bg-zinc-200" />
              <div className="h-3 w-5/6 rounded-lg bg-zinc-200" />
              <div className="h-3 w-4/6 rounded-lg bg-zinc-200" />
            </div>

            {/* amenities */}
            <div className="border-b pb-8 space-y-4">
              <div className="h-5 w-24 rounded-lg bg-zinc-200" />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-zinc-200 shrink-0" />
                    <div className="h-3 w-20 rounded-lg bg-zinc-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* rooms */}
            <div className="border-b pb-10 space-y-4">
              <div className="h-5 w-40 rounded-lg bg-zinc-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-zinc-200" />
                ))}
              </div>
            </div>
          </div>

          {/* right sidebar skeleton */}
          <div className="hidden md:block mt-10 shrink-0">
            <div className="w-[350px] rounded-2xl border border-zinc-100 p-7 space-y-4">
              <div className="h-6 w-40 rounded-lg bg-zinc-200" />
              <div className="h-4 w-24 rounded-lg bg-zinc-200" />
              <div className="h-12 w-full rounded-xl bg-zinc-200" />
              <div className="h-12 w-full rounded-xl bg-zinc-200" />
              <div className="h-11 w-full rounded-full bg-zinc-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

    router.push(`/book/properties/${propertyId}?${queryParams.toString()}`);
  };

  // ======================
  // Render Helpers
  // ======================
  const renderPrice = () => {
    if (isLoadingPrice || totalDays === 0 || !rentable) {
      return (
        <p className="text-sm md:text-md font-medium">
          Tambahkan tanggal dan kamar untuk melihat harga
        </p>
      );
    }
    return (
      <div className="flex flex-col md:items-start gap-1">
        <div className="flex md:flex-col items-center md:items-start gap-2 flex-wrap">
          <div className="flex gap-2 items-center">
            <p className="text-md md:text-lg line-through font-normal text-zinc-700">
              Rp. {totalPrice.toLocaleString("id-ID")}
            </p>
            <p className="text-md md:text-lg underline font-semibold">
              Rp. {finalPrice.toLocaleString("id-ID")}
            </p>
          </div>
          {hasDiscount && (
            <p className="text-sm font-medium text-green-600">
              Hemat {discountPercent}% (Rp.{" "}
              {totalDiscount.toLocaleString("id-ID")})
            </p>
          )}
        </div>
        <p className="text-gray-500 text-md font-light">
          Untuk {totalDays} malam
        </p>
      </div>
    );
  };

  const renderCalendarHeader = () => {
    if (totalDays === 0) {
      return (
        <h2 className="text-xl font-semibold">
          {checkOut === null
            ? "Pilih tanggal check-out"
            : "Pilih tanggal check-in dan check-out"}
        </h2>
      );
    }

    return (
      <>
        <h2 className="text-xl font-semibold">
          {totalDays} malam di {property?.title}
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          {format(checkIn!, "EEEE, dd MMMM yyyy", { locale: id })} -{" "}
          {format(checkOut!, "EEEE, dd MMMM yyyy", { locale: id })}
        </p>
      </>
    );
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Images */}
      <section id="photos">
        <DetailImageProperty images={property?.images} />
      </section>

      <div className="flex gap-x-20">
        {/* LEFT CONTENT */}
        <div className="w-full bg-white rounded-t-3xl px-6 py-6 md:px-0">
          {/* TITLE */}
          <h1 className="text-2xl font-medium text-center md:text-left capitalize">
            {property?.title}
          </h1>

          {/* ADDRESS */}
          <div className="text-center md:text-left mt-3 text-gray-500">
            <p>{property?.address}</p>
            {/* <p className="text-sm">
              10 tamu · 3 kamar · 3 tempat tidur · 4 kamar mandi
            </p> */}
          </div>

          {/* HOST */}
          <div className="py-4 border-y mt-6 flex gap-4 items-center">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
              <Image
                width={44}
                height={44}
                src={property?.host?.profile_picture_url || "/host_avatar.png"}
                alt="host"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">Tuan rumah: {property?.host?.name}</p>
              <p className="text-sm text-gray-500">
                Host teladan · beberapa tahun pengalaman
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <section className="mt-6 border-b pb-6">
            <p className="font-light">{property?.description}</p>
            <Button variant="link">Tampilkan lebih banyak</Button>
          </section>

          {/* FACILITIES */}
          {(property?.amenities?.length ?? 0) > 0 && (
            <section className="py-8 border-b" id="amenities">
              <h2 className="text-xl font-semibold">Fasilitas</h2>
              <div className="mt-6 space-y-6">
                {Object.entries(
                  (property?.amenities ?? []).reduce<Record<string, Amenity[]>>(
                    (acc, a) => {
                      const cat = a.category?.trim() || "Lainnya";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(a);
                      return acc;
                    },
                    {},
                  ),
                ).map(([category, items]) => (
                  <div key={category}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 capitalize">
                      {category}
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {items!.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                            <AmenityIcon icon={amenity.icon ?? ""} size={18} />
                          </div>
                          <span className="text-sm">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ROOMS */}
          <section className="py-10 border-b" id="rooms">
            <h2 className="text-xl font-semibold mb-6">
              Pilih kamar di {property?.title}
            </h2>
            <RoomList
              selectRentableId={rentableID}
              rentables={property?.rentable ?? []}
            />
          </section>

          {/* CALENDAR */}
          <section className="mt-6 border-b relative z-0 pb-6" id="calendars">
            {renderCalendarHeader()}
            <DateRangePicker
              value={dateRange}
              onChange={handleDateChange}
              disabledDates={disabledDates}
            />
          </section>
        </div>

        {/* RIGHT BOOKING */}
        <div className="hidden md:block mt-10">
          <div className="w-[350px] shadow-custom-lg rounded-2xl p-7 sticky top-24">
            <div
              className="cursor-pointer"
              onClick={() => setModalBook(!modalBook)}
            >
              {renderPrice()}
            </div>

            <div className="mt-5 space-y-6">
              <InputDateRange value={dateRange} onChange={handleDateChange} />

              <GuestSelector />

              <div className="flex border p-3 rounded-lg justify-between">
                <div className="flex items-center gap-2">
                  <DoorClosed size={20} />
                  {rentable ? rentable.name : "Pilih kamar"}
                </div>

                <Button
                  variant="ghost"
                  className="bg-zinc-100"
                  size="sm"
                  onClick={() => scrollToId("rooms")}
                >
                  <PenLine size={16} />
                </Button>
              </div>

              <Button
                className="w-full rounded-full!"
                disabled={isLoadingPrice || totalDays === 0}
                onClick={handlePesan}
              >
                Pesan
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full fixed bg-white p-5 space-y-2 border-t bottom-0 left-0 md:hidden z-[1000]">
          <div
            className="flex items-center gap-1 flex-wrap border-b"
            onClick={() => scrollToId("rooms")}
          >
            <p className="text-sm mb-3">
              <span className="font-semibold underline">
                {rentable ? rentable.name : "Pilih kamar"}
              </span>{" "}
              <span className="font-light text-zinc-600">
                {checkIn && checkOut && totalDays > 0 && (
                  <>
                    ({format(checkIn!, "dd MMM yyyy", { locale: id })} -{" "}
                    {format(checkOut!, "dd MMM yyyy", { locale: id })})
                  </>
                )}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className="w-[450] text-left flex flex-col"
              onClick={() => setModalBook(!modalBook)}
            >
              <div>{renderPrice()} </div>
            </div>

            <Button
              className="w-full rounded-full!"
              disabled={isLoadingPrice || totalDays === 0}
              onClick={handlePesan}
            >
              Pesan
            </Button>
          </div>
        </div>
      </div>

      {/* MAP */}
      <section className="mt-6 border-b pb-6 px-6 md:px-0" id="locations">
        <h2 className="text-xl font-semibold">Lokasi</h2>
        <p className="my-4">{property?.address}</p>

        <MapViewer
          center={[property?.lat ?? -7.205, property?.lng ?? 109.906]}
          zoom={14}
          markers={[
            {
              id: "1",
              position: [property?.lat ?? -7.205, property?.lng ?? 109.906],
              label: property?.title,
            },
          ]}
        />
      </section>
      {/* Modal Book */}
      <Modal isOpen={modalBook} onClose={() => setModalBook(!modalBook)}>
        <div className="space-y-5">
          <h3 className="text-xl">Perincian Harga</h3>
          <div className="space-y-2 font-light">
            <div className="flex justify-between">
              <p className="text-left">
                {totalDays} malam x Rp.{" "}
                {rentable?.base_price.toLocaleString("id-ID")}
              </p>
              <p className="text-right">
                Rp. {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-left">Diskon menginap</p>
              <p className="text-right text-green-800">
                - Rp. {totalDiscount.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex justify-between font-semibold">
              <p className="text-left">Harta setalah diskon</p>
              <p className="text-right ">
                Rp. {finalPrice.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <hr />
          <Button
            className="w-full rounded-full! md:hidden"
            disabled={isLoadingPrice || totalDays === 0}
          >
            Pesan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
