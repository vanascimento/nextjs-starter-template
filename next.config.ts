import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    domains: ["images.unsplash.com"],
  },
};
const withNextIntl = createNextIntlPlugin("./i18n/requests.ts");

export default withNextIntl(nextConfig);
