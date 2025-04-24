import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Disable static optimization for pages with errors
  staticPageGenerationTimeout: 0,
  // Disable strict mode to avoid CSR bailout issues
  reactStrictMode: false,
  // Add environment variables for build
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  },
};

export default nextConfig;
