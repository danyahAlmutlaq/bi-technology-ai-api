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
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/backend/invoices/:id",
        destination: `${backendUrl}/invoices/:id`,
      },
      {
        source: "/backend/invoices/:id/print",
        destination: `${backendUrl}/invoices/:id/print`,
      },
      {
        source: "/backend/reports",
        destination: `${backendUrl}/reports/`,
      },
      {
        source: "/backend/reports/",
        destination: `${backendUrl}/reports/`,
      },
      {
        source: "/backend/reports/export",
        destination: `${backendUrl}/reports/export`,
      },
      {
        source: "/backend/insights",
        destination: `${backendUrl}/insights/`,
      },
      {
        source: "/backend/insights/",
        destination: `${backendUrl}/insights/`,
      },
      {
        source: "/backend/auth/login",
        destination: `${backendUrl}/auth/login`,
      },
      {
        source: "/backend/auth/logout",
        destination: `${backendUrl}/auth/logout`,
      },
      {
        source: "/backend/auth/me",
        destination: `${backendUrl}/auth/me`,
      },
      {
        source: "/backend/users",
        destination: `${backendUrl}/users/`,
      },
      {
        source: "/backend/users/",
        destination: `${backendUrl}/users/`,
      },
      {
        source: "/backend/users/:id",
        destination: `${backendUrl}/users/:id`,
      },
      {
        source: "/backend/bookings",
        destination: `${backendUrl}/bookings/`,
      },
      {
        source: "/backend/bookings/",
        destination: `${backendUrl}/bookings/`,
      },
      {
        source: "/backend/bookings/:id/status",
        destination: `${backendUrl}/bookings/:id/status`,
      },
      {
        source: "/backend/customers",
        destination: `${backendUrl}/customers/`,
      },
      {
        source: "/backend/customers/",
        destination: `${backendUrl}/customers/`,
      },
      {
        source: "/backend/customers/:id",
        destination: `${backendUrl}/customers/:id`,
      },
      {
        source: "/backend/shipments",
        destination: `${backendUrl}/shipments/`,
      },
      {
        source: "/backend/shipments/",
        destination: `${backendUrl}/shipments/`,
      },
      {
        source: "/backend/shipments/:id",
        destination: `${backendUrl}/shipments/:id`,
      },
      {
        source: "/backend/delivery-companies",
        destination: `${backendUrl}/delivery-companies/`,
      },
      {
        source: "/backend/delivery-companies/",
        destination: `${backendUrl}/delivery-companies/`,
      },
      {
        source: "/backend/delivery-companies/:id",
        destination: `${backendUrl}/delivery-companies/:id`,
      },
      {
        source: "/backend/orders",
        destination: `${backendUrl}/orders/`,
      },
      {
        source: "/backend/orders/",
        destination: `${backendUrl}/orders/`,
      },
      {
        source: "/backend/orders/:id/advance",
        destination: `${backendUrl}/orders/:id/advance`,
      },
      {
        source: "/backend/orders/:id/toggle-invoice",
        destination: `${backendUrl}/orders/:id/toggle-invoice`,
      },
      {
        source: "/backend/orders/:id/toggle-shipment",
        destination: `${backendUrl}/orders/:id/toggle-shipment`,
      },
      {
        source: "/backend/orders/:id",
        destination: `${backendUrl}/orders/:id`,
      },
      {
        source: "/backend/inventory",
        destination: `${backendUrl}/inventory/`,
      },
      {
        source: "/backend/inventory/",
        destination: `${backendUrl}/inventory/`,
      },
      {
        source: "/backend/inventory/:id/restock",
        destination: `${backendUrl}/inventory/:id/restock`,
      },
      {
        source: "/backend/inventory/:id",
        destination: `${backendUrl}/inventory/:id`,
      },
      {
        source: "/backend/warehouses",
        destination: `${backendUrl}/warehouses/`,
      },
      {
        source: "/backend/warehouses/",
        destination: `${backendUrl}/warehouses/`,
      },
      {
        source: "/backend/warehouses/:id",
        destination: `${backendUrl}/warehouses/:id`,
      },
      {
        source: "/backend/customs",
        destination: `${backendUrl}/customs/`,
      },
      {
        source: "/backend/customs/",
        destination: `${backendUrl}/customs/`,
      },
      {
        source: "/backend/customs/:id",
        destination: `${backendUrl}/customs/:id`,
      },
      {
        source: "/backend/receiving",
        destination: `${backendUrl}/receiving/`,
      },
      {
        source: "/backend/receiving/",
        destination: `${backendUrl}/receiving/`,
      },
      {
        source: "/backend/receiving/:id/receive",
        destination: `${backendUrl}/receiving/:id/receive`,
      },
      {
        source: "/backend/receiving/:id/send-receipt",
        destination: `${backendUrl}/receiving/:id/send-receipt`,
      },
      {
        source: "/backend/receiving/:id",
        destination: `${backendUrl}/receiving/:id`,
      },
      {
        source: "/backend/delivery-receipts",
        destination: `${backendUrl}/delivery-receipts/`,
      },
      {
        source: "/backend/delivery-receipts/",
        destination: `${backendUrl}/delivery-receipts/`,
      },
      {
        source: "/backend/delivery-receipts/:id",
        destination: `${backendUrl}/delivery-receipts/:id`,
      },
      {
        source: "/backend/picking",
        destination: `${backendUrl}/picking/`,
      },
      {
        source: "/backend/picking/",
        destination: `${backendUrl}/picking/`,
      },
      {
        source: "/backend/picking/:id/start",
        destination: `${backendUrl}/picking/:id/start`,
      },
      {
        source: "/backend/picking/:id/report-missing",
        destination: `${backendUrl}/picking/:id/report-missing`,
      },
      {
        source: "/backend/picking/:id/pack",
        destination: `${backendUrl}/picking/:id/pack`,
      },
      {
        source: "/backend/picking/:id",
        destination: `${backendUrl}/picking/:id`,
      },
      {
        source: "/backend/dispatch",
        destination: `${backendUrl}/dispatch/`,
      },
      {
        source: "/backend/dispatch/",
        destination: `${backendUrl}/dispatch/`,
      },
      {
        source: "/backend/dispatch/:id/items",
        destination: `${backendUrl}/dispatch/:id/items`,
      },
      {
        source: "/backend/dispatch/:id/items/:itemId/scan",
        destination: `${backendUrl}/dispatch/:id/items/:itemId/scan`,
      },
      {
        source: "/backend/dispatch/:id/close",
        destination: `${backendUrl}/dispatch/:id/close`,
      },
      {
        source: "/backend/dispatch/:id",
        destination: `${backendUrl}/dispatch/:id`,
      },
      {
        source: "/backend/delivery",
        destination: `${backendUrl}/delivery/`,
      },
      {
        source: "/backend/delivery/",
        destination: `${backendUrl}/delivery/`,
      },
      {
        source: "/backend/delivery/:id/complete",
        destination: `${backendUrl}/delivery/:id/complete`,
      },
      {
        source: "/backend/delivery/:id/fail",
        destination: `${backendUrl}/delivery/:id/fail`,
      },
      {
        source: "/backend/delivery/:id",
        destination: `${backendUrl}/delivery/:id`,
      },
      {
        source: "/backend/returns",
        destination: `${backendUrl}/returns/`,
      },
      {
        source: "/backend/returns/",
        destination: `${backendUrl}/returns/`,
      },
      {
        source: "/backend/returns/:id/resolve",
        destination: `${backendUrl}/returns/:id/resolve`,
      },
      {
        source: "/backend/returns/:id",
        destination: `${backendUrl}/returns/:id`,
      },
      {
        source: "/backend/cash/pending",
        destination: `${backendUrl}/cash/pending`,
      },
      {
        source: "/backend/cash/settlements",
        destination: `${backendUrl}/cash/settlements`,
      },
      {
        source: "/backend/cash/settlements/:id/confirm",
        destination: `${backendUrl}/cash/settlements/:id/confirm`,
      },
      {
        source: "/backend/billing/pending",
        destination: `${backendUrl}/billing/pending`,
      },
      {
        source: "/backend/billing/generate",
        destination: `${backendUrl}/billing/generate`,
      },
      {
        source: "/backend/customer-portal/login",
        destination: `${backendUrl}/customer-portal/login`,
      },
      {
        source: "/backend/customer-portal/accounts",
        destination: `${backendUrl}/customer-portal/accounts`,
      },
      {
        source: "/backend/customer-portal/:id/orders",
        destination: `${backendUrl}/customer-portal/:id/orders`,
      },
      {
        source: "/backend/customer-portal/:id/shipments",
        destination: `${backendUrl}/customer-portal/:id/shipments`,
      },
      {
        source: "/backend/customer-portal/:id/invoices",
        destination: `${backendUrl}/customer-portal/:id/invoices`,
      },
      {
        source: "/backend/payments",
        destination: `${backendUrl}/payments/`,
      },
      {
        source: "/backend/payments/",
        destination: `${backendUrl}/payments/`,
      },
      {
        source: "/backend/invoices",
        destination: `${backendUrl}/invoices/`,
      },
      {
        source: "/backend/invoices/",
        destination: `${backendUrl}/invoices/`,
      },
    ];
  },
};

export default nextConfig;
