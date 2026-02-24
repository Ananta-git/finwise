"use client";

export default function GoalCard({ title, target, current }: any) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="mb-7">
      <div className="flex justify-between text-sm mb-2 text-gray-600">
        <span>{title}</span>
        <span>${current} / ${target}</span>
      </div>
      <div className="w-full bg-gray-200 h-3 rounded-full">
        <div
          className="bg-[#0F3D3E] h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}