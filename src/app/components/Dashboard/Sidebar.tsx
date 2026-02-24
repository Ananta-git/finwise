"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Wallet,
  BarChart3,
  Target,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Add Transaction", path: "/add-transaction", icon: PlusCircle },
    { label: "Budgets", path: "/budget", icon: Wallet },
    { label: "Reports", path: "/transactions", icon: BarChart3 },
    { label: "Goals", path: "/goals", icon: Target },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 px-6 py-8 flex lg:flex flex-col">
      {/* Logo */}
      <h2 className="text-2xl font-bold text-[#0F3D3E] tracking-tight mb-12">
        FinWise
      </h2>

      {/* Navigation */}
      <nav className="space-y-3">
        {navItems.map((item, i) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={i}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-[#EEF7F7] text-[#0F3D3E] shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-[#0F3D3E]"
                }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}