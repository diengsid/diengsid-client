"use client";

import { CreateListingWizard } from "@/features/admin/components/create-listing-wizard";
import { Property } from "@/features/properties/schemas/schema-property";
import { getProperties } from "@/features/properties/services/property-service";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Building2, ImageIcon, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const PROPERTY_TYPES = [
  "villa",
  "homestay",
  "hotel",
  "glamping",
  "cottage",
  "guesthouse",
];

function PropertyRow({ property: p }: { property: Property }) {
  const minPrice = p.rentable?.length
    ? Math.min(...p.rentable.map((r) => r.base_price))
    : null;

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
            {p.thumbnail_url ? (
              <Image
                fill
                src={p.thumbnail_url}
                alt={p.title}
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon size={16} className="text-zinc-300" />
              </div>
            )}
          </div>
          <span className="font-medium text-zinc-900 line-clamp-1">
            {p.title}
          </span>
        </div>
      </td>
      <td className="px-5 py-3">
        <span
          className={cn(
            "rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs capitalize text-zinc-600",
          )}
        >
          {p.property_type}
        </span>
      </td>
      <td className="px-5 py-3 max-w-xs truncate text-zinc-500">
        {p.address}
      </td>
      <td className="px-5 py-3 text-center text-zinc-600">
        {p.rentable?.length ?? 0}
      </td>
      <td className="px-5 py-3 text-right font-medium text-zinc-900">
        {minPrice !== null
          ? `Rp ${minPrice.toLocaleString("id-ID")}`
          : "-"}
      </td>
    </tr>
  );
}

export default function PropertiesPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["properties", { page: 1, size: 200 }],
    queryFn: () => getProperties({ page: 1, size: 200 }),
  });

  const properties = data?.data ?? [];

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "all" || p.property_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Properties</h1>
          <p className="text-sm text-zinc-500">
            {properties.length} property terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition"
        >
          <Plus size={16} />
          Buat Listing Baru
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau alamat..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-700"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-700"
        >
          <option value="all">Semua Tipe</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-custom-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="px-5 py-3 text-left font-medium text-zinc-500">
                  Nama
                </th>
                <th className="px-5 py-3 text-left font-medium text-zinc-500">
                  Tipe
                </th>
                <th className="px-5 py-3 text-left font-medium text-zinc-500">
                  Alamat
                </th>
                <th className="px-5 py-3 text-center font-medium text-zinc-500">
                  Kamar
                </th>
                <th className="px-5 py-3 text-right font-medium text-zinc-500">
                  Harga Mulai
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 w-28 animate-pulse rounded bg-zinc-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-zinc-400"
                  >
                    <Building2
                      size={32}
                      className="mx-auto mb-2 text-zinc-200"
                    />
                    Tidak ada property ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((p) => <PropertyRow key={p.id} property={p} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showWizard && (
        <CreateListingWizard onClose={() => setShowWizard(false)} />
      )}
    </div>
  );
}
