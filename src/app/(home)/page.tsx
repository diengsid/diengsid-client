import Categories from "@/components/shared/categories/categories";
import { Footer } from "@/components/shared/footer/footer";
import ForbiddenToast from "@/components/shared/forbidden-toast/forbidden-toast";
import { Hero } from "@/components/shared/hero/hero";
import { JsonLd } from "@/components/shared/json-ld";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import { WhyChooseUs } from "@/components/shared/why-choose-us/why-choose-us";
import PropertyList from "@/features/properties/components/list";
import { SearchPropertyRequest } from "@/features/properties/schemas/schema-property";
import { serverGetProperties } from "@/features/properties/services/property-server-service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ArrowRight, Heart, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wisata Dieng Wonosobo | Penginapan & Tour Terbaik",
  description:
    "Temukan penginapan terbaik di Dieng Wonosobo — villa, homestay, jeep tour, dan berbagai paket wisata kawasan Dieng. Pesan sekarang di Diengs.id.",
  keywords: [
    "wisata dieng",
    "penginapan dieng",
    "dieng wonosobo",
    "villa dieng",
    "homestay dieng",
    "jeep tour dieng",
    "paket wisata dieng",
    "telaga warna dieng",
    "bukit sikunir",
    "candi arjuna dieng",
  ],
  openGraph: {
    title: "Wisata Dieng Wonosobo | Penginapan & Tour Terbaik",
    description:
      "Temukan penginapan terbaik di Dieng Wonosobo — villa, homestay, jeep tour, dan berbagai paket wisata kawasan Dieng.",
    images: ["/og-image.jpg"],
    url: "https://diengs.id",
  },
  alternates: {
    canonical: "https://diengs.id",
  },
};

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const params = await searchParams;
  const category = params.category || "";

  const queryClient = new QueryClient();

  const search: SearchPropertyRequest = {
    property_type: category || undefined,
    page: 1,
    size: 20,
  };

  await queryClient.prefetchQuery({
    queryKey: ["properties", search],
    queryFn: () => serverGetProperties(search),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "@id": "https://diengs.id/#travelagency",
          name: "Diengs.id",
          description:
            "Platform wisata Dieng terlengkap — penginapan, jeep tour, paket wisata, dan pengalaman seru di kawasan Dieng Wonosobo.",
          url: "https://diengs.id",
          image: "https://diengs.id/og-image.jpg",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dieng",
            addressRegion: "Jawa Tengah",
            addressCountry: "ID",
          },
          areaServed: {
            "@type": "Place",
            name: "Dieng, Wonosobo, Jawa Tengah, Indonesia",
          },
          priceRange: "Rp",
          hasMap: "https://maps.google.com/?q=Dieng+Wonosobo",
        }}
      />
      <Suspense>
        <ForbiddenToast />
      </Suspense>
      <Navbar token={token?.value} showCategoryTabs />
      <Hero />
      <Categories />
      <main id="penginapan" className="container mt-10 mx-auto bg-white">
        <HydrationBoundary state={dehydratedState}>
          <PropertyList search={search} />
        </HydrationBoundary>
        <WhyChooseUs />
      </main>

      {/* ── Tentang Kami ── */}
      <section className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Tentang Kami
              </span>
              <h2 className="mt-3 text-3xl font-bold text-zinc-900 md:text-4xl">
                Platform Wisata Dieng
                <br />
                dari Komunitas Lokal
              </h2>
              <p className="mt-5 leading-relaxed text-zinc-600">
                Diengs.id dibangun oleh warga lokal Dieng untuk mempermudah
                wisatawan menemukan penginapan, jeep tour, dan pengalaman
                autentik kawasan Dieng Wonosobo — dengan harga jujur dan
                pelayanan dari hati.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tentang-kami"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700"
                >
                  Selengkapnya
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/artikel"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Baca Artikel Wisata
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-emerald-600 p-6 text-white">
                <Users size={28} />
                <p className="mt-4 text-2xl font-bold">5.000+</p>
                <p className="mt-1 text-sm text-emerald-100">
                  Wisatawan Dilayani
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                <MapPin size={28} className="text-emerald-600" />
                <p className="mt-4 text-2xl font-bold text-zinc-900">100+</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Penginapan Terdaftar
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                <Heart size={28} className="text-emerald-600" />
                <p className="mt-4 text-2xl font-bold text-zinc-900">Lokal</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Dikelola Warga Asli Dieng
                </p>
              </div>
              <div className="rounded-2xl bg-teal-600 p-6 text-white">
                <span className="text-2xl">⭐</span>
                <p className="mt-4 text-2xl font-bold">4.8/5</p>
                <p className="mt-1 text-sm text-teal-100">Rating Rata-rata</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
