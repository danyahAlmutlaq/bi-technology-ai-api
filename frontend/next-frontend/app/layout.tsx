import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import ApiAuthInterceptor from "./api-auth-interceptor";

export const metadata: Metadata = {
  title: "BI Technology Business OS",
  description: "AI Business Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ApiAuthInterceptor />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
