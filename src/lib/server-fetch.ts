/**
 * Server-side API base URL.
 *
 * Priority:
 *  1. API_URL          – private env var, set to internal Docker network URL
 *                        (e.g. http://backend:8080). Bypasses Cloudflare entirely.
 *  2. NEXT_PUBLIC_API_URL – public URL, fallback for local dev.
 *
 * Never use this on the client — it is server-only.
 * Browser requests go through the axios instance in lib/axios.ts.
 */
export const SERVER_API_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

type FetchOptions = Omit<RequestInit, "next"> & {
  revalidate?: number | false;
  tags?: string[];
};

/**
 * Thin wrapper around native fetch for server components.
 * Returns parsed JSON data or null on failure.
 */
export async function serverFetch<T>(
  path: string,
  { revalidate = 3600, tags, ...init }: FetchOptions = {},
): Promise<T | null> {
  try {
    const url = `${SERVER_API_URL}/api${path}`;
    const res = await fetch(url, {
      ...init,
      next: { revalidate, ...(tags ? { tags } : {}) },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as T;
  } catch (err) {
    console.error(`[serverFetch] ${path}`, err instanceof Error ? err.message : err);
    return null;
  }
}
