"use client";

import Image from "next/image";

interface BrandingPanelProps {
  showDashboardPreview?: boolean;
}

export default function BrandingPanel({ showDashboardPreview = true }: BrandingPanelProps) {
  return (
    <div className="flex flex-col justify-center items-start p-8 sm:p-12 text-center md:text-left space-y-6">
      <h1 className="text-5xl font-bold text-[#0F3D3E]">FinWise</h1>
      <p className="text-xl text-gray-700">Track smarter. Spend wiser.</p>
      <p className="text-gray-600 max-w-md">
        Manage your income, expenses, budgets, and financial growth — all in one place.
      </p>

      {showDashboardPreview && (
        <div className="mt-6 relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 max-w-sm mx-auto md:mx-0">
          {/* Top Bar */}
          <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
          {/* Mock Balance Box */}
          <div className="h-20 bg-[#F0FFF4] rounded-lg mb-4 flex flex-col justify-between p-3">
            <p className="text-gray-600 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-[#0F3D3E]">$5,250.00</p>
          </div>
          {/* Income / Expenses */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-[#E6FFFA] rounded-lg p-2 flex flex-col justify-between">
              <p className="text-green-600 text-sm font-medium">Income</p>
              <p className="text-green-700 font-bold text-lg">+$3,200</p>
            </div>
            <div className="h-16 bg-[#FFF5F5] rounded-lg p-2 flex flex-col justify-between">
              <p className="text-red-600 text-sm font-medium">Expenses</p>
              <p className="text-red-700 font-bold text-lg">-$1,150</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}