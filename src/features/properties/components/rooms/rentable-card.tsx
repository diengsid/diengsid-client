import Button from "@/components/ui/button/button";
import { Check, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Rentable } from "../../schemas/schema-property";

interface Props {
  rentable: Rentable;
  selected: boolean;
  onSelect?: () => void;
}

export default function RentableCard({
  rentable,
  selected = false,
  onSelect,
}: Props): React.ReactNode {
  return (
    <div
      className={`w-full border rounded-2xl overflow-hidden transition-all duration-300 
      ${selected ? "border-black shadow-lg" : "border-gray-200 hover:shadow-md"}`}
    >
      {/* IMAGE */}
      <div className="relative w-full h-[180px]">
        <Image
          src={rentable.image_url}
          alt={rentable.name}
          fill
          className="object-cover"
          unoptimized
        />

        {/* Badge */}
        <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs rounded-full shadow">
          {rentable.capacity}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {/* TITLE */}
        <div>
          <h2 className="text-lg font-semibold">{rentable.name}</h2>
          {/* <p className="text-sm text-gray-500">Nyaman & modern</p> */}
        </div>

        {/* FACILITIES */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} />
            {rentable.capacity} tamu
          </div>
          {/* <div className="flex items-center gap-1">
            <BedDouble size={16} />
            {rentable.stock} kasur
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            {rentable.stock} kamar mandi
          </div>
          <div className="flex items-center gap-1">
            <Wifi size={16} />
            Wifi
          </div> */}
        </div>

        {/* PRICE + ACTION */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">
              Rp {rentable.base_price.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-gray-500">/ malam</p>
          </div>

          <Button
            onClick={onSelect}
            size="sm"
            variant={selected ? "outline" : "primary"}
            className="rounded-full px-5"
            prefixIcon={selected && <Check size={17} />}
          >
            {selected ? "Dipilih" : "Pilih kamar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
