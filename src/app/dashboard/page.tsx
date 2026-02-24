"use client";

import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
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

import Sidebar from "../components/Dashboard/Sidebar";
import HeroCard from "../components/Dashboard/HeroCard";
import ChartCard from "../components/Dashboard/ChartCard";
import SectionCard from "../components/Dashboard/SectionCard";
import GoalCard from "../components/Dashboard/GoalCard";
import RecentTransactions from "../components/Dashboard/RecentTransactions";

type TransactionType = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category?: string;
  createdAt?: any;
};

export default function Dashboard() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const data: TransactionType[] = snapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        type: docData.type,
        amount: Number(docData.amount),
        category: docData.category || "Other",
        createdAt: docData.createdAt || null,
      };
    });

    setTransactions(data);

    let income = 0;
    let expense = 0;

    data.forEach((t) =>
      t.type === "income" ? (income += t.amount) : (expense += t.amount)
    );

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
      if (!user) router.push("/login");
      else {
        fetchTransactions();
        fetchBudgets();
      }
    });

    return () => unsubscribe();
  }, []);

  const expenseByCategory = Object.values(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc: any, curr: TransactionType) => {
        const category = curr.category || "Other";
        if (!acc[category]) acc[category] = { name: category, value: 0 };
        acc[category].value += curr.amount;
        return acc;
      }, {})
  );

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  const expenseMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const category = t.category || "Other";
      if (!expenseMap[category]) expenseMap[category] = 0;
      expenseMap[category] += t.amount;
    });

  return (
    <div className="flex min-h-screen bg-[#F4F7F6] relative">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 md:px-10 lg:px-12 py-4 flex justify-between items-center">

          <div className="flex items-center gap-4">
            {/* Hamburger */}
            <button
              className="md:hidden text-[#0F3D3E] text-2xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>

            <h1 className="text-xl sm:text-2xl font-semibold text-[#0F3D3E] tracking-tight">
              Financial Overview
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search transactions..."
              className="hidden sm:block border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]/20 transition"
            />

            <button
              onClick={handleLogout}
              className="bg-[#F4A261] text-white px-5 py-2.5 rounded-xl text-sm shadow-sm hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="px-4 sm:px-6 md:px-10 lg:px-12 py-8 sm:py-10 space-y-12">

          {/* Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <HeroCard title="Total Balance" value={balance} color="primary" />
            <HeroCard title="Total Income" value={totalIncome} color="income" />
            <HeroCard title="Total Expense" value={totalExpense} color="expense" />
            <HeroCard title="Active Budgets" value={budgets.length} color="accent" />
            <HeroCard
              title="Budget Usage %"
              value={
                budgets.length
                  ? Math.round(
                      (totalExpense /
                        budgets.reduce(
                          (a, b) => a + Number(b.monthlyLimit),
                          0
                        )) *
                        100
                    )
                  : 0
              }
              color="primary"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Expense Breakdown">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" outerRadius={100} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Income vs Expense">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#0F3D3E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Budget Comparison */}
          <SectionCard title="Budget Comparison">
            {budgets.map((budget) => {
              const spent = expenseMap[budget.category] || 0;
              const percentage = (spent / budget.monthlyLimit) * 100;

              return (
                <div key={budget.id} className="mb-6">
                  <div className="flex justify-between text-sm mb-2 text-gray-600">
                    <span>{budget.category}</span>
                    <span>
                      ${spent} / ${budget.monthlyLimit}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded-full">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        percentage > 100
                          ? "bg-[#DC2626]"
                          : percentage > 80
                          ? "bg-[#F4A261]"
                          : "bg-[#16A34A]"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </SectionCard>

          {/* Goals */}
          <SectionCard title="Savings Goals">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GoalCard title="Emergency Fund" target={1000} current={balance} />
              <GoalCard title="Vacation" target={500} current={balance} />
            </div>
          </SectionCard>

          {/* Recent Transactions */}
          <SectionCard title="Recent Transactions">
            <div className="overflow-x-auto">
              <RecentTransactions transactions={transactions} />
            </div>
          </SectionCard>

          <footer className="text-center text-sm text-gray-400 pt-4">
            FinWise v1.0 • Smart Finance Tracker
          </footer>

        </main>
      </div>
    </div>
  );
}