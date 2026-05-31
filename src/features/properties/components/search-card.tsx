"use client";

import { addDays, format } from "date-fns";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { Property } from "../schemas/schema-property";

interface Props {
  property: Property;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  checkIn?: string;
  checkOut?: string;
}

const PLACEHOLDER = "https://placehold.co/400x400/e5e7eb/9ca3af?text=No+Image";

export default function SearchPropertyCard({
  property,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  checkIn,
  checkOut,
}: Props): React.ReactNode {
  const thumbnail =
    property.thumbnail_url ||
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url ||
    PLACEHOLDER;

  const minPrice = property.rentable?.length
    ? Math.min(...property.rentable.map((r) => r.base_price))
    : null;

  const now = new Date();
  const ci = checkIn ?? format(addDays(now, 1), "yyyy-MM-dd");
  const co = checkOut ?? format(addDays(now, 2), "yyyy-MM-dd");

  const href = `/properties/${property.id}?check_in=${ci}&check_out=${co}`;

  const handleClick = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        window.open(href, "_blank");
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <div
      className={`flex gap-3 cursor-pointer rounded-2xl p-2 transition-colors duration-150 ${isHovered ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      {/* image */}
      <div className="relative w-32 h-28 md:w-44 md:h-36 shrink-0 rounded-xl overflow-hidden bg-gray-200 group">
        <Image
          fill
          src={thumbnail}
          alt={property.title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <button
          className="absolute top-2 right-2 rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart
            size={18}
            className="fill-black/20 stroke-white hover:fill-rose-500 hover:stroke-rose-500 transition-colors"
          />
        </button>
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col py-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-zinc-400 capitalize">
              {property.property_type}
            </p>
            <h3 className="font-semibold text-zinc-900 truncate leading-snug mt-0.5">
              {property.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-xs text-zinc-600">
            <Star size={12} className="fill-zinc-900 stroke-zinc-900" />
            <span className="font-medium">4.8</span>
          </div>
        </div>

        <p className="mt-1 text-xs md:text-sm text-zinc-500 line-clamp-1 md:line-clamp-2 leading-relaxed">
          {property.address}
        </p>

        {/* {property.description && (
          <p className="hidden md:block mt-1 text-xs text-zinc-400 line-clamp-1">
            {property.description}
          </p>
        )} */}

        <div className="mt-auto pt-2">
          {minPrice != null ? (
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-zinc-900">
                Rp {minPrice.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-zinc-400">/ malam</span>
            </div>
          ) : (
            <span className="text-xs text-zinc-400">Harga belum tersedia</span>
          )}
        </div>
      </div>
    </div>
  );
}
