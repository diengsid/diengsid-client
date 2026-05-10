import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [
      "picsum.photos",
      "source.unsplash.com",
      "images.unsplash.com",
      "localhost",
    ],
    dangerouslyAllowLocalIP: true, // 🔥 ini kunci
  },
};

export default nextConfig;
