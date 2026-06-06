"use client";
import Button from "@/components/ui/button/button";
import { useScroll } from "@/hooks/use-scroll";
import { scrollToId } from "@/lib/utils";

interface Props {
  totalDays: number;
}

export default function NavItem({ totalDays }: Props) {
  const { scrollY } = useScroll();
  return (
    <div
      className={`${scrollY > 360 ? "sticky" : "hidden"} w-full z-[90] border-b top-0 bg-white py-5 absolute`}
    >
      <div className="flex gap-x-2 container mx-auto px-3 md:px-20">
        <Button variant="link" onClick={() => scrollToId("photos")}>
          Foto
        </Button>
        <Button variant="link" onClick={() => scrollToId("amenities")}>
          Fasilitas
        </Button>
        <Button variant="link" onClick={() => scrollToId("reviews")}>
          Ulasan
        </Button>
        <Button variant="link" onClick={() => scrollToId("locations")}>
          Lokasi
        </Button>
        {totalDays === 0 && (
          <Button variant="link" onClick={() => scrollToId("calendars")}>
            Tanggal
          </Button>
        )}
      </div>
    </div>
  );
}
