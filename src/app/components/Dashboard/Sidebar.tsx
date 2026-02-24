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
    <aside className="flex flex-col h-screen bg-white border-r border-gray-200
                      w-20 lg:w-64 transition-all duration-300">

      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start px-4 py-6">
        <h2 className="text-xl lg:text-2xl font-bold text-[#0F3D3E] tracking-tight">
          <span className="hidden lg:inline">FinWise</span>
          <span className="lg:hidden">FW</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 px-2 lg:px-4">
        {navItems.map((item, i) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={i}
              onClick={() => router.push(item.path)}
              className={`flex items-center justify-center lg:justify-start
                gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#EEF7F7] text-[#0F3D3E] shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-[#0F3D3E]"
                }`}
            >
              <Icon size={20} />

              {/* Hide text on small screens */}
              <span className="hidden lg:inline">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}