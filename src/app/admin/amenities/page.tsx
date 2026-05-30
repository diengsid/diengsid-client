"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAmenities,
  createAmenity,
  AmenityRequest,
  AmenityResponse,
} from "@/features/admin/services/admin-service";
import { Plus, Search, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { ICON_KEYS, AmenityIcon } from "@/features/admin/components/amenity-icon";

const CATEGORIES = ["umum", "kamar", "dapur", "outdoor", "keamanan", "lainnya"];

function CreateModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AmenityRequest>({
    name: "",
    icon: "wifi",
    category: "umum",
  });
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = ICON_KEYS.filter((k) =>
    k.toLowerCase().includes(iconSearch.toLowerCase()),
  );

  const mutation = useMutation({
    mutationFn: createAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-amenities"] });
      toast.success("Amenity berhasil ditambahkan");
      onClose();
    },
    onError: (err: Error) => toast.error(err.message ?? "Gagal menambahkan amenity"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-custom-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 shrink-0">
          <h3 className="font-semibold text-zinc-900">Tambah Amenity</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="space-y-4 p-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/20"
                placeholder="Contoh: Wi-Fi, Kolam Renang, AC"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-600">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary-700 capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600">Icon</label>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Cari icon..."
                  className="w-full rounded-lg border border-zinc-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-primary-700"
                />
              </div>
              <div className="grid grid-cols-7 gap-1.5 max-h-48 overflow-y-auto rounded-lg border border-zinc-100 bg-zinc-50 p-2">
                {filteredIcons.map((key) => (
                  <button
                    key={key}
                    type="button"
                    title={key}
                    onClick={() => setForm((f) => ({ ...f, icon: key }))}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-2 transition",
                      form.icon === key
                        ? "border-primary-700 bg-primary-50 text-primary-700"
                        : "border-transparent bg-white text-zinc-400 hover:border-zinc-200 hover:text-zinc-600",
                    )}
                  >
                    <AmenityIcon icon={key} size={18} />
                    <span className="text-[8px] leading-tight truncate w-full text-center">
                      {key}
                    </span>
                  </button>
                ))}
                {filteredIcons.length === 0 && (
                  <p className="col-span-7 py-4 text-center text-xs text-zinc-400">
                    Icon tidak ditemukan
                  </p>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="mb-3 text-xs font-medium text-zinc-400">Preview</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <AmenityIcon icon={form.icon} size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {form.name || "Nama amenity"}
                  </p>
                  <p className="text-xs text-zinc-400 capitalize">{form.category}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-zinc-100 px-6 py-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 rounded-lg bg-primary-700 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition disabled:opacity-60"
            >
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AmenityItem({ amenity }: { amenity: AmenityResponse }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-custom-sm transition-shadow">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        <AmenityIcon icon={amenity.icon} size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900 truncate">{amenity.name}</p>
        <p className="text-xs text-zinc-400 capitalize">{amenity.category}</p>
      </div>
    </div>
  );
}

export default function AmenitiesPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-amenities"],
    queryFn: getAmenities,
  });

  const amenities: AmenityResponse[] = Array.isArray(data?.data) ? data.data : [];

  const filtered = amenities.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const grouped = CATEGORIES.reduce<Record<string, AmenityResponse[]>>((acc, cat) => {
    const items = filtered.filter((a) => a.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const ungrouped = filtered.filter((a) => !CATEGORIES.includes(a.category));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Amenities</h1>
          <p className="text-sm text-zinc-500">{amenities.length} amenity terdaftar</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari amenity..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-700"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-700"
        >
          <option value="all">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center">
          <Sparkles size={32} className="mx-auto mb-2 text-zinc-200" />
          <p className="text-zinc-400">Tidak ada amenity ditemukan</p>
        </div>
      ) : categoryFilter !== "all" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AmenityItem key={a.id} amenity={a} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 capitalize">
                {cat}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => (
                  <AmenityItem key={a.id} amenity={a} />
                ))}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Lainnya
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ungrouped.map((a) => (
                  <AmenityItem key={a.id} amenity={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
