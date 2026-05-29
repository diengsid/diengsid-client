import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/layanan", "/pengalaman", "/penginapan/", "/search/homes"],
        disallow: [
          "/admin/",
          "/sign-in/",
          "/profile/",
          "/booking/",
          "/pembayaran/",
        ],
      },
    ],
    sitemap: "https://diengs.id/sitemap.xml",
    host: "https://diengs.id",
  };
}
