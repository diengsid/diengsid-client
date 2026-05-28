import { Footer } from "@/components/shared/footer/footer";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import ExperienceList from "@/features/experiences/components/list";
import { getExperiences } from "@/features/experiences/services/experience.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { cookies } from "next/headers";
import type React from "react";

type SearchParams = {
  q?: string;
  check_in?: string;
  check_out?: string;
  adults?: string;
  children?: string;
  babies?: string;
};

type Props = { searchParams: Promise<SearchParams> };

function parseDateSafe(str: string | undefined): Date | null {
  try {
    return str ? parseISO(str) : null;
  } catch {
    return null;
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const params = await searchParams;

  const location = params.q ?? "";
  const checkIn = parseDateSafe(params.check_in);
  const checkOut = parseDateSafe(params.check_out);
  const adults = Math.max(1, parseInt(params.adults ?? "1") || 1);
  const children = parseInt(params.children ?? "0") || 0;
  const babies = parseInt(params.babies ?? "0") || 0;
  const totalGuests = adults + children;

  const queryClient = new QueryClient();
  const search = { key: location || undefined };

  await queryClient.prefetchQuery({
    queryKey: ["experiences", search],
    queryFn: () => getExperiences(search),
  });

  const dehydratedState = dehydrate(queryClient);

  // ── summary chips ──────────────────────────────────────────────────────────
  const chips: { icon: React.ReactNode; label: string }[] = [];

  if (checkIn) {
    const dateStr = checkIn
      ? `${format(checkIn, "d MMM", { locale: id })}${
          checkOut ? ` – ${format(checkOut, "d MMM yyyy", { locale: id })}` : ""
        }`
      : null;
    if (dateStr)
      chips.push({ icon: <CalendarDays size={13} />, label: dateStr });
  }

  if (totalGuests > 0) {
    chips.push({
      icon: <Users size={13} />,
      label: `${totalGuests} tamu${babies > 0 ? `, ${babies} bayi` : ""}`,
    });
  }

  return (
    <>
      {/* ── sticky header ── */}
      <div className="sticky top-0 z-50 bg-white border-b border-zinc-100 shadow-custom-sm">
        <Navbar token={token?.value} isFixed={false} />
        {/* <div className="mx-auto max-w-3xl px-6 py-3">
          <SearchBar
            defaultLocation={location}
            defaultCheckIn={checkIn}
            defaultCheckOut={checkOut}
            defaultGuests={{ adult: adults, child: children, baby: babies }}
            compact
          />
        </div> */}
      </div>

      {/* ── results ── */}
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-8">
          {/* title + chips */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-zinc-900">
              {location
                ? `Hasil untuk "${location}"`
                : "Semua properti & pengalaman"}
            </h1>

            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600"
                  >
                    {chip.icon}
                    {chip.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* location badge */}
          {location && (
            <div className="mb-4 flex items-center gap-1.5 text-sm text-zinc-500">
              <MapPin size={14} />
              <span>
                Menampilkan hasil di sekitar{" "}
                <strong className="text-zinc-800">{location}</strong>
              </span>
            </div>
          )}

          <HydrationBoundary state={dehydratedState}>
            <ExperienceList search={search} />
          </HydrationBoundary>
        </div>
      </main>

      <Footer />

      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
