"use client";

import { PropertyImage } from "@/features/properties/schemas/schema-property";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Grid2x2, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  images?: PropertyImage[];
}

// ─── lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  onClose,
}: {
  images: PropertyImage[];
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"grid" | "detail">("grid");
  const [current, setCurrent] = useState(0);

  const openDetail = (idx: number) => {
    setCurrent(idx);
    setMode("detail");
  };

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (mode === "detail") {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
        if (e.key === "Escape") setMode("grid");
      } else {
        if (e.key === "Escape") onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, prev, next, onClose]);

  if (mode === "grid") {
    return (
      <div className="fixed inset-0 z-9999 flex flex-col bg-white">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-black/10">
          <span className="text-sm font-semibold text-black">
            Semua foto ({images.length})
          </span>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-black/70 hover:bg-black/10 hover:text-black transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-4xl mx-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => openDetail(i)}
                className="relative aspect-square overflow-hidden rounded-xl group"
              >
                <Image
                  fill
                  src={img.image_url}
                  alt={`Gambar ${i + 1}`}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 flex flex-col bg-white">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          onClick={() => setMode("grid")}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-black/70 hover:bg-black/10 hover:text-black transition"
        >
          <ChevronLeft size={16} />
          Semua foto
        </button>
        <span className="text-sm font-medium text-black/70">
          {current + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-black/70 hover:bg-black/10 hover:text-black transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* main image */}
      <div className="relative flex-1 flex items-center justify-center px-12">
        <div className="relative w-full h-full max-w-4xl">
          <Image
            key={current}
            fill
            src={images[current].image_url}
            alt={`Gambar ${current + 1}`}
            className="object-contain"
            unoptimized
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black hover:bg-black/20 transition"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black hover:bg-black/20 transition"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* thumbnail strip */}
      {images.length > 1 && (
        <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3 justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === current
                  ? "border-black"
                  : "border-transparent opacity-50 hover:opacity-80",
              )}
            >
              <Image
                fill
                src={img.image_url}
                alt=""
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── main component ────────────────────────────────────────────────────────────

export default function DetailImageProperty({
  images = [],
}: Props): React.ReactNode {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [active, setActive] = useState(0);

  const open = (idx: number) => setLightboxIndex(idx);
  const close = () => setLightboxIndex(null);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square md:hidden bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-2xl" />
    );
  }

  return (
    <>
      {/* ── mobile: swiper ── */}
      <div className="relative md:hidden">
        <Swiper
          onSlideChange={(swiper) => setActive(swiper.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
          className="z-10"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative aspect-square overflow-hidden bg-gray-200 cursor-pointer"
                onClick={() => open(index)}
              >
                <Image
                  src={img.image_url}
                  alt="image"
                  fill
                  loading="eager"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-10 z-10 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* ── desktop: grid ── */}
      <div className="hidden container mx-auto md:grid grid-cols-4 grid-rows-2 gap-2 w-full h-113 px-10 md:px-0 mt-10 items-stretch">
        {/* main image — col-span-2 row-span-2, tombol "Lihat Semua" di kiri bawah */}
        <div
          className="relative row-span-2 col-span-2 bg-gray-100 rounded-l-2xl overflow-hidden group cursor-pointer"
          onClick={() => open(0)}
        >
          <Image
            loading="lazy"
            fill
            src={images[0].image_url}
            alt="main image"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* top-right 1 */}
        <div
          className="bg-gray-100 overflow-hidden group cursor-pointer relative"
          onClick={() => open(1)}
        >
          <Image
            fill
            src={images[1]?.image_url ?? images[0].image_url}
            alt="image 2"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* top-right 2 */}
        <div
          className="bg-gray-100 rounded-tr-2xl overflow-hidden group cursor-pointer relative"
          onClick={() => open(2)}
        >
          <Image
            fill
            src={images[2]?.image_url ?? images[0].image_url}
            alt="image 3"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* bottom-right 1 */}
        <div
          className="bg-gray-100 overflow-hidden group cursor-pointer relative"
          onClick={() => open(3)}
        >
          <Image
            fill
            src={images[3]?.image_url ?? images[0].image_url}
            alt="image 4"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* bottom-right 2 */}
        <div
          className="bg-gray-100 rounded-br-2xl overflow-hidden group cursor-pointer relative"
          onClick={() => open(4)}
        >
          <Image
            fill
            src={images[4]?.image_url ?? images[0].image_url}
            alt="image 5"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          {images.length > 5 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold text-lg">
              +{images.length - 5}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              open(0);
            }}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-md hover:bg-zinc-50 transition"
          >
            <Grid2x2 size={15} />
            Lihat semua foto
          </button>
        </div>
      </div>

      {/* lightbox */}
      {lightboxIndex !== null && <Lightbox images={images} onClose={close} />}
    </>
  );
}
