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
    // revalidate: 0 → bypass Data Cache entirely (cache: "no-store").
    // Explicit next: { revalidate } overrides force-dynamic, so we must
    // use cache: "no-store" here instead of next: { revalidate: 0 }.
    const cacheOptions: RequestInit =
      revalidate === 0
        ? { cache: "no-store" }
        : { next: { revalidate, ...(tags ? { tags } : {}) } };
    const res = await fetch(url, { ...init, ...cacheOptions });
    if (!res.ok) return null;
    const json = await res.json();
    // If the backend wraps data in { data: T }, return json.data (even if null).
    // null is handled by callers via `?? []` fallback.
    // Returning (json.data ?? json) was wrong: null ?? json returns the full object.
    const data = Object.hasOwn(json, "data") ? json.data : json;
    return data as T;
  } catch (err) {
    console.error(`[serverFetch] ${path}`, err instanceof Error ? err.message : err);
    return null;
  }
}
