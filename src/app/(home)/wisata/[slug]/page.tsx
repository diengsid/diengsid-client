import { AttractionMap } from "@/features/attractions/components/attraction-map";
import { Attraction } from "@/features/attractions/schemas/schema-attraction";
import { Property } from "@/features/properties/schemas/schema-property";
import { Footer } from "@/components/shared/footer/footer";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import { JsonLd } from "@/components/shared/json-ld";
import { serverFetch } from "@/lib/server-fetch";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ChevronRight, Clock, Ruler } from "lucide-react";

const CATEGORY_LABEL: Record<string, string> = {
  alam: "Alam",
  budaya: "Budaya",
  kuliner: "Kuliner",
  religi: "Religi",
  petualangan: "Petualangan",
  hiburan: "Hiburan",
};

const CATEGORY_COLOR: Record<string, string> = {
  alam: "bg-emerald-100 text-emerald-700",
  budaya: "bg-amber-100 text-amber-700",
  kuliner: "bg-orange-100 text-orange-700",
  religi: "bg-purple-100 text-purple-700",
  petualangan: "bg-blue-100 text-blue-700",
  hiburan: "bg-pink-100 text-pink-700",
};

// ── Server fetch helpers ──────────────────────────────────────────────────────

async function fetchAttractions(): Promise<Attraction[]> {
  return (await serverFetch<Attraction[]>("/tourist-attractions")) ?? [];
}

async function fetchNearbyProperties(attractionId: string): Promise<Property[]> {
  return (
    (await serverFetch<Property[]>(
      `/properties?attraction_id=${attractionId}&page=1&size=6`,
    )) ?? []
  );
}

// ── Metadata ─────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const attractions = await fetchAttractions();
  const a = attractions.find((x) => x.slug === slug);
  if (!a) return { title: "Wisata Dieng" };

  const description =
    a.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    `${a.name} — tempat wisata di kawasan Dieng Wonosobo.`;

  return {
    title: `${a.name} | Wisata Dieng`,
    description,
    openGraph: {
      title: a.name,
      description,
      images: a.image_url ? [{ url: a.image_url, alt: a.name }] : ["/og-image.jpg"],
      url: `https://diengs.id/wisata/${slug}`,
    },
    alternates: { canonical: `https://diengs.id/wisata/${slug}` },
  };
}

// ── Property Card ─────────────────────────────────────────────────────────────

function NearbyPropertyCard({ p }: { p: Property }) {
  const minPrice = p.rentable?.length
    ? Math.min(...p.rentable.map((r) => r.base_price))
    : null;

  return (
    <Link
      href={`/penginapan/${p.id}`}
      className="group flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 hover:shadow-md transition-shadow"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        {p.thumbnail_url ? (
          <Image
            fill
            src={p.thumbnail_url}
            alt={p.title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin size={20} className="text-zinc-300" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900 line-clamp-1 group-hover:text-primary-700 transition-colors text-sm">
          {p.title}
        </p>
        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{p.address}</p>
        {minPrice !== null && (
          <p className="mt-1 text-xs font-semibold text-primary-700">
            Rp {minPrice.toLocaleString("id-ID")}{" "}
            <span className="font-normal text-zinc-400">/ malam</span>
          </p>
        )}
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function WisataDetailPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const attractions = await fetchAttractions();
  const a = attractions.find((x) => x.slug === slug);
  if (!a) notFound();

  const nearbyProperties = await fetchNearbyProperties(a.id);
  const colorCls = CATEGORY_COLOR[a.category ?? ""] ?? "bg-zinc-100 text-zinc-600";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          name: a.name,
          description: a.description?.replace(/<[^>]*>/g, "") ?? "",
          url: `https://diengs.id/wisata/${slug}`,
          image: a.image_url ?? "https://diengs.id/og-image.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: a.address,
            addressLocality: "Dieng",
            addressRegion: "Jawa Tengah",
            addressCountry: "ID",
          },
          ...(a.latitude && a.longitude
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: a.latitude,
                  longitude: a.longitude,
                },
              }
            : {}),
        }}
      />

      <Navbar token={token?.value} />

      {/* Hero */}
      <div className="relative h-64 w-full bg-zinc-200 sm:h-80 md:h-96">
        {a.image_url ? (
          <Image
            fill
            src={a.image_url}
            alt={a.name}
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary-100 to-primary-50">
            <MapPin size={64} className="text-primary-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute left-4 top-20 flex items-center gap-1 text-xs text-white/80 sm:left-6">
          <Link href="/" className="hover:text-white transition">Beranda</Link>
          <ChevronRight size={12} />
          <Link href="/wisata" className="hover:text-white transition">Wisata</Link>
          <ChevronRight size={12} />
          <span className="text-white">{a.name}</span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-6">
          {a.category && (
            <span className={cn("mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", colorCls)}>
              {CATEGORY_LABEL[a.category] ?? a.category}
            </span>
          )}
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{a.name}</h1>
          {a.address && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
              <MapPin size={13} />
              {a.address}
            </p>
          )}
        </div>
      </div>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left: description */}
          <div className="lg:col-span-2 space-y-8">
            {a.description && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-zinc-900">Tentang</h2>
                <div
                  className="prose prose-sm max-w-none text-zinc-600"
                  dangerouslySetInnerHTML={{ __html: a.description }}
                />
              </section>
            )}

            {/* Map */}
            {a.latitude && a.longitude && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-zinc-900">Lokasi</h2>
                <AttractionMap lat={a.latitude} lng={a.longitude} name={a.name} />
                <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                  <MapPin size={11} />
                  {a.address ?? "Dieng, Wonosobo, Jawa Tengah"}
                </p>
              </section>
            )}
          </div>

          {/* Right: nearby properties */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <h2 className="mb-3 font-semibold text-zinc-900">
                Penginapan Terdekat
              </h2>
              {nearbyProperties.length === 0 ? (
                <p className="text-sm text-zinc-400">
                  Belum ada penginapan yang terdaftar di sekitar wisata ini.
                </p>
              ) : (
                <div className="space-y-3">
                  {nearbyProperties.map((p) => (
                    <NearbyPropertyCard key={p.id} p={p} />
                  ))}
                </div>
              )}
              <Link
                href={`/?attraction_id=${a.id}`}
                className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                Lihat semua penginapan
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Distance & duration info box (if data present from nearby) */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-4 space-y-2">
              <h3 className="text-sm font-medium text-zinc-700">Info Akses</h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Ruler size={13} className="text-zinc-400" />
                Klik pada peta untuk rute navigasi
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock size={13} className="text-zinc-400" />
                Estimasi waktu tergantung lokasi awal
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
