"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const modules = [
  { name: "لوحة التحكم", href: "/dashboard" },
  { name: "العملاء", href: "/customers" },
  { name: "الفواتير", href: "/invoices" },
  { name: "المدفوعات", href: "/payments" },
  { name: "الشحنات", href: "/shipments" },
  { name: "الخدمات", href: "/services" },
  { name: "المخزون", href: "/inventory" },
  { name: "المصروفات", href: "/expenses" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      dir="rtl"
      className="fixed right-0 top-0 z-50 h-screen w-72 overflow-y-auto bg-slate-900 p-6 text-white"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-black">BI Technology</h1>
        <p className="mt-1 text-sm text-slate-400">ERP System</p>
      </div>

      <nav className="space-y-2">
        {modules.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 font-bold transition ${
                active
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}