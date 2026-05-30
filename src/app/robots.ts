import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/wisata/", "/wisata", "/layanan", "/pengalaman", "/penginapan/", "/search/homes"],
        disallow: [
          "/admin/",
          "/sign-in/",
          "/profile/",
          "/booking/",
          "/pembayaran/",
          "/payment/",
        ],
      },
    ],
    sitemap: "https://diengs.id/sitemap.xml",
    host: "https://diengs.id",
  };
}
