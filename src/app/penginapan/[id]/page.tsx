import { Footer } from "@/components/shared/footer/footer";
import { JsonLd } from "@/components/shared/json-ld";
import Navbar from "@/components/shared/navbar/navbar";
import DetailProperty from "@/features/properties/components/detail";
import NavbarDetailProperty from "@/features/properties/components/navbar";
import { serverDetailProperty } from "@/features/properties/services/property-server-service";
import { parseLocalDate } from "@/lib/date";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    check_in?: string;
    check_out?: string;
    rentable_id?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const result = await serverDetailProperty(id);
    if (!result) throw new Error("not found");
    const { data: property } = result;
    const description =
      property.description?.slice(0, 160) ||
      `${property.title} — penginapan di kawasan Dieng Wonosobo. Pesan sekarang di Diengs.id.`;
    const image = property.thumbnail_url || "/og-image.jpg";
    return {
      title: `${property.title} | Penginapan Dieng`,
      description,
      openGraph: {
        title: property.title,
        description,
        images: [{ url: image, alt: property.title }],
        url: `https://diengs.id/penginapan/${id}`,
        type: "website",
      },
      alternates: { canonical: `https://diengs.id/penginapan/${id}` },
    };
  } catch {
    return { title: "Detail Penginapan Dieng" };
  }
}

export default async function DetailPropertyPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { check_in, check_out, rentable_id } = await searchParams;
  const checkInDate = parseLocalDate(check_in);
  const checkOutDate = parseLocalDate(check_out);
  const rentableId = rentable_id || "";

  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  // fetch for JSON-LD — Next.js deduplicates identical requests within the same render
  const propertyData = await serverDetailProperty(id).catch(() => null);
  const property = propertyData?.data;

  const minPrice = property?.rentable?.length
    ? Math.min(...property.rentable.map((r) => r.base_price))
    : undefined;

  return (
    <>
      {property && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "@id": `https://diengs.id/penginapan/${id}`,
              name: property.title,
              description: property.description,
              url: `https://diengs.id/penginapan/${id}`,
              image: property.thumbnail_url ?? "https://diengs.id/og-image.jpg",
              address: {
                "@type": "PostalAddress",
                streetAddress: property.address,
                addressLocality: "Dieng",
                addressRegion: "Jawa Tengah",
                addressCountry: "ID",
              },
              ...(property.lat && property.lng
                ? {
                    geo: {
                      "@type": "GeoCoordinates",
                      latitude: property.lat,
                      longitude: property.lng,
                    },
                  }
                : {}),
              ...(minPrice !== undefined
                ? {
                    priceRange: `Rp ${minPrice.toLocaleString("id-ID")}`,
                    offers: {
                      "@type": "Offer",
                      price: minPrice,
                      priceCurrency: "IDR",
                      availability: "https://schema.org/InStock",
                    },
                  }
                : {}),
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Beranda",
                  item: "https://diengs.id",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: property.title,
                  item: `https://diengs.id/penginapan/${id}`,
                },
              ],
            }}
          />
        </>
      )}

      {/* navbar mobile */}
      <div className="md:hidden">
        <NavbarDetailProperty />
      </div>

      {/* navbar desktop */}
      <div className="hidden md:block">
        <Navbar isFixed={false} token={token?.value} />
      </div>

      {/* detail section */}
      <DetailProperty
        propertyId={id}
        checkIn={checkInDate}
        checkOut={checkOutDate}
        rentableId={rentableId}
      />
      <Footer />
    </>
  );
}
