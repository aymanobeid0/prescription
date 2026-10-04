"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "لوحة القيادة", exact: true },
    { href: "/dashboard/calendar", label: "المواعيد" },
    { href: "/dashboard/patients", label: "المرضى" },
    { href: "/designer", label: "مصمم المستندات" },
    { href: "/dashboard/settings", label: "إعدادات العيادة" },
  ];

  return (
    <nav className="flex-1 p-4 flex flex-col gap-2">
      {links.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href);

        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`p-2 rounded-md transition-colors font-medium ${
              isActive 
                ? "bg-sky-600 text-white shadow-sm" 
                : "text-slate-700 hover:bg-sky-50 hover:text-sky-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}



