"use client";

export default function SectionCard({ title, children }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-[#0F3D3E] mb-8">{title}</h2>
      {children}
    </div>
  );
}