import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? process.env.API_BASE_URL ?? "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return Promise.resolve([
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ]);
  },
  async rewrites() {
    return Promise.resolve([
      {
        source: "/api/:path*",
        destination: `${backendUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ]);
  },
};

export default nextConfig;
