import type { NextConfig} from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript and ESLint checks during the build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // This is the new, correct key for Next.js 15.5.3
  serverExternalPackages: ['googleapis', 'google-auth-library'],
};

export default nextConfig;