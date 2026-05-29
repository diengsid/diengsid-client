import type { Metadata } from "next";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import SearchPageContent from "@/features/properties/components/search-page-content";
import { SearchPropertyRequest } from "@/features/properties/schemas/schema-property";
import { getProperties } from "@/features/properties/services/property-service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cari Penginapan di Dieng",
  description:
    "Cari penginapan di kawasan Dieng Wonosobo — temukan villa, homestay, dan berbagai pilihan terbaik.",
  robots: { index: false, follow: false },
};

type SearchParams = {
  q?: string;
  check_in?: string;
  check_out?: string;
  adults?: string;
  children?: string;
  babies?: string;
  property_type?: string;
};

type Props = { searchParams: Promise<SearchParams> };

export default async function SearchPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const params = await searchParams;

  const location = params.q ?? "";
  const checkIn = params.check_in ?? "";
  const checkOut = params.check_out ?? "";
  const adults = Math.max(1, parseInt(params.adults ?? "1") || 1);
  const children = parseInt(params.children ?? "0") || 0;
  const guestCount = adults + children;

  const search: SearchPropertyRequest = {
    key: location || undefined,
    check_in: checkIn || undefined,
    check_out: checkOut || undefined,
    guest_count: guestCount > 0 ? guestCount : undefined,
    property_type: params.property_type || undefined,
    page: 1,
    size: 50,
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["properties", search],
    queryFn: () => getProperties(search),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      {/* sticky navbar — search open by default, hides on scroll */}
      <div className="sticky top-0 z-50 bg-white border-b border-zinc-100 shadow-sm">
        <Navbar token={token?.value} isFixed={false} />
      </div>

      {/* split layout: left list scrolls window, right map is sticky */}
      <HydrationBoundary state={dehydratedState}>
        <Suspense>
          <SearchPageContent
            search={search}
            location={location}
            checkIn={checkIn || undefined}
            checkOut={checkOut || undefined}
          />
        </Suspense>
      </HydrationBoundary>

      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
