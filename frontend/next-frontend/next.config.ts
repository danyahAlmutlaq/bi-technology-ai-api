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
        source: "/backend/bookings/:id/status",
        destination: "http://127.0.0.1:8000/bookings/:id/status",
      },
      {
        source: "/backend/customers",
        destination: "http://127.0.0.1:8000/customers/",
      },
      {
        source: "/backend/customers/",
        destination: "http://127.0.0.1:8000/customers/",
      },
      {
        source: "/backend/shipments",
        destination: "http://127.0.0.1:8000/shipments/",
      },
      {
        source: "/backend/shipments/",
        destination: "http://127.0.0.1:8000/shipments/",
      },
      {
        source: "/backend/shipments/:id",
        destination: "http://127.0.0.1:8000/shipments/:id",
      },
      {
        source: "/backend/delivery-companies",
        destination: "http://127.0.0.1:8000/delivery-companies/",
      },
      {
        source: "/backend/delivery-companies/",
        destination: "http://127.0.0.1:8000/delivery-companies/",
      },
    ];
  },
};

export default nextConfig;
