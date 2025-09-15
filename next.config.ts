import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript and ESLint checks during the build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Tell Next.js to not bundle these server-side packages
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("googleapis", "google-auth-library");
    }
    return config;
  },

  // Note: For Next.js 13+ with App Router, 'serverComponentsExternalPackages' is also a valid option.
  // serverComponentsExternalPackages: ['googleapis', 'google-auth-library'],
};

export default nextConfig;