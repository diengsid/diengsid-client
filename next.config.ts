import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Disable Next.js image optimization in production.
    // The optimizer fetches images server-side, which Cloudflare blocks as a bot request → 500.
    // Images are served directly from the CDN/storage without optimization.
    // Re-enable this once a proper image CDN (e.g. Cloudflare Images) is configured.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http",  hostname: "localhost" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "api.diengs.id" },
    ],
  },
  output: "standalone",
};

export default nextConfig;
