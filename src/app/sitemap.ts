import type { MetadataRoute } from "next";

const SITE_URL = "https://diengs.id";
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

// Safely convert a backend timestamp to a valid ISO date string.
// The backend mixes seconds (Unix) and milliseconds (UnixMilli).
// Heuristic: values > 1e12 are already in milliseconds.
function toLastModified(ts: number | null | undefined): string {
  if (!ts || isNaN(ts)) return new Date().toISOString();
  const ms = ts > 1_000_000_000_000 ? ts : ts * 1000;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

const NOW = new Date().toISOString();

const staticPages: MetadataRoute.Sitemap = [
  { url: SITE_URL,                 lastModified: NOW, changeFrequency: "daily",   priority: 1.0 },
  { url: `${SITE_URL}/wisata`,     lastModified: NOW, changeFrequency: "weekly",  priority: 0.9 },
  { url: `${SITE_URL}/layanan`,    lastModified: NOW, changeFrequency: "monthly", priority: 0.5 },
  { url: `${SITE_URL}/pengalaman`, lastModified: NOW, changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let propertyPages: MetadataRoute.Sitemap = [];
  let attractionPages: MetadataRoute.Sitemap = [];

  await Promise.all([
    // Properties
    fetch(`${API_URL}/api/properties?page=1&size=500`, {
      next: { revalidate: 3600 },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const items: Array<{ id: string; updated_at: number }> =
          json?.data ?? [];
        propertyPages = items.map((p) => ({
          url: `${SITE_URL}/penginapan/${p.id}`,
          lastModified: toLastModified(p.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
      })
      .catch(() => {}),

    // Tourist attractions — backend uses UnixMilli (milliseconds)
    fetch(`${API_URL}/api/tourist-attractions`, {
      next: { revalidate: 3600 },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const items: Array<{ slug: string; updated_at: number }> =
          json?.data ?? [];
        attractionPages = items.map((a) => ({
          url: `${SITE_URL}/wisata/${a.slug}`,
          lastModified: toLastModified(a.updated_at),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      })
      .catch(() => {}),
  ]);

  return [...staticPages, ...propertyPages, ...attractionPages];
}
