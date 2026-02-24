"use client";

import { useEffect, useMemo, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Sidebar from "../components/Dashboard/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
  date?: any;
};

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [period, setPeriod] = useState("month");

  // Fetch transactions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(
        collection(db, "users", user.uid, "transactions"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];

      setTransactions(data);
    });

    return () => unsubscribe();
  }, []);

  // Filter by selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      if (!t.date?.toDate) return true;
      const txnDate = t.date.toDate();

      if (period === "month") {
        return (
          txnDate.getMonth() === now.getMonth() &&
          txnDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return txnDate >= weekAgo;
      }

      return true;
    });
  }, [transactions, period]);

  // Summary Calculations
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  // Pie Chart (Expense Distribution)
  const expenseByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc: any, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          "#DC2626",
          "#FBBF24",
          "#2563EB",
          "#16A34A",
          "#F4A261",
        ],
      },
    ],
  };

  // Line Chart (Income vs Expense Trend)
  const dates = Array.from(
    new Set(
      filteredTransactions.map((t) =>
        t.date?.toDate
          ? t.date.toDate().toLocaleDateString()
          : "Unknown"
      )
    )
  );

  const incomeTrend = dates.map((date) =>
    filteredTransactions
      .filter(
        (t) =>
          t.type === "income" &&
          t.date?.toDate &&
          t.date.toDate().toLocaleDateString() === date
      )
      .reduce((a, b) => a + b.amount, 0)
  );

  const expenseTrend = dates.map((date) =>
    filteredTransactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.date?.toDate &&
          t.date.toDate().toLocaleDateString() === date
      )
      .reduce((a, b) => a + b.amount, 0)
  );

  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Income",
        data: incomeTrend,
        borderColor: "#16A34A",
        backgroundColor: "#16A34A",
      },
      {
        label: "Expenses",
        data: expenseTrend,
        borderColor: "#DC2626",
        backgroundColor: "#DC2626",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar */}
      <div className="hidden md:block md:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-2xl font-semibold text-[#0F3D3E]">
              Reports & Analytics
            </h1>
          </div>
        </header>

        <main className="p-6 space-y-8">

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Total Income" value={totalIncome} color="text-green-600" />
            <Card title="Total Expenses" value={totalExpenses} color="text-red-500" />
            <Card title="Net Balance" value={netBalance} color="text-blue-600" />
            <Card
              title="Savings Rate"
              value={
                totalIncome
                  ? `${((netBalance / totalIncome) * 100).toFixed(1)}%`
                  : "0%"
              }
              color="text-yellow-500"
            />
          </div>

        {/* Filters */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <select
                className="w-full sm:w-auto border border-gray-300 bg-gray-50 text-gray-800 px-4 py-3 rounded-xl font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition hover:bg-gray-100"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
            >
                <option value="month">This Month</option>
                <option value="week">Last 7 Days</option>
                <option value="all">All Time</option>
            </select>
        </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h3 className="font-semibold mb-4 text-gray-800">
                Expense Distribution
              </h3>
              <Pie data={pieData} />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border">
              <h3 className="font-semibold mb-4 text-gray-800">
                Income vs Expense Trend
              </h3>
              <Line data={lineData} />
            </div>
          </div>

            {/* Transactions Table */}
            <div className="bg-white p-6 rounded-2xl shadow border overflow-x-auto">
                <h3 className="font-semibold mb-4 text-gray-800 text-lg">
                    Detailed Transactions
                </h3>
                <table className="min-w-full text-left">
                    <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="p-3 text-sm sm:text-base font-medium text-gray-700">Category</th>
                        <th className="p-3 text-sm sm:text-base font-medium text-gray-700">Type</th>
                        <th className="p-3 text-sm sm:text-base font-medium text-gray-700">Amount</th>
                        <th className="p-3 text-sm sm:text-base font-medium text-gray-700">Notes</th>
                        <th className="p-3 text-sm sm:text-base font-medium text-gray-700">Date & Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTransactions.map((t) => {
                        const txnDate = t.date?.toDate ? t.date.toDate() : new Date();
                        const formattedDate = txnDate.toLocaleDateString(); // e.g., 24/02/2026
                        const formattedTime = txnDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., 14:35

                        return (
                        <tr key={t.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-3">{t.category}</td>
                            <td className={`p-3 font-medium ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                            {t.type}
                            </td>
                            <td className="p-3 font-semibold text-gray-800">Rs {t.amount}</td>
                            <td className="p-3 text-gray-500">{t.note || "-"}</td>
                            <td className="p-3 text-gray-600 text-sm sm:text-base">
                            {formattedDate} • {formattedTime}
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

        </main>
      </div>
    </div>
  );
}

// Reusable Card Component
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-2 ${color}`}>
        Rs {value}
      </p>
    </div>
  );
}