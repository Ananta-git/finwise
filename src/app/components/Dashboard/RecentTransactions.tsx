"use client";

export default function RecentTransactions({ transactions }: any) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 border-b">
          <th className="pb-4">Category</th>
          <th className="pb-4">Type</th>
          <th className="pb-4 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.slice(0, 5).map((t: any) => (
          <tr key={t.id} className="border-b">
            <td className="py-4">{t.category || "Other"}</td>
            <td className="py-4 capitalize">{t.type}</td>
            <td
              className={`py-4 text-right font-semibold ${
                t.type === "income" ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}
            >
              ${t.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}