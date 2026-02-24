"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Wallet,
  BarChart3,
  Target,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Add Transaction", path: "/add-transaction", icon: PlusCircle },
    { label: "Budgets", path: "/budget", icon: Wallet },
    { label: "Reports", path: "/transactions", icon: BarChart3 },
    { label: "Goals", path: "/goals", icon: Target },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const NavContent = () => (
    <nav className="space-y-2 mt-10">
      {navItems.map((item, i) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={i}
            onClick={() => {
              router.push(item.path);
              setIsOpen(false);
            }}
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
  );

  return (
    <>
      {/* ========== MOBILE TOP BAR ========== */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#0F3D3E]">
          <span className="sm:hidden">FW</span>
          <span className="hidden sm:inline">FinWise</span>
        </h2>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* ========== MOBILE OVERLAY ========== */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ========== MOBILE DRAWER ========== */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:hidden`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#0F3D3E]">FinWise</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="px-6">
          <NavContent />
        </div>
      </aside>

      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 px-6 py-8 min-h-screen">
        <h2 className="text-2xl font-bold text-[#0F3D3E] tracking-tight mb-8">
          FinWise
        </h2>

        <NavContent />
      </aside>
    </>
  );
}