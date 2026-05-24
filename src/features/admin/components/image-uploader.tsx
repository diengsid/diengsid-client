"use client";

import { useCallback, useRef, useState } from "react";
import { uploadImages } from "@/features/admin/services/admin-service";
import { Upload, Loader2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export type UploadedImage = {
  url: string;
  is_primary: boolean;
};

export function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (imgs: UploadedImage[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        const urls = await uploadImages(Array.from(files));
        const newImgs: UploadedImage[] = urls.map((url, i) => ({
          url,
          is_primary: images.length === 0 && i === 0,
        }));
        onChange([...images, ...newImgs]);
        toast.success(`${urls.length} gambar berhasil diupload`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal upload gambar");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [images, onChange],
  );

  const setPrimary = (idx: number) =>
    onChange(images.map((img, i) => ({ ...img, is_primary: i === idx })));

  const remove = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    if (images[idx].is_primary && next.length > 0) next[0].is_primary = true;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && fileRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 py-8 transition hover:border-primary-400 hover:bg-primary-50/30",
          uploading && "cursor-not-allowed opacity-60",
        )}
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="animate-spin text-primary-700" />
            <p className="text-sm text-zinc-500">Mengupload gambar...</p>
          </>
        ) : (
          <>
            <Upload size={28} className="text-zinc-300" />
            <p className="text-sm font-medium text-zinc-500">Klik atau drag & drop gambar</p>
            <p className="text-xs text-zinc-400">JPG, PNG, WebP — bisa pilih banyak</p>
          </>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={img.url + idx}
              className="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent bg-zinc-100 transition"
              style={{ borderColor: img.is_primary ? "var(--color-primary)" : undefined }}
            >
              <Image fill src={img.url} alt={`Gambar ${idx + 1}`} className="object-cover" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setPrimary(idx)}
                  className={cn(
                    "rounded-lg p-1.5 transition",
                    img.is_primary
                      ? "bg-primary-700 text-white"
                      : "bg-white/90 text-zinc-600 hover:bg-primary-700 hover:text-white",
                  )}
                >
                  <Star size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="rounded-lg bg-white/90 p-1.5 text-red-500 hover:bg-red-600 hover:text-white transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {img.is_primary && (
                <div className="absolute bottom-1 left-1 flex items-center gap-1 rounded-md bg-primary-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  <Star size={9} />
                  Utama
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
