"use client";

import { uploadImages } from "@/features/admin/services/admin-service";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function SingleImageUploader({ value, onChange, label }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setUploading(true);
      try {
        const [url] = await uploadImages([file]);
        onChange(url);
        toast.success("Gambar berhasil diupload");
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
    <div className="space-y-2">
      {label && (
        <p className="text-xs font-medium text-zinc-600">{label}</p>
      )}

      {value ? (
        <div className="group relative h-40 w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
          <Image
            fill
            src={value}
            alt="Gambar atraksi"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
            >
              <Trash2 size={13} />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && fileRef.current?.click()}
          className={cn(
            "flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 transition hover:border-primary-400 hover:bg-primary-50/30",
            uploading && "cursor-not-allowed opacity-60",
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-primary-700" />
              <p className="text-sm text-zinc-500">Mengupload...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                <ImageIcon size={22} className="text-zinc-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-600">
                  Klik atau drag & drop
                </p>
                <p className="text-xs text-zinc-400">JPG, PNG, WebP</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
                <Upload size={12} />
                Pilih Gambar
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
