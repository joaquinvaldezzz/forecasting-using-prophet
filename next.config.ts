import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return await Promise.resolve([
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ]);
  },
  async rewrites() {
    return await Promise.resolve([
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:5000/api/:path*",
      },
    ]);
  },
};

export default nextConfig;
