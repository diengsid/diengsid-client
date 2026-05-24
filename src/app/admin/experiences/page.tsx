"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExperiences } from "@/features/experiences/services/experience.service";
import { Experience } from "@/features/experiences/schemas/experience-schema";
import { CreateListingWizard } from "@/features/admin/components/create-listing-wizard";
import { Plus, Search, ImageIcon } from "lucide-react";
import Image from "next/image";

const EXPERIENCE_TYPES = ["property", "jeep", "tour", "wisata", "camping"];

function ExperienceCard({ exp }: { exp: Experience }) {
  const primaryImg = exp.images?.find((i) => i.is_primary)?.image_url ?? exp.thumbnail_url;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-custom-sm hover:shadow-custom transition-shadow">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {primaryImg ? (
          <Image fill src={primaryImg} alt={exp.title} className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon size={24} className="text-zinc-300" />
          </div>
        )}
        {exp.images && exp.images.length > 1 && (
          <div className="absolute bottom-0 right-0 rounded-tl-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
            +{exp.images.length - 1}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900">{exp.title}</p>
        <p className="truncate text-xs text-zinc-500">{exp.address}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 capitalize">
            {exp.experience_type}
          </span>
          <span className="text-xs font-medium text-primary-700">
            Rp {exp.base_price.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ExperiencesPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["experiences", {}],
    queryFn: () => getExperiences({}),
  });

  const experiences = data?.data ?? [];

  const filtered = experiences.filter((exp) => {
    const matchSearch =
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.address.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || exp.experience_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Experiences</h1>
          <p className="text-sm text-zinc-500">{experiences.length} listing terdaftar</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition"
        >
          <Plus size={16} />
          Buat Listing
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau alamat..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-700"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-700"
        >
          <option value="all">Semua Tipe</option>
          {EXPERIENCE_TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">{t}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center text-zinc-400">
          Tidak ada experience ditemukan
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exp) => (
            <ExperienceCard key={exp.id} exp={exp} />
          ))}
        </div>
      )}

      {showWizard && <CreateListingWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
