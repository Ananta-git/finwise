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
    <div className="flex min-h-screen bg-[#F8FBFA] text-gray-800">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 p-8 hidden lg:block">
        <h2 className="text-2xl font-bold text-[#0F3D3E] tracking-wide mb-12">
          FinWise
        </h2>

        <nav className="space-y-6 text-sm font-medium text-gray-600">
          <button onClick={() => router.push("/dashboard")} className="block hover:text-[#0F3D3E] transition">
            Dashboard
          </button>
          <button onClick={() => router.push("/add-transaction")} className="block hover:text-[#0F3D3E] transition">
            Add Transaction
          </button>
          <button onClick={() => router.push("/budget")} className="block hover:text-[#0F3D3E] transition">
            Budgets
          </button>
          <button onClick={() => router.push("/transactions")} className="block hover:text-[#0F3D3E] transition">
            Reports
          </button>
          <button className="block hover:text-[#0F3D3E] transition">
            Goals
          </button>
          <button className="block hover:text-[#0F3D3E] transition">
            Settings
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-10 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#0F3D3E] tracking-tight">
            Advanced Dashboard
          </h1>

          <div className="flex items-center gap-6">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]/20"
            />
            <button
              onClick={handleLogout}
              className="bg-[#F4A261] text-white px-5 py-2 rounded-xl text-sm shadow-sm hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-10 space-y-12">

          {/* HERO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                        budgets.reduce((a, b) => a + Number(b.monthlyLimit), 0)) *
                        100
                    )
                  : 0
              }
              color="primary"
            />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <ChartCard title="Expense Breakdown">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" outerRadius={100} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Income vs Expense">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#0F3D3E" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>

          {/* FOOTER */}
          <footer className="text-center text-sm text-gray-500 pt-10">
            FinWise v1.0 • Smart Finance Tracker
          </footer>

        </main>
      </div>
    </div>
  );
}

/* COLOR SYSTEM */

const colorStyles: any = {
  primary: {
    border: "border-[#0F3D3E]",
    text: "text-[#0F3D3E]",
  },
  accent: {
    border: "border-[#F4A261]",
    text: "text-[#F4A261]",
  },
  income: {
    border: "border-[#16A34A]",
    text: "text-[#16A34A]",
  },
  expense: {
    border: "border-[#DC2626]",
    text: "text-[#DC2626]",
  },
};

const HeroCard = ({ title, value, color }: any) => {
  const style = colorStyles[color] || colorStyles.primary;

  return (
    <div className={`p-6 rounded-2xl bg-white border-l-4 shadow-sm ${style.border}`}>
      <p className="text-sm text-gray-500 tracking-wide">
        {title}
      </p>
      <p className={`text-3xl font-bold mt-3 ${style.text}`}>
        {value}
      </p>
    </div>
  );
};

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2 className="text-lg font-semibold text-[#0F3D3E] mb-4">
      {title}
    </h2>
    {children}
  </div>
);