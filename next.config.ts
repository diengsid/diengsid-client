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
      "lh3.googleusercontent.com",
    ],
    dangerouslyAllowLocalIP: true, // 🔥 ini kunci
  },
};

export default nextConfig;
