import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.app.github.dev",
    "localhost",
    "127.0.0.1",
  ],
  async rewrites() {
    return [
      {
        source: "/backend/invoices/:id",
        destination: "http://127.0.0.1:8000/invoices/:id",
      },
      {
        source: "/backend/invoices/:id/print",
        destination: "http://127.0.0.1:8000/invoices/:id/print",
      },
      {
        source: "/backend/reports",
        destination: "http://127.0.0.1:8000/reports/",
      },
      {
        source: "/backend/reports/",
        destination: "http://127.0.0.1:8000/reports/",
      },
      {
        source: "/backend/reports/export",
        destination: "http://127.0.0.1:8000/reports/export",
      },
      {
        source: "/backend/insights",
        destination: "http://127.0.0.1:8000/insights/",
      },
      {
        source: "/backend/insights/",
        destination: "http://127.0.0.1:8000/insights/",
      },
      {
        source: "/backend/auth/login",
        destination: "http://127.0.0.1:8000/auth/login",
      },
      {
        source: "/backend/auth/logout",
        destination: "http://127.0.0.1:8000/auth/logout",
      },
      {
        source: "/backend/auth/me",
        destination: "http://127.0.0.1:8000/auth/me",
      },
      {
        source: "/backend/users",
        destination: "http://127.0.0.1:8000/users/",
      },
      {
        source: "/backend/users/",
        destination: "http://127.0.0.1:8000/users/",
      },
      {
        source: "/backend/users/:id",
        destination: "http://127.0.0.1:8000/users/:id",
      },
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
        source: "/backend/customers/:id",
        destination: "http://127.0.0.1:8000/customers/:id",
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
      {
        source: "/backend/delivery-companies/:id",
        destination: "http://127.0.0.1:8000/delivery-companies/:id",
      },
      {
        source: "/backend/orders",
        destination: "http://127.0.0.1:8000/orders/",
      },
      {
        source: "/backend/orders/",
        destination: "http://127.0.0.1:8000/orders/",
      },
      {
        source: "/backend/orders/:id/advance",
        destination: "http://127.0.0.1:8000/orders/:id/advance",
      },
      {
        source: "/backend/orders/:id/toggle-invoice",
        destination: "http://127.0.0.1:8000/orders/:id/toggle-invoice",
      },
      {
        source: "/backend/orders/:id/toggle-shipment",
        destination: "http://127.0.0.1:8000/orders/:id/toggle-shipment",
      },
      {
        source: "/backend/orders/:id",
        destination: "http://127.0.0.1:8000/orders/:id",
      },
      {
        source: "/backend/inventory",
        destination: "http://127.0.0.1:8000/inventory/",
      },
      {
        source: "/backend/inventory/",
        destination: "http://127.0.0.1:8000/inventory/",
      },
      {
        source: "/backend/inventory/:id/restock",
        destination: "http://127.0.0.1:8000/inventory/:id/restock",
      },
      {
        source: "/backend/inventory/:id",
        destination: "http://127.0.0.1:8000/inventory/:id",
      },
      {
        source: "/backend/customs",
        destination: "http://127.0.0.1:8000/customs/",
      },
      {
        source: "/backend/customs/",
        destination: "http://127.0.0.1:8000/customs/",
      },
      {
        source: "/backend/customs/:id",
        destination: "http://127.0.0.1:8000/customs/:id",
      },
      {
        source: "/backend/receiving",
        destination: "http://127.0.0.1:8000/receiving/",
      },
      {
        source: "/backend/receiving/",
        destination: "http://127.0.0.1:8000/receiving/",
      },
      {
        source: "/backend/receiving/:id/receive",
        destination: "http://127.0.0.1:8000/receiving/:id/receive",
      },
      {
        source: "/backend/receiving/:id/send-receipt",
        destination: "http://127.0.0.1:8000/receiving/:id/send-receipt",
      },
      {
        source: "/backend/receiving/:id",
        destination: "http://127.0.0.1:8000/receiving/:id",
      },
      {
        source: "/backend/delivery-receipts",
        destination: "http://127.0.0.1:8000/delivery-receipts/",
      },
      {
        source: "/backend/delivery-receipts/",
        destination: "http://127.0.0.1:8000/delivery-receipts/",
      },
      {
        source: "/backend/delivery-receipts/:id",
        destination: "http://127.0.0.1:8000/delivery-receipts/:id",
      },
      {
        source: "/backend/picking",
        destination: "http://127.0.0.1:8000/picking/",
      },
      {
        source: "/backend/picking/",
        destination: "http://127.0.0.1:8000/picking/",
      },
      {
        source: "/backend/picking/:id/start",
        destination: "http://127.0.0.1:8000/picking/:id/start",
      },
      {
        source: "/backend/picking/:id/report-missing",
        destination: "http://127.0.0.1:8000/picking/:id/report-missing",
      },
      {
        source: "/backend/picking/:id/pack",
        destination: "http://127.0.0.1:8000/picking/:id/pack",
      },
      {
        source: "/backend/picking/:id",
        destination: "http://127.0.0.1:8000/picking/:id",
      },
      {
        source: "/backend/dispatch",
        destination: "http://127.0.0.1:8000/dispatch/",
      },
      {
        source: "/backend/dispatch/",
        destination: "http://127.0.0.1:8000/dispatch/",
      },
      {
        source: "/backend/dispatch/:id/items",
        destination: "http://127.0.0.1:8000/dispatch/:id/items",
      },
      {
        source: "/backend/dispatch/:id/items/:itemId/scan",
        destination: "http://127.0.0.1:8000/dispatch/:id/items/:itemId/scan",
      },
      {
        source: "/backend/dispatch/:id/close",
        destination: "http://127.0.0.1:8000/dispatch/:id/close",
      },
      {
        source: "/backend/dispatch/:id",
        destination: "http://127.0.0.1:8000/dispatch/:id",
      },
      {
        source: "/backend/delivery",
        destination: "http://127.0.0.1:8000/delivery/",
      },
      {
        source: "/backend/delivery/",
        destination: "http://127.0.0.1:8000/delivery/",
      },
      {
        source: "/backend/delivery/:id/complete",
        destination: "http://127.0.0.1:8000/delivery/:id/complete",
      },
      {
        source: "/backend/delivery/:id/fail",
        destination: "http://127.0.0.1:8000/delivery/:id/fail",
      },
      {
        source: "/backend/delivery/:id",
        destination: "http://127.0.0.1:8000/delivery/:id",
      },
      {
        source: "/backend/returns",
        destination: "http://127.0.0.1:8000/returns/",
      },
      {
        source: "/backend/returns/",
        destination: "http://127.0.0.1:8000/returns/",
      },
      {
        source: "/backend/returns/:id/resolve",
        destination: "http://127.0.0.1:8000/returns/:id/resolve",
      },
      {
        source: "/backend/returns/:id",
        destination: "http://127.0.0.1:8000/returns/:id",
      },
      {
        source: "/backend/cash/pending",
        destination: "http://127.0.0.1:8000/cash/pending",
      },
      {
        source: "/backend/cash/settlements",
        destination: "http://127.0.0.1:8000/cash/settlements",
      },
      {
        source: "/backend/cash/settlements/:id/confirm",
        destination: "http://127.0.0.1:8000/cash/settlements/:id/confirm",
      },
      {
        source: "/backend/billing/pending",
        destination: "http://127.0.0.1:8000/billing/pending",
      },
      {
        source: "/backend/billing/generate",
        destination: "http://127.0.0.1:8000/billing/generate",
      },
      {
        source: "/backend/customer-portal/login",
        destination: "http://127.0.0.1:8000/customer-portal/login",
      },
      {
        source: "/backend/customer-portal/accounts",
        destination: "http://127.0.0.1:8000/customer-portal/accounts",
      },
      {
        source: "/backend/customer-portal/:id/orders",
        destination: "http://127.0.0.1:8000/customer-portal/:id/orders",
      },
      {
        source: "/backend/customer-portal/:id/shipments",
        destination: "http://127.0.0.1:8000/customer-portal/:id/shipments",
      },
      {
        source: "/backend/customer-portal/:id/invoices",
        destination: "http://127.0.0.1:8000/customer-portal/:id/invoices",
      },
      {
        source: "/backend/payments",
        destination: "http://127.0.0.1:8000/payments/",
      },
      {
        source: "/backend/payments/",
        destination: "http://127.0.0.1:8000/payments/",
      },
      {
        source: "/backend/invoices",
        destination: "http://127.0.0.1:8000/invoices/",
      },
      {
        source: "/backend/invoices/",
        destination: "http://127.0.0.1:8000/invoices/",
      },
    ];
  },
};

export default nextConfig;
