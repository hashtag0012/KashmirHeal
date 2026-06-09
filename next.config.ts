import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    domains: [],
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
  },
  generateEtags: true,
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|ico|json|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable", // 30 days
          },
        ],
      },
    ];
  },
};

export default nextConfig;
