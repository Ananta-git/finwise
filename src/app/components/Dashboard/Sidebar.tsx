"use client";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Add Transaction", path: "/add-transaction" },
    { label: "Budgets", path: "/budget" },
    { label: "Reports", path: "/transactions" },
    { label: "Goals" },
    { label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 px-8 py-10 hidden lg:block">
      <h2 className="text-2xl font-bold text-[#0F3D3E] tracking-tight mb-14">
        FinWise
      </h2>

      <nav className="space-y-7 text-[15px] font-medium text-gray-500">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => item.path && router.push(item.path)}
            className="block hover:text-[#0F3D3E] transition duration-200"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}