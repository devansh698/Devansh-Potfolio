import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Banking Dashboard case study grew into FinPilot AI; keep the old indexed URL working.
  async redirects() {
    return [{ source: '/projects/banking-dashboard', destination: '/projects/finpilot', permanent: true }];
  },
};

export default nextConfig;
