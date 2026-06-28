"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef } from "react";

const CATEGORIES = [
  {
    label: "Homestay",
    value: "homestay",
    image:
      "https://images.unsplash.com/photo-1556019947-8695cb3d4e81?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Hotel",
    value: "hotel",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Villa",
    value: "villa",
    image:
      "https://images.unsplash.com/photo-1759372945658-1e9f56e751bd?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Guesthouse",
    value: "guesthouse",
    image:
      "https://images.unsplash.com/photo-1697299261580-876d107bf090?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Apartment",
    value: "apartment",
    image:
      "https://images.unsplash.com/photo-1613575831056-0acd5da8f085?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Cabin",
    value: "cabin",
    image:
      "https://images.unsplash.com/photo-1610486870542-70d0062d150f?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Cottage",
    value: "cottage",
    image:
      "https://images.unsplash.com/photo-1575403071235-5dcd06cbf169?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Glamping",
    value: "glamping",
    image:
      "https://images.unsplash.com/photo-1741850826366-889f33a73327?fm=jpg&q=80&w=400&auto=format&fit=crop",
  },
];

export default function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("property_type") ?? "";

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  return (
    <section className="px-4 py-6 md:px-12 lg:px-20">
      {/* header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Cari Berdasarkan Tipe</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {CATEGORIES.map(({ label, value, image }) => {
          const isActive =
            pathname === "/search/homes" && activeType === value;

          return (
            <Link
              key={value}
              href={`/search/homes?property_type=${value}`}
              className="group flex w-48 shrink-0 flex-col gap-2"
            >
              <div
                className={cn(
                  "relative h-48 w-48 overflow-hidden rounded-2xl bg-zinc-200 transition",
                  isActive && "ring-2 ring-primary",
                )}
              >
                <Image
                  fill
                  src={image}
                  alt={label}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <p
                className={cn(
                  "text-sm text-zinc-800",
                  isActive && "font-semibold",
                )}
              >
                {label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
