import { addDays } from "date-fns";
import { Heart } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { Experience } from "../schemas/experience-schema";

interface Props {
  experience: Experience;
}

export default function ItemCard({ experience }: Props): React.ReactNode {
  const now = new Date();
  const tomorrow = addDays(now, 1);

  return (
    <div
      className="group flex cursor-pointer flex-col gap-2"
      onClick={() => {
        const url =
          "/properties/" +
          experience.id +
          "?check_in=" +
          tomorrow.toISOString().split("T")[0] +
          "&check_out=" +
          addDays(tomorrow, 1).toISOString().split("T")[0];

        if (window.innerWidth >= 768) {
          // desktop
          window.open(url, "_blank");
        } else {
          // mobile
          window.location.href = url;
        }
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
        <Image
          fill
          src={experience.thumbnail_url}
          alt={experience.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute top-3 right-3">
          <button className="rounded-full bg-transparent p-2 text-white transition-colors hover:bg-white/10">
            <Heart
              size={24}
              className="fill-black/20 stroke-white transition-colors hover:fill-emerald-500 hover:stroke-emerald-500"
            />
          </button>
        </div>
      </div>

      <div className="mt-1 flex items-start justify-between">
        <h3 className="truncate pr-2 font-semibold text-gray-900">
          {experience.title}
        </h3>
      </div>

      <div className="flex w-full items-center justify-start gap-1 text-gray-500">
        <div className="flex gap-1 truncate text-xs">
          Rp {experience.base_price.toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  );
}
