import type { MetadataRoute } from "next";

const SITE_URL = "https://diengs.id";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const staticPages: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/layanan`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${SITE_URL}/pengalaman`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let propertyPages: MetadataRoute.Sitemap = [];

  try {
    // Use native fetch (not axios) — localStorage is unavailable server-side
    const res = await fetch(`${API_URL}/api/properties?page=1&size=500`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const json = await res.json();
      const properties: Array<{ id: string; updated_at: number }> =
        json.data ?? [];

      propertyPages = properties.map((p) => ({
        url: `${SITE_URL}/penginapan/${p.id}`,
        lastModified: new Date(p.updated_at * 1000),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // API unavailable at build time — static pages still get indexed
  }

  return [...staticPages, ...propertyPages];
}
