"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExperiences } from "@/features/experiences/services/experience.service";
import { CreateListingWizard } from "@/features/admin/components/create-listing-wizard";
import { cn } from "@/lib/utils";
import { Building2, Plus, Search } from "lucide-react";

export default function PropertiesPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [search, setSearch] = useState("");

  const { data: expData, isLoading } = useQuery({
    queryKey: ["experiences", {}],
    queryFn: () => getExperiences({}),
  });

  const experiences = expData?.data ?? [];
  const filtered = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.address.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Properties</h1>
          <p className="text-sm text-zinc-500">Kelola property dan tipe kamar</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition"
        >
          <Plus size={16} />
          Buat Listing Baru
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari property..."
          className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-700 max-w-sm"
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-custom-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="px-5 py-3 text-left font-medium text-zinc-500">Nama</th>
                <th className="px-5 py-3 text-left font-medium text-zinc-500">Tipe</th>
                <th className="px-5 py-3 text-left font-medium text-zinc-500">Alamat</th>
                <th className="px-5 py-3 text-right font-medium text-zinc-500">Harga Dasar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 w-28 animate-pulse rounded bg-zinc-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-zinc-400">
                    <Building2 size={32} className="mx-auto mb-2 text-zinc-200" />
                    Tidak ada property ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-zinc-900">{exp.title}</td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs capitalize text-zinc-600")}>
                        {exp.experience_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 max-w-xs truncate text-zinc-500">{exp.address}</td>
                    <td className="px-5 py-3 text-right font-medium text-zinc-900">
                      Rp {exp.base_price.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showWizard && <CreateListingWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
