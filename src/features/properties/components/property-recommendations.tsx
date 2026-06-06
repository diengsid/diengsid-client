"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { addDays } from "date-fns";
import { getProperties } from "../services/property-service";
import type { Property } from "../schemas/schema-property";

interface Props {
  currentId: string;
  propertyType?: string;
}

function cheapestFinalPrice(property: Property): { base: number; final: number; discount: number } | null {
  if (!property.rentable?.length) return null;
  const cheapest = property.rentable.reduce((prev, curr) => {
    const prevFinal = prev.base_price * (1 - (prev.discount ?? 0) / 100);
    const currFinal = curr.base_price * (1 - (curr.discount ?? 0) / 100);
    return currFinal < prevFinal ? curr : prev;
  });
  return {
    base: cheapest.base_price,
    final: cheapest.base_price * (1 - (cheapest.discount ?? 0) / 100),
    discount: cheapest.discount ?? 0,
  };
}

export function PropertyRecommendations({ currentId, propertyType }: Props) {
  const tomorrow = addDays(new Date(), 1);

  const { data, isLoading } = useQuery({
    queryKey: ["recommendations", propertyType],
    queryFn: () =>
      getProperties({
        property_type: propertyType || undefined,
        page: 1,
        size: 8,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const recommendations = (data?.data ?? []).filter((p) => p.id !== currentId).slice(0, 6);

  if (!isLoading && recommendations.length === 0) return null;

  return (
    <section id="recommendations">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">
            Penginapan Serupa
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            {propertyType ? `${propertyType} lainnya di Dieng` : "Pilihan penginapan lain di Dieng"}
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
        >
          Lihat semua →
        </Link>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-xl bg-zinc-200" />
              <div className="mt-2 h-4 w-3/4 rounded-lg bg-zinc-200" />
              <div className="mt-1.5 h-3 w-1/2 rounded-lg bg-zinc-200" />
              <div className="mt-1.5 h-3 w-1/3 rounded-lg bg-zinc-200" />
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && (
        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3">
          {recommendations.map((property) => {
            const price = cheapestFinalPrice(property);
            const thumbnail =
              property.thumbnail_url ||
              property.images?.find((img) => img.is_primary)?.image_url ||
              property.images?.[0]?.image_url ||
              null;

            const href =
              `/penginapan/${property.id}` +
              `?check_in=${tomorrow.toISOString().split("T")[0]}` +
              `&check_out=${addDays(tomorrow, 1).toISOString().split("T")[0]}`;

            return (
              <Link
                key={property.id}
                href={href}
                className="group flex flex-col gap-2"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                  {thumbnail ? (
                    <Image
                      fill
                      src={thumbnail}
                      alt={property.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-3xl">
                      🏠
                    </div>
                  )}
                  {property.property_type && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold capitalize text-zinc-700 shadow-sm backdrop-blur-sm">
                      {property.property_type}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <p className="line-clamp-1 font-semibold text-zinc-900 transition group-hover:text-emerald-700">
                    {property.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                    <MapPin size={11} className="shrink-0" />
                    <span className="line-clamp-1">{property.address}</span>
                  </p>
                  {/* rating — hidden until real data is available */}
                </div>

                {/* Price */}
                <div className="text-sm">
                  {price ? (
                    <div className="flex flex-col gap-0.5">
                      {price.discount > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            -{price.discount}%
                          </span>
                          <span className="text-xs text-zinc-400 line-through">
                            Rp {price.base.toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="font-semibold text-zinc-900">
                          Rp {price.final.toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-zinc-400">/ malam</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400">Harga belum tersedia</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
