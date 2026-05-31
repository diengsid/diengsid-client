import { addDays } from "date-fns";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { Property } from "../schemas/schema-property";

interface Props {
  property: Property;
}

const PLACEHOLDER = "https://placehold.co/400x400/e5e7eb/9ca3af?text=No+Image";

export default function PropertyItemCard({ property }: Props): React.ReactNode {
  const now = new Date();
  const tomorrow = addDays(now, 1);

  const thumbnail =
    property.thumbnail_url ||
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url ||
    PLACEHOLDER;

  const cheapestRentable = property.rentable?.length
    ? property.rentable.reduce((prev, curr) => {
        const prevFinal = prev.base_price * (1 - (prev.discount ?? 0) / 100);
        const currFinal = curr.base_price * (1 - (curr.discount ?? 0) / 100);
        return currFinal < prevFinal ? curr : prev;
      })
    : null;

  const basePrice = cheapestRentable?.base_price ?? null;
  const discount = cheapestRentable?.discount ?? 0;
  const finalPrice = basePrice != null ? basePrice * (1 - discount / 100) : null;

  const handleClick = () => {
    const url =
      "/penginapan/" +
      property.id +
      "?check_in=" +
      tomorrow.toISOString().split("T")[0] +
      "&check_out=" +
      addDays(tomorrow, 1).toISOString().split("T")[0];

    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    }
  };

  return (
    <div
      className="group flex cursor-pointer flex-col gap-2"
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
        <Image
          fill
          src={thumbnail}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute top-3 right-3">
          <button
            className="rounded-full bg-transparent p-2 text-white transition-colors hover:bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart
              size={24}
              className="fill-black/20 stroke-white transition-colors hover:fill-emerald-500 hover:stroke-emerald-500"
            />
          </button>
        </div>
      </div>

      <div className="mt-1">
        <h3 className="truncate font-semibold text-gray-900">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 text-sm">
        {finalPrice != null ? (
          <>
            {discount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                  -{discount}%
                </span>
                <span className="text-xs text-gray-400 line-through">
                  Rp {basePrice!.toLocaleString("id-ID")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">
                Rp {finalPrice.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-gray-500">/ malam</span>
            </div>
          </>
        ) : (
          <span className="text-xs text-gray-400">Harga belum tersedia</span>
        )}
      </div>
    </div>
  );
}
