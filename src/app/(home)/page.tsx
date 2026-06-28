import BecomeHost from "@/components/shared/become-host/become-host";
import CategoriesSection from "@/components/shared/categories/categories-section";
import { Footer } from "@/components/shared/footer/footer";
import Hero from "@/components/shared/hero";
import MenuBarBottom from "@/components/shared/menu-bar/menu-bar";
import MenuBar from "@/components/shared/menubar";
import Navbar from "@/components/shared/navbar/navbar";
import SearchBar from "@/components/shared/search-bar/SearchBar";
import SearchBarMobile from "@/components/shared/search-bar/SearchBarMobile";
import AttractionRecomendation from "@/features/attractions/components/attraction-recomendation";
import BlogSection from "@/features/blog/blog-section";
import PropertyRecomendation from "@/features/properties/components/property-recommendations";
import WeatherSection from "@/features/weather/components/weather-section";
import { Metadata } from "next";
import { cookies } from "next/headers";

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

export default async function HomePenginapanPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <>
      {/* Navbar */}
      <Navbar token={token?.value} />
      {/* MenuBar */}
      <MenuBar />
      {/* Hero */}
      <Hero />
      {/* Search Bar — desktop only, overlaps hero */}
      <div className="hidden md:block container mx-auto relative z-10 -top-10 lg:px-12">
        <SearchBar />
      </div>
      {/* Search Bar — mobile only */}
      <div className="md:hidden px-4 py-4 z-100 relative  -top-12 ">
        <SearchBarMobile />
      </div>
      {/* Destination Recommendation */}
      <AttractionRecomendation />
      {/* Property Recommendation */}
      <PropertyRecomendation />
      {/* Search By Type */}
      <CategoriesSection />
      {/* Blog */}
      <BlogSection />

      {/* Weather Section */}
      <WeatherSection />
      {/* Menjadi Tuan Rumah */}
      <BecomeHost />

      {/* Footer */}
      <Footer />
      {/* Menu Bar Bottom */}
      <div className="md:hidden">
        <MenuBarBottom />
      </div>
    </>
  );
}
