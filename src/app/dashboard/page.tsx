"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

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

  // Expense by Category
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 px-6 md:px-10 py-8 space-y-10">

        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Financial Overview</h1>
            <p className="text-gray-700 mt-1">
              Track your income, expenses and budget performance.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push("/add-transaction")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Add Transaction
            </button>

            <button
              onClick={() => router.push("/budget")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Set Budget
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p className="text-black font-medium">Total Balance</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ${balance}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p className="text-black font-medium">Total Income</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${totalIncome}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p className="text-black font-medium">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ${totalExpense}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p className="text-black font-medium">Transactions</p>
            <p className="text-3xl font-bold text-black mt-2">
              {transactions.length}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Expense Pie */}
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-xl font-bold text-black mb-4">
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

          {/* Income vs Expense */}
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-xl font-bold text-black mb-4">
              Income vs Expense
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#000" />
                <YAxis stroke="#000" />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-bold text-black mb-6">
            Budget Progress
          </h2>

          {budgets.length === 0 && (
            <p className="text-black">No budgets set yet.</p>
          )}

          {budgets.map((budget) => {
            const spent = expenseMap[budget.category] || 0;
            const percentage = (spent / budget.monthlyLimit) * 100;

            return (
              <div key={budget.id} className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-black">
                    {budget.category}
                  </span>
                  <span className="font-medium text-black">
                    ${spent} / ${budget.monthlyLimit}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-4 rounded-full">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      percentage > 100 ? "bg-red-600" : "bg-green-600"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                {percentage > 100 && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    Budget exceeded
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4">
            Recent Transactions
          </h2>

          {transactions.length === 0 && (
            <p className="text-black">No transactions yet.</p>
          )}

          <div className="space-y-4">
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-2xl shadow-md border flex justify-between items-center"
              >
                <span className="font-semibold text-black">
                  {t.category || "Other"}
                </span>

                <span
                  className={`text-lg font-bold ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"} ${t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}