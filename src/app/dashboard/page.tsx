"use client";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

type TransactionType = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [budgets, setBudgets] = useState<any[]>([]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const fetchTransactions = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "users", auth.currentUser.uid, "transactions"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TransactionType[];

    setTransactions(data);

    let income = 0;
    let expense = 0;

    data.forEach((t) => {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setBalance(income - expense);
  };

  const fetchBudgets = async () => {
  if (!auth.currentUser) return;

  const snapshot = await getDocs(
    collection(db, "users", auth.currentUser.uid, "budgets")
  );

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setBudgets(data);
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    } else {
      fetchTransactions();
      fetchBudgets();
    }
  });

  return () => unsubscribe();
}, []);

  // 🔹 Pie Chart Data (Expenses by category)
  const expenseByCategory = Object.values(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc: any, curr: any) => {
        const category = curr.category || "Other";

        if (!acc[category]) {
          acc[category] = { name: category, value: 0 };
        }

        acc[category].value += Number(curr.amount);
        return acc;
      }, {})
  );

  // 🔹 Bar Chart Data
  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  // 🔹 Expense by Category for Budget Comparison
const expenseMap: any = {};

transactions
  .filter((t) => t.type === "expense")
  .forEach((t) => {
    const category = t.category || "Other";
    if (!expenseMap[category]) expenseMap[category] = 0;
    expenseMap[category] += Number(t.amount);
  });

  return (
    <div className="p-6 min-h-screen bg-gray-100 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl text-black font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </header>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/add-transaction")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Add Transaction
        </button>

        <button
          onClick={() => router.push("/budget")}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          Set Budget
        </button>

        <button
          onClick={() => router.push("/transactions")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700"
        >
          View Transactions
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Income</p>
          <p className="text-2xl font-bold text-green-600">${totalIncome}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Expense</p>
          <p className="text-2xl font-bold text-red-600">${totalExpense}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Balance</p>
          <p className="text-2xl font-bold text-blue-600">${balance}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg text-black font-bold mb-4">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg text-black font-bold mb-4">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl text-black font-bold mb-4">Budget Progress</h2>

        {budgets.length === 0 && (
          <p className="text-black">No budgets set yet.</p>
        )}

        {budgets.map((budget) => {
          const spent = expenseMap[budget.category] || 0;
          const percentage = (spent / budget.monthlyLimit) * 100;

          return (
            <div key={budget.id} className="mb-5">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-black">{budget.category}</span>
                <span>
                  ${spent} / ${budget.monthlyLimit}
                </span>
              </div>

              <div className="w-full bg-gray-500 h-4 rounded">
                <div
                  className={`h-4 rounded transition-all duration-500 ${
                    percentage > 100 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              {percentage > 100 && (
                <p className="text-red-500 text-xs mt-1">
                  Budget exceeded!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-xl text-black font-bold mb-3">
          Recent Transactions
        </h2>

        {transactions.length === 0 && <p>No transactions yet.</p>}

        <ul className="space-y-3">
          {transactions.slice(0, 5).map((t) => (
            <li
              key={t.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <span
                className={
                  t.type === "income"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {t.type.toUpperCase()}: ${t.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}