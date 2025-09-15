import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript checks during the build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint checks during the build
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* other config options here */
};

export default nextConfig;