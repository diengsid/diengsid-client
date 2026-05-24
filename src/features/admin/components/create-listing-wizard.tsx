"use client";

import {
  createExperience,
  createProperty,
  createRentable,
  ExperienceImageInput,
  getAmenities,
  HostCreateRequest,
  uploadImages,
} from "@/features/admin/services/admin-service";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Hash,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AmenityIcon } from "./amenity-icon";
import { ImageUploader, UploadedImage } from "./image-uploader";

// ─── constants ────────────────────────────────────────────────────────────────

const EXPERIENCE_TYPES = ["property", "jeep", "tour", "wisata", "camping"];
const PROPERTY_TYPES = ["homestay", "villa", "cottage", "glamping", "hotel"];
const BOOKING_TYPES = ["room", "unit"];
const RENTABLE_TYPES = ["room", "cottage", "villa", "tent"];

const inputCls =
  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700/20";
const labelCls = "text-xs font-medium text-zinc-600";

// ─── types ────────────────────────────────────────────────────────────────────

type HostMode = "new" | "existing";

type ExpData = {
  title: string;
  address: string;
  description: string;
  experience_type: string;
  base_price: number;
  images: UploadedImage[];
};

type PropData = {
  property_type: string;
  booking_type: string;
  host_mode: HostMode;
  host_id: string;
  host: HostCreateRequest;
  amenity_ids: string[];
};

type RentableRow = {
  name: string;
  type: string;
  capacity: number;
  base_price: number;
  discount: number;
  stock: number;
  image_url: string;
  amenity_ids: string[];
};

// ─── step indicator ───────────────────────────────────────────────────────────

const STEPS = ["Experience", "Property", "Kamar/Unit"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 px-6 py-4 border-b border-zinc-100">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition",
                  done && "bg-primary-700 text-white",
                  active &&
                    "bg-primary-700 text-white ring-4 ring-primary-700/20",
                  !done && !active && "bg-zinc-100 text-zinc-400",
                )}
              >
                {done ? <Check size={13} /> : idx}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap",
                  active ? "text-primary-700" : "text-zinc-400",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 mx-2 mb-4",
                  done ? "bg-primary-700" : "bg-zinc-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── rentable image uploader ──────────────────────────────────────────────────

function RentableImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        const urls = await uploadImages([files[0]]);
        onChange(urls[0]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal upload gambar");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-1">
      <label className={labelCls}>Foto Kamar/Unit</label>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className="relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-primary-400 hover:bg-primary-50/30"
      >
        {value ? (
          <Image
            fill
            src={value}
            alt="preview"
            className="object-cover"
            unoptimized
          />
        ) : uploading ? (
          <Loader2 size={22} className="animate-spin text-primary-700" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-zinc-400">
            <Upload size={20} />
            <span className="text-[10px]">Upload</span>
          </div>
        )}
        {value && !uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
            <ImageIcon size={18} className="text-white" />
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />
    </div>
  );
}

// ─── amenity chip picker ──────────────────────────────────────────────────────

function AmenityPicker({
  amenities,
  selected,
  onChange,
}: {
  amenities: { id: string; name: string; icon: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) =>
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );

  if (amenities.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className={labelCls}>Amenities</label>
      <div className="flex flex-wrap gap-2">
        {amenities.map((a) => {
          const on = selected.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
                on
                  ? "border-primary-700 bg-primary-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-primary-700 hover:text-primary-700",
              )}
            >
              <AmenityIcon icon={a.icon} size={11} />
              {a.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── main wizard ──────────────────────────────────────────────────────────────

export function CreateListingWizard({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: amenityData } = useQuery({
    queryKey: ["amenities"],
    queryFn: getAmenities,
  });
  const amenities = amenityData?.data ?? [];

  // ── step state ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);

  // ── step 1: experience ─────────────────────────────────────────────────────
  const [exp, setExp] = useState<ExpData>({
    title: "",
    address: "",
    description: "",
    experience_type: "property",
    base_price: 0,
    images: [],
  });

  // ── step 2: property ───────────────────────────────────────────────────────
  const [prop, setProp] = useState<PropData>({
    property_type: "homestay",
    booking_type: "room",
    host_mode: "new",
    host_id: "",
    host: {
      name: "",
      email: "",
      phone_number: "",
      profile_picture_url: "",
      address: "",
      bank_account_name: "",
      bank_account_number: "",
      ktp_number: "",
      bio: "",
    },
    amenity_ids: [],
  });

  // ── step 3: rentables ──────────────────────────────────────────────────────
  const [rentables, setRentables] = useState<RentableRow[]>([
    {
      name: "",
      type: "room",
      capacity: 2,
      base_price: 0,
      discount: 0,
      stock: 1,
      amenity_ids: [],
      image_url: "",
    },
  ]);

  const setRentable = (idx: number, patch: Partial<RentableRow>) =>
    setRentables((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
    );

  const isUnit = prop.booking_type === "unit";

  const addRentable = () => {
    if (isUnit) return;
    setRentables((prev) => [
      ...prev,
      {
        name: "",
        type: "room",
        capacity: 2,
        base_price: 0,
        discount: 0,
        stock: 1,
        amenity_ids: [],
        image_url: "",
      },
    ]);
  };

  const removeRentable = (idx: number) =>
    setRentables((prev) => prev.filter((_, i) => i !== idx));

  // ── validation ─────────────────────────────────────────────────────────────
  const canAdvanceStep1 =
    exp.title.trim() &&
    exp.address.trim() &&
    exp.description.trim() &&
    exp.base_price > 0;

  const canAdvanceStep2 =
    prop.host_mode === "existing"
      ? prop.host_id.trim() !== ""
      : prop.host.name.trim() &&
        prop.host.email.trim() &&
        prop.host.phone_number.trim();

  // ── submission ─────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const hasValidRentable = rentables.some(
      (r) => r.name.trim() && r.base_price > 0,
    );
    if (!hasValidRentable) {
      toast.error("Tambahkan minimal satu kamar/unit dengan nama dan harga");
      return;
    }

    setSubmitting(true);
    try {
      // 1. create experience
      const primaryImg = exp.images.find((i) => i.is_primary);
      const imageInputs: ExperienceImageInput[] = exp.images.map((img) => ({
        image_url: img.url,
        is_primary: img.is_primary,
      }));
      const expRes = await createExperience({
        title: exp.title,
        address: exp.address,
        description: exp.description,
        experience_type: exp.experience_type,
        base_price: exp.base_price,
        thumbnail_url: primaryImg?.url,
        images: imageInputs,
      });
      const experienceId = expRes.data.id;

      // 2. create property
      const propPayload =
        prop.host_mode === "existing"
          ? {
              experience_id: experienceId,
              host_id: prop.host_id,
              property_type: prop.property_type,
              booking_type: prop.booking_type,
              amenity_ids:
                prop.amenity_ids.length > 0 ? prop.amenity_ids : undefined,
            }
          : {
              experience_id: experienceId,
              host: prop.host,
              property_type: prop.property_type,
              booking_type: prop.booking_type,
              amenity_ids:
                prop.amenity_ids.length > 0 ? prop.amenity_ids : undefined,
            };
      const propRes = await createProperty(propPayload);
      const propertyId = propRes.data.id;

      // 3. create rentables
      const validRentables = rentables.filter(
        (r) => r.name.trim() && r.base_price > 0,
      );
      for (const r of validRentables) {
        await createRentable({
          property_id: propertyId,
          type: r.type,
          name: r.name,
          image_url: r.image_url || undefined,
          capacity: r.capacity,
          base_price: r.base_price,
          discount: r.discount,
          stock: r.stock,
          amenity_ids: r.amenity_ids.length > 0 ? r.amenity_ids : undefined,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Listing berhasil dibuat!");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat listing");
    } finally {
      setSubmitting(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
      <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-custom-lg max-h-[92vh]">
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
          <h3 className="font-semibold text-zinc-900">Buat Listing Baru</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"
          >
            <X size={18} />
          </button>
        </div>

        <StepIndicator current={step} />

        {/* body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* ─ step 1 ─ */}
          {step === 1 && (
            <>
              <div className="space-y-1">
                <label className={labelCls}>Gambar</label>
                <ImageUploader
                  images={exp.images}
                  onChange={(imgs) => setExp((e) => ({ ...e, images: imgs }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className={labelCls}>
                    Judul <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={exp.title}
                    onChange={(e) =>
                      setExp((s) => ({ ...s, title: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Nama experience"
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>Tipe</label>
                  <select
                    value={exp.experience_type}
                    onChange={(e) =>
                      setExp((s) => ({ ...s, experience_type: e.target.value }))
                    }
                    className={inputCls}
                  >
                    {EXPERIENCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelCls}>
                    Harga Dasar (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={exp.base_price}
                    onChange={(e) =>
                      setExp((s) => ({
                        ...s,
                        base_price: Number(e.target.value),
                      }))
                    }
                    className={inputCls}
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className={labelCls}>
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={exp.address}
                    onChange={(e) =>
                      setExp((s) => ({ ...s, address: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Alamat lengkap"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className={labelCls}>
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) =>
                      setExp((s) => ({ ...s, description: e.target.value }))
                    }
                    className={cn(inputCls, "resize-none")}
                    placeholder="Deskripsi experience"
                  />
                </div>
              </div>
            </>
          )}

          {/* ─ step 2 ─ */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Tipe Property</label>
                  <select
                    value={prop.property_type}
                    onChange={(e) =>
                      setProp((s) => ({ ...s, property_type: e.target.value }))
                    }
                    className={inputCls}
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Tipe Booking</label>
                  <select
                    value={prop.booking_type}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProp((s) => ({ ...s, booking_type: val }));
                      if (val === "unit") setRentables((r) => r.slice(0, 1));
                    }}
                    className={inputCls}
                  >
                    {BOOKING_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <AmenityPicker
                amenities={amenities}
                selected={prop.amenity_ids}
                onChange={(ids) => setProp((s) => ({ ...s, amenity_ids: ids }))}
              />

              {/* host */}
              <div className="space-y-3">
                <label className={labelCls}>Host</label>
                <div className="flex rounded-lg border border-zinc-200 p-1 gap-1">
                  {(["new", "existing"] as HostMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setProp((s) => ({ ...s, host_mode: mode }))
                      }
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition",
                        prop.host_mode === mode
                          ? "bg-primary-700 text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-700",
                      )}
                    >
                      {mode === "new" ? (
                        <>
                          <UserPlus size={13} /> Buat host baru
                        </>
                      ) : (
                        <>
                          <Hash size={13} /> Gunakan host ID
                        </>
                      )}
                    </button>
                  ))}
                </div>

                {prop.host_mode === "existing" ? (
                  <div className="space-y-1">
                    <label className={labelCls}>
                      Host ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={prop.host_id}
                      onChange={(e) =>
                        setProp((s) => ({ ...s, host_id: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="UUID host yang sudah ada"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Data Host Baru
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelCls}>
                          Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={prop.host.name}
                          onChange={(e) =>
                            setProp((s) => ({
                              ...s,
                              host: { ...s.host, name: e.target.value },
                            }))
                          }
                          className={inputCls}
                          placeholder="Nama lengkap"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>
                          No. Telepon <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={prop.host.phone_number}
                          onChange={(e) =>
                            setProp((s) => ({
                              ...s,
                              host: { ...s.host, phone_number: e.target.value },
                            }))
                          }
                          className={inputCls}
                          placeholder="+62..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={prop.host.email}
                        onChange={(e) =>
                          setProp((s) => ({
                            ...s,
                            host: { ...s.host, email: e.target.value },
                          }))
                        }
                        className={inputCls}
                        placeholder="email@contoh.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelCls}>Alamat</label>
                        <input
                          value={prop.host.address}
                          onChange={(e) =>
                            setProp((s) => ({
                              ...s,
                              host: { ...s.host, address: e.target.value },
                            }))
                          }
                          className={inputCls}
                          placeholder="Alamat host"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>No. KTP</label>
                        <input
                          value={prop.host.ktp_number}
                          maxLength={16}
                          onChange={(e) =>
                            setProp((s) => ({
                              ...s,
                              host: { ...s.host, ktp_number: e.target.value },
                            }))
                          }
                          className={inputCls}
                          placeholder="16 digit NIK"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelCls}>Nama Rekening</label>
                        <input
                          value={prop.host.bank_account_name}
                          onChange={(e) =>
                            setProp((s) => ({
                              ...s,
                              host: {
                                ...s.host,
                                bank_account_name: e.target.value,
                              },
                            }))
                          }
                          className={inputCls}
                          placeholder="Atas nama rekening"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>No. Rekening</label>
                        <input
                          value={prop.host.bank_account_number}
                          onChange={(e) =>
                            setProp((s) => ({
                              ...s,
                              host: {
                                ...s.host,
                                bank_account_number: e.target.value,
                              },
                            }))
                          }
                          className={inputCls}
                          placeholder="Nomor rekening"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Bio</label>
                      <textarea
                        rows={2}
                        value={prop.host.bio}
                        onChange={(e) =>
                          setProp((s) => ({
                            ...s,
                            host: { ...s.host, bio: e.target.value },
                          }))
                        }
                        className={cn(inputCls, "resize-none")}
                        placeholder="Deskripsi singkat host"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─ step 3 ─ */}
          {step === 3 && (
            <div className="space-y-4">
              {rentables.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-200 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Unit {idx + 1}
                    </p>
                    {rentables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRentable(idx)}
                        className="rounded-lg p-1 text-red-400 hover:bg-red-50 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={labelCls}>
                        Nama <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={r.name}
                        onChange={(e) =>
                          setRentable(idx, { name: e.target.value })
                        }
                        className={inputCls}
                        placeholder="Nama kamar/unit"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Tipe</label>
                      <select
                        value={r.type}
                        onChange={(e) =>
                          setRentable(idx, { type: e.target.value })
                        }
                        className={inputCls}
                      >
                        {RENTABLE_TYPES.map((t) => (
                          <option key={t} value={t} className="capitalize">
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className={labelCls}>Kapasitas</label>
                      <input
                        type="number"
                        min={1}
                        value={r.capacity}
                        onChange={(e) =>
                          setRentable(idx, { capacity: Number(e.target.value) })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>
                        Harga (Rp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={r.base_price}
                        onChange={(e) =>
                          setRentable(idx, {
                            base_price: Number(e.target.value),
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Diskon (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={r.discount}
                        onChange={(e) =>
                          setRentable(idx, { discount: Number(e.target.value) })
                        }
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Stok</label>
                      <input
                        type="number"
                        min={1}
                        value={r.stock}
                        onChange={(e) =>
                          setRentable(idx, { stock: Number(e.target.value) })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <RentableImageUploader
                    value={r.image_url}
                    onChange={(url) => setRentable(idx, { image_url: url })}
                  />

                  <AmenityPicker
                    amenities={amenities}
                    selected={r.amenity_ids}
                    onChange={(ids) => setRentable(idx, { amenity_ids: ids })}
                  />
                </div>
              ))}

              {isUnit ? (
                <p className="text-center text-xs text-zinc-400 py-2">
                  Tipe booking <strong>unit</strong> hanya boleh 1 kamar/unit
                </p>
              ) : (
                <button
                  type="button"
                  onClick={addRentable}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 py-3 text-sm text-zinc-500 hover:border-primary-400 hover:text-primary-700 transition"
                >
                  <Plus size={15} />
                  Tambah unit lagi
                </button>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex gap-3 border-t border-zinc-100 px-6 py-4 shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition disabled:opacity-50"
            >
              <ChevronLeft size={15} />
              Kembali
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition"
            >
              Batal
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !canAdvanceStep1) {
                  toast.error("Lengkapi judul, alamat, deskripsi, dan harga");
                  return;
                }
                if (step === 2 && !canAdvanceStep2) {
                  toast.error(
                    prop.host_mode === "existing"
                      ? "Masukkan Host ID"
                      : "Lengkapi nama, email, dan no. telepon host",
                  );
                  return;
                }
                setStep((s) => s + 1);
              }}
              className="ml-auto flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition"
            >
              Lanjut
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="ml-auto flex items-center gap-2 rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Check size={14} /> Simpan Listing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
