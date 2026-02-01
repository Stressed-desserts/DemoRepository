import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Building2, Users, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/my-properties", label: "My Properties", icon: Building2 },
  { href: "/dashboard/owner", label: "Owner", icon: Users },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center font-bold text-xl border-b">Dashboard</div>
        <nav className="flex-1 py-6">
          <ul className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className={`flex items-center px-6 py-3 rounded-lg transition-colors ${pathname.startsWith(href) ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-10">{children}</main>
    </div>
  );
}
