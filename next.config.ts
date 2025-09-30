import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ don’t fail build on lint errors
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ don’t fail build on TS errors
  },
};

export default nextConfig;
