"use client";

import { differenceInCalendarDays, format } from "date-fns";
import {
  Armchair,
  DoorClosed,
  Drum,
  HouseWifi,
  PenLine,
  WavesLadder,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import DateRangePicker, {
  DateRange,
} from "@/components/shared/date-range-picker/date-range-picker";
import GuestSelector from "@/components/shared/guest-selector/guest-selector";
import Button from "@/components/ui/button/button";
import InputDateRange from "@/components/ui/input-date-range/input-date-range";

import { useFindProperty } from "../hooks/useFindProperty";

import Modal from "@/components/ui/modal/modal";
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
  const [dateRange, setDateRange] = useState<DateRange>({
    start: checkIn,
    end: checkOut,
  });

  const { data, isFetching } = useFindProperty(propertyId);
  const property = data?.data;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const rentableID = useMemo(() => {
    if (!property?.rentable.length) return "";

    const rentableFromProps = property.rentable.find(
      (item) => item.id === rentableId,
    );

    return rentableFromProps?.id ?? property.rentable[0].id;
  }, [property?.rentable, rentableId]);

  const rentable = property?.rentable.find((num) => num.id === rentableID);

  const [modalBook, setModalBook] = useState<boolean>(false);

  useEffect(() => {
    if (!rentableID || rentableID === rentableId) return;

    setParams({
      rentable_id: rentableID,
    });
  }, [rentableID, rentableId, setParams]);

  // ======================
  // Derived State
  // ======================
  const totalDays = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return 0;
    return differenceInCalendarDays(dateRange.end, dateRange.start);
  }, [dateRange.start, dateRange.end]);

  const basePrice = rentable?.base_price ?? 0;

  const totalPrice = useMemo(() => {
    return totalDays * basePrice;
  }, [totalDays, basePrice]);

  const discount = rentable?.discount ?? 0;
  const totalDiscount = useMemo(() => {
    return totalPrice * (discount / 100);
  }, [totalPrice]);

  const fixPrice = useMemo(() => {
    return totalPrice - totalDiscount;
  }, [totalPrice, totalDiscount]);
  const isLoadingPrice = isFetching || !checkIn || !checkOut || !property;

  // ======================
  // Handlers
  // ======================
  const handleDateChange = (value: DateRange) => {
    setDateRange(value);

    setParams({
      check_in: value.start ? format(value.start, "yyyy-MM-dd") : null,
      check_out: value.end ? format(value.end, "yyyy-MM-dd") : null,
    });
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
              Rp. {fixPrice.toLocaleString("id-ID")}
            </p>
          </div>
          {discount > 0 && (
            <p className="text-sm font-medium text-green-600">
              Hemat {discount}% (Rp. {totalDiscount.toLocaleString("id-ID")})
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
          {totalDays} malam di {property?.experience.title}
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
        <DetailImageProperty images={property?.experience.images} />
      </section>

      <div className="flex gap-x-20">
        {/* LEFT CONTENT */}
        <div className="w-full bg-white rounded-t-3xl px-6 py-6 md:px-0">
          {/* TITLE */}
          <h1 className="text-2xl font-medium text-center md:text-left capitalize">
            {property?.experience.title}
          </h1>

          {/* ADDRESS */}
          <div className="text-center mt-3 text-gray-500">
            <p>{property?.experience.address}</p>
            <p className="text-sm">
              10 tamu · 3 kamar · 3 tempat tidur · 4 kamar mandi
            </p>
          </div>

          {/* HOST */}
          <div className="py-4 border-y mt-6 flex gap-4 items-center">
            <Image
              width={44}
              height={44}
              src="https://images.unsplash.com/photo-1723810742992-0e84241abcf5"
              alt="host"
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-medium">Tuan rumah: {property?.host.name}</p>
              <p className="text-sm text-gray-500">
                Host teladan · 10 tahun pengalaman
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <section className="mt-6 border-b pb-6">
            <p className="font-light">{property?.experience.description}</p>
            <Button variant="link">Tampilkan lebih banyak</Button>
          </section>

          {/* FACILITIES */}
          <section className="py-8 border-b" id="amenities">
            <h2 className="text-xl font-semibold">Fasilitas</h2>
            <div className="mt-6 space-y-4">
              <Facility icon={<WavesLadder />} label="Kolam renang" />
              <Facility icon={<HouseWifi />} label="Wifi" />
              <Facility icon={<Armchair />} label="Ruang tamu" />
              <Facility icon={<Drum />} label="Studio musik" />
            </div>
          </section>

          {/* ROOMS */}
          <section className="py-10 border-b" id="rooms">
            <h2 className="text-xl font-semibold mb-6">
              Pilih kamar di {property?.experience.title}
            </h2>
            <RoomList
              selectRentableId={rentableID}
              rentables={property?.rentable ?? []}
            />
          </section>

          {/* CALENDAR */}
          <section className="mt-6 border-b relative z-0 pb-6" id="calendars">
            {renderCalendarHeader()}
            <DateRangePicker value={dateRange} onChange={handleDateChange} />
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
              >
                Pesan
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full fixed bg-white p-5 space-y-2 border-t bottom-0 left-0 md:hidden ">
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
            >
              Pesan
            </Button>
          </div>
        </div>
      </div>

      {/* MAP */}
      <section className="mt-6 border-b pb-6 px-6 md:px-0" id="locations">
        <h2 className="text-xl font-semibold">Lokasi</h2>
        <p className="my-4">{property?.experience.address}</p>

        {/* <MapViewer
          center={[
            property?.experience.lat ?? -7.205,
            property?.experience.lng ?? 109.906,
          ]}
          zoom={12}
          markers={[
            {
              id: "1",
              position: [
                property?.experience.lat ?? -7.205,
                property?.experience.lng ?? 109.906,
              ],
              label: property?.experience.title,
            },
          ]}
        /> */}
      </section>
      {/* Modal Book */}
      <Modal isOpen={modalBook} onClose={() => setModalBook(!modalBook)}>
        <div className="space-y-5">
          <h3 className="text-xl">Perincian Harga</h3>
          <div className="space-y-2 font-light">
            <div className="flex justify-between">
              <p className="text-left">
                {totalDays} malam x Rp.{" "}
                {property?.experience.base_price.toLocaleString("id-ID")}
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
                Rp. {fixPrice.toLocaleString("id-ID")}
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

// ======================
// Small Components
// ======================
function Facility({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
  );
}
