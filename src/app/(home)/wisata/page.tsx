import { AttractionGrid } from "@/features/attractions/components/attraction-grid";
import { getAttractions } from "@/features/attractions/services/attraction-service";
import { Footer } from "@/components/shared/footer/footer";
import MenuBar from "@/components/shared/menu-bar/menu-bar";
import Navbar from "@/components/shared/navbar/navbar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Wisata Dieng | Tempat Menarik di Kawasan Dieng",
  description:
    "Jelajahi berbagai tempat wisata menarik di kawasan Dieng Wonosobo — telaga, candi, kawah, bukit, dan banyak lagi.",
  keywords: [
    "wisata dieng",
    "tempat wisata dieng",
    "telaga warna dieng",
    "bukit sikunir",
    "candi arjuna",
    "kawah sikidang",
    "dieng wonosobo",
  ],
  openGraph: {
    title: "Wisata Dieng | Tempat Menarik di Kawasan Dieng",
    description:
      "Jelajahi berbagai tempat wisata menarik di kawasan Dieng Wonosobo.",
    url: "https://diengs.id/wisata",
  },
  alternates: { canonical: "https://diengs.id/wisata" },
};

export default async function WisataPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["attractions"],
    queryFn: getAttractions,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Navbar token={token?.value} />

      {/* Hero */}
      <section className="bg-linear-to-b from-primary-50 to-white px-4 pb-10 pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            Wisata Dieng
          </h1>
          <p className="mt-3 text-base text-zinc-500">
            Jelajahi keindahan alam, budaya, dan kuliner di kawasan dataran
            tinggi Dieng Wonosobo.
          </p>
        </div>
      </section>

      <main className="container mx-auto max-w-6xl px-4 pb-16 pt-8">
        <HydrationBoundary state={dehydratedState}>
          <AttractionGrid />
        </HydrationBoundary>
      </main>

      <Footer />
      <div className="md:hidden">
        <MenuBar token={token?.value} />
      </div>
    </>
  );
}
