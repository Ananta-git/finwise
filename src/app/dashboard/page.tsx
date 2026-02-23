"use client";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  // Expense by category
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

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  const expenseMap: any = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const category = t.category || "Other";
      if (!expenseMap[category]) expenseMap[category] = 0;
      expenseMap[category] += Number(t.amount);
    });

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-blue-600 mb-10">
          FinWise
        </h2>

        <nav className="space-y-4 text-gray-700 font-medium">
          <button onClick={() => router.push("/dashboard")} className="block hover:text-blue-600">
            Dashboard
          </button>
          <button onClick={() => router.push("/add-transaction")} className="block hover:text-blue-600">
            Add Transaction
          </button>
          <button onClick={() => router.push("/budget")} className="block hover:text-blue-600">
            Budgets
          </button>
          <button onClick={() => router.push("/transactions")} className="block hover:text-blue-600">
            Transactions
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 space-y-8">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Financial Overview
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow"
          >
            Logout
          </button>
        </div>

        {/* HERO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ${balance}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ${totalIncome}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Total Expense</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              ${totalExpense}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Active Budgets</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {budgets.length}
            </p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Expense Breakdown
            </h2>
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

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Income vs Expense
            </h2>
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

        {/* BUDGET PROGRESS */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Budget Progress
          </h2>

          {budgets.length === 0 && (
            <p className="text-gray-600">No budgets set yet.</p>
          )}

          {budgets.map((budget) => {
            const spent = expenseMap[budget.category] || 0;
            const percentage = (spent / budget.monthlyLimit) * 100;

            return (
              <div key={budget.id} className="mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-700">
                    {budget.category}
                  </span>
                  <span>
                    ${spent} / ${budget.monthlyLimit}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-4 rounded-full">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      percentage > 100
                        ? "bg-red-500"
                        : percentage > 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Transactions
          </h2>

          {transactions.length === 0 && (
            <p className="text-gray-600">No transactions yet.</p>
          )}

          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">
                  {t.category || "Other"}
                </span>
                <span
                  className={`font-semibold ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}