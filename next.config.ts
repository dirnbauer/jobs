import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Set at `next build` — on Vercel this matches each production deploy.
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
