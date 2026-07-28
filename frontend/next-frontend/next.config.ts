import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      {
        source: "/backend/bookings",
        destination: "http://127.0.0.1:8000/bookings/",
      },
      {
        source: "/backend/bookings/",
        destination: "http://127.0.0.1:8000/bookings/",
      },
      {
        source: "/backend/customers",
        destination: "http://127.0.0.1:8000/customers/",
      },
      {
        source: "/backend/customers/",
        destination: "http://127.0.0.1:8000/customers/",
      },
    ];
  },
};

export default nextConfig;