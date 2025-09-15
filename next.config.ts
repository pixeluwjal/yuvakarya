import type { NextConfig from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript and ESLint checks during the build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Use this option for server-side-only packages in the App Router
  experimental: {
    serverComponentsExternalPackages: ['googleapis', 'google-auth-library'],
  },
};

export default nextConfig;