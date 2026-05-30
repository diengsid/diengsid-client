"use client";

import { CardSkeleton } from "@/features/experiences/components/card-skeleton";
import { Property, SearchPropertyRequest } from "../schemas/schema-property";
import { useGetProperties } from "../hooks/useGetProperties";
import PropertyItemCard from "./item-card";

interface Props {
  search: SearchPropertyRequest;
}

export default function PropertyList({ search }: Props) {
  const { data, isFetching } = useGetProperties(search);
  const skeletonCount = 10;

  return (
    <div className="grid grid-cols-2 px-6 lg:px-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 mt-6">
      {isFetching
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <CardSkeleton key={i} />
          ))
        : !Array.isArray(data?.data) || data.data.length === 0
          ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-base">Tidak ada properti yang ditemukan.</p>
            </div>
          )
          : data.data.map((item: Property) => (
              <PropertyItemCard property={item} key={item.id} />
            ))}
    </div>
  );
}
