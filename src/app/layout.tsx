import { JsonLd } from "@/components/shared/json-ld";
import Providers from "@/lib/tanstack/provider";
import { cn } from "@/lib/utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "swiper/css";
import "./globals.css";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://diengs.id/#website",
      url: "https://diengs.id",
      name: "Diengs.id",
      description:
        "Platform wisata Dieng terlengkap — penginapan, jeep tour, paket wisata, dan pengalaman seru di kawasan Dieng Wonosobo.",
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://diengs.id/search/homes?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://diengs.id/#organization",
      name: "Diengs.id",
      url: "https://diengs.id",
      logo: {
        "@type": "ImageObject",
        url: "https://diengs.id/logo2.png",
        width: 110,
        height: 30,
      },
    },
  ],
};

const googleSansFlex = Google_Sans({
  variable: "--font-google-sans-flex",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://diengs.id"),
  title: {
    default: "Diengs.id | Penginapan, Jeep Tour & Wisata Dieng",
    template: "%s | Diengs.id",
  },
  description:
    "Platform wisata Dieng terlengkap — temukan penginapan, jeep tour, paket wisata, dan pengalaman seru di kawasan Dieng Wonosobo.",
  keywords: [
    "wisata dieng",
    "dieng wonosobo",
    "penginapan dieng",
    "jeep tour dieng",
    "paket wisata dieng",
    "telaga warna dieng",
    "bukit sikunir",
  ],
  authors: [{ name: "Diengs.id" }],
  creator: "Diengs.id",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://diengs.id",
    siteName: "Diengs.id",
    title: "Diengs.id | Penginapan, Jeep Tour & Wisata Dieng",
    description:
      "Platform wisata Dieng terlengkap — temukan penginapan, jeep tour, paket wisata, dan pengalaman seru di kawasan Dieng Wonosobo.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Diengs.id — Wisata Dieng Wonosobo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diengs.id | Penginapan, Jeep Tour & Wisata Dieng",
    description:
      "Platform wisata Dieng terlengkap — temukan penginapan, jeep tour, paket wisata, dan pengalaman seru di kawasan Dieng Wonosobo.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://diengs.id",
  },
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        googleSansFlex.variable,
        "font-sans",
        "font-medium",
      )}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={websiteJsonLd} />
        <div>
          <Toaster />
        </div>

        <Providers>
          <GoogleOAuthProvider clientId={googleClientId ?? ""}>
            {children}
          </GoogleOAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
