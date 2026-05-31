"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useScroll } from "@/hooks/use-scroll";
import {
  BedDouble,
  Building,
  Building2,
  Home,
  House,
  Tent,
  TreePine,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { CategorySkeleton } from "./categories-skeleton";

type Category = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const categories: Category[] = [
  { label: "Homestay", value: "homestay", icon: Home },
  { label: "Hotel",    value: "hotel",    icon: Building2 },
  { label: "Villa",    value: "villa",    icon: TreePine },
  { label: "Guesthouse", value: "guesthouse", icon: House },
  { label: "Apartment", value: "apartment", icon: Building },
  { label: "Cabin",    value: "cabin",    icon: BedDouble },
  { label: "Cottage",  value: "cottage",  icon: Warehouse },
  { label: "Glamping", value: "glamping", icon: Tent },
];

export default function Categories(): React.ReactNode {
  const { scrollY } = useScroll();
  const router = useRouter();
  const params = useSearchParams();

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const current = params.get("category") || "";

  const handleChange = (value: string) => {
    if (current === value) {
      router.push("/", { scroll: false });
    } else {
      router.push(`/?category=${value}`, { scroll: false });
    }
  };

  useEffect(() => {
    if (categories) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFirstLoad(false);
    }
  }, []);

  const showSkeleton = isFirstLoad;

  return (
    <div
      className={`${
        scrollY > 490 ? "shadow-custom" : "shadow-none"
      } sticky top-26 z-50 overflow-hidden bg-white pt-5`}
    >
      <div className="container mx-auto px-13">
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {showSkeleton
              ? Array.from({ length: 6 }).map((_, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-1/4 pl-1 lg:basis-1/12"
                  >
                    <CategorySkeleton />
                  </CarouselItem>
                ))
              : categories.map((cat, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/4 pl-1 lg:basis-1/12"
                  >
                    <div
                      className={`group flex min-w-16 cursor-pointer flex-col items-center gap-2 transition-all duration-200 ${
                        current === cat.value
                          ? "border-b-2 border-black pb-2 text-black"
                          : "border-b-2 border-transparent pb-2 text-gray-500 hover:border-gray-300 hover:text-gray-800"
                      }`}
                      onClick={() => handleChange(cat.value)}
                    >
                      <cat.icon
                        size={24}
                        strokeWidth={current === cat.value ? 2 : 1.5}
                        className="transition-transform group-hover:scale-110"
                      />
                      <span className="text-[10px] font-medium whitespace-nowrap capitalize">
                        {cat.label}
                      </span>
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>

          {!showSkeleton && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}
