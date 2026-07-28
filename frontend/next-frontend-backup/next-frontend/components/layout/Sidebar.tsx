"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Truck,
  Package,
  BriefcaseBusiness,
  Receipt,
  UserRound,
  FolderOpen,
  Settings,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

const menuItems = [
  {
    labelAr: "لوحة التحكم",
    labelEn: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    labelAr: "العملاء",
    labelEn: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    labelAr: "الفواتير",
    labelEn: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    labelAr: "المدفوعات",
    labelEn: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    labelAr: "الشحنات",
    labelEn: "Shipments",
    href: "/shipments",
    icon: Truck,
  },
  {
    labelAr: "المخزون",
    labelEn: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    labelAr: "الخدمات",
    labelEn: "Services",
    href: "/services",
    icon: BriefcaseBusiness,
  },
  {
    labelAr: "المصروفات",
    labelEn: "Expenses",
    href: "/expenses",
    icon: Receipt,
  },
  {
    labelAr: "الموظفون",
    labelEn: "Employees",
    href: "/employees",
    icon: UserRound,
  },
  {
    labelAr: "المستندات",
    labelEn: "Documents",
    href: "/documents",
    icon: FolderOpen,
  },
  {
    labelAr: "الإعدادات",
    labelEn: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">BI Technology</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${active ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{t(item.labelAr, item.labelEn)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}