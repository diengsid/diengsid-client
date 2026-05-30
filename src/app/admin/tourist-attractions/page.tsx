"use client";

import { RichTextEditor } from "@/features/admin/components/rich-text-editor";
import { SingleImageUploader } from "@/features/admin/components/single-image-uploader";
import {
  AttractionCreateRequest,
  AttractionResponse,
  createAttraction,
  getAttractions,
} from "@/features/admin/services/attraction-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, MapPin, Plus, Search, X } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";

const MapPicker = dynamic(
  () => import("@/components/shared/map-picker/MapPicker"),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-xl bg-zinc-100" /> },
);

const CATEGORIES = ["alam", "budaya", "kuliner", "religi", "petualangan", "hiburan"];

const CATEGORY_LABEL: Record<string, string> = {
  alam: "Alam",
  budaya: "Budaya",
  kuliner: "Kuliner",
  religi: "Religi",
  petualangan: "Petualangan",
  hiburan: "Hiburan",
};

function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ── Create Modal ──────────────────────────────────────────────────────────────

function CreateModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AttractionCreateRequest>({
    name: "",
    slug: "",
    description: "",
    address: "",
    category: "",
    image_url: "",
    latitude: undefined,
    longitude: undefined,
  });
  const [geocoding, setGeocoding] = useState(false);

  const mutation = useMutation({
    mutationFn: createAttraction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attractions"] });
      toast.success("Atraksi wisata berhasil dibuat");
      onClose();
    },
    onError: () => toast.error("Gagal membuat atraksi wisata"),
  });

  const setField = <K extends keyof AttractionCreateRequest>(
    key: K,
    val: AttractionCreateRequest[K],
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "name" && typeof val === "string") {
        next.slug = toSlug(val);
      }
      return next;
    });
  };

  const handleMapPick = async (lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, lat, lng, latitude: lat, longitude: lng, address: "" }));
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "id" } },
      );
      const data = await res.json();
      setForm((prev) => ({ ...prev, address: data.display_name ?? "" }));
    } catch {
      // user can fill address manually
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Nama dan slug wajib diisi");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="font-semibold text-zinc-900">Tambah Atraksi Wisata</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Gambar */}
          <SingleImageUploader
            label="Gambar"
            value={form.image_url ?? ""}
            onChange={(url) => setField("image_url", url)}
          />

          {/* Nama + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Telaga Warna"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-700"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="telaga-warna"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-primary-700"
              />
            </div>
          </div>

          {/* Deskripsi — Rich Text */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Deskripsi
            </label>
            <RichTextEditor
              value={form.description ?? ""}
              onChange={(html) => setField("description", html)}
              placeholder="Tulis deskripsi lengkap atraksi wisata ini..."
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Kategori
            </label>
            <select
              value={form.category ?? ""}
              onChange={(e) => setField("category", e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-700"
            >
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c] ?? c}
                </option>
              ))}
            </select>
          </div>

          {/* Lokasi — MapPicker */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-600">
              Lokasi
            </label>
            <MapPicker
              value={
                form.latitude != null && form.longitude != null
                  ? { lat: form.latitude, lng: form.longitude }
                  : null
              }
              onChange={handleMapPick}
              loading={geocoding}
              height="260px"
            />
            {/* Address — auto-filled by reverse geocoding, still editable */}
            <input
              value={form.address ?? ""}
              onChange={(e) => setField("address", e.target.value)}
              placeholder={geocoding ? "Mengambil alamat..." : "Alamat akan terisi otomatis"}
              disabled={geocoding}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-700 disabled:text-zinc-400"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 transition disabled:opacity-60"
            >
              {mutation.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function AttractionCard({ a }: { a: AttractionResponse }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-custom-sm hover:shadow-custom transition-shadow">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {a.image_url ? (
          <Image
            fill
            src={a.image_url}
            alt={a.name}
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon size={20} className="text-zinc-300" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900 truncate">{a.name}</p>
        {a.address && (
          <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
            <MapPin size={10} className="shrink-0" />
            {a.address}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          {a.category && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs capitalize text-zinc-600">
              {CATEGORY_LABEL[a.category] ?? a.category}
            </span>
          )}
          <span className="font-mono text-xs text-zinc-400">{a.slug}</span>
        </div>
        {a.description && (
          <p
            className="mt-1.5 text-xs text-zinc-500 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: a.description?.replace(/<[^>]*>/g, "") ?? "" }}
          />
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TouristAttractionsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["attractions"],
    queryFn: getAttractions,
  });

  const attractions = Array.isArray(data?.data) ? data.data : [];
  const filtered = attractions.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.address ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryFilter === "all" || a.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Tourist Attractions</h1>
          <p className="text-sm text-zinc-500">
            {attractions.length} atraksi wisata terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition"
        >
          <Plus size={16} />
          Tambah Atraksi
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-700"
        >
          <option value="all">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c] ?? c}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-16 text-center text-zinc-400">
          Tidak ada atraksi wisata ditemukan
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AttractionCard key={a.id} a={a} />
          ))}
        </div>
      )}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
