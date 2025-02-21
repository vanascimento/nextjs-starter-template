import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
