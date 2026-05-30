import type { MetadataRoute } from "next";

const SITE_URL = "https://diengs.id";
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

const staticPages: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/wisata`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
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
  let attractionPages: MetadataRoute.Sitemap = [];

  await Promise.all([
    // Properties
    fetch(`${API_URL}/api/properties?page=1&size=500`, {
      next: { revalidate: 3600 },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        const items: Array<{ id: string; updated_at: number }> =
          json?.data ?? [];
        propertyPages = items.map((p) => ({
          url: `${SITE_URL}/penginapan/${p.id}`,
          lastModified: new Date(p.updated_at * 1000),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
      })
      .catch(() => {}),

    // Tourist attractions
    fetch(`${API_URL}/api/tourist-attractions`, {
      next: { revalidate: 3600 },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((json) => {
        const items: Array<{ slug: string; updated_at: number }> =
          json?.data ?? [];
        attractionPages = items.map((a) => ({
          url: `${SITE_URL}/wisata/${a.slug}`,
          lastModified: new Date(a.updated_at * 1000),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      })
      .catch(() => {}),
  ]);

  return [...staticPages, ...propertyPages, ...attractionPages];
}
