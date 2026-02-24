"use client";

const colorMap: any = {
  primary: "border-[#0F3D3E] text-[#0F3D3E]",
  income: "border-[#16A34A] text-[#16A34A]",
  expense: "border-[#DC2626] text-[#DC2626]",
  accent: "border-[#F4A261] text-[#F4A261]",
};

export default function HeroCard({ title, value, color }: any) {
  return (
    <div className={`bg-white p-7 rounded-2xl border-l-4 shadow-sm ${colorMap[color]}`}>
      <p className="text-sm text-gray-400 uppercase tracking-wide">{title}</p>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}