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
  Cell,
} from "recharts";

import CountUp from "react-countup";

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
    <div className="flex min-h-screen bg-[#F8FBFA]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white/80 backdrop-blur-md shadow-lg p-6 hidden lg:block border-r border-gray-100">
        <h2 className="text-2xl font-bold text-[#0F3D3E] mb-10 tracking-wide">
          FinWise
        </h2>

        <nav className="space-y-4 text-sm font-medium">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Add Transaction", path: "/add-transaction" },
            { name: "Budgets", path: "/budget" },
            { name: "Reports", path: "/transactions" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="block w-full text-left px-3 py-2 rounded-xl hover:bg-[#E2F3F5] hover:text-[#0F3D3E] transition-all duration-200"
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#0F3D3E]">
            Advanced Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-[#F4A261] hover:scale-105 active:scale-95 transition-all duration-300 text-white px-4 py-2 rounded-xl shadow-sm"
          >
            Logout
          </button>
        </header>

        <main className="p-8 space-y-10 animate-fadeIn">

          {/* HERO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <HeroCard title="Total Balance" value={balance} color="#0F3D3E" />
            <HeroCard title="Total Income" value={totalIncome} color="#16A34A" />
            <HeroCard title="Total Expense" value={totalExpense} color="#DC2626" />
            <HeroCard title="Active Budgets" value={budgets.length} color="#F4A261" />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Expense Breakdown">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" outerRadius={100}>
                    {expenseByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#0F3D3E", "#F4A261", "#16A34A", "#DC2626"][index % 4]}
                      />
                    ))}
                  </Pie>
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

          {/* BUDGET PROGRESS */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold mb-6 text-[#0F3D3E]">
              Budget Comparison
            </h2>

            {budgets.map((budget) => {
              const spent = expenseMap[budget.category] || 0;
              const percentage = (spent / budget.monthlyLimit) * 100;

              return (
                <div key={budget.id} className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{budget.category}</span>
                    <span>${spent} / ${budget.monthlyLimit}</span>
                  </div>

                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div
                      className="h-4 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor:
                          percentage > 100
                            ? "#DC2626"
                            : percentage > 80
                            ? "#F4A261"
                            : "#16A34A",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const HeroCard = ({ title, value, color }: any) => (
  <div
    className="p-6 rounded-2xl shadow-md border-l-4 bg-white
    transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    style={{ borderColor: color }}
  >
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-3" style={{ color }}>
      <CountUp end={value} duration={1.2} separator="," />
    </p>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
    <h2 className="text-lg font-semibold text-[#0F3D3E] mb-4">
      {title}
    </h2>
    {children}
  </div>
);