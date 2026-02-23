"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
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

type TransactionType = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

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
      if (!user) router.push("/login");
      else {
        fetchTransactions();
        fetchBudgets();
      }
    });

    return () => unsubscribe();
  }, []);

  // Expense breakdown
  const expenseByCategory = Object.values(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc: any, curr: any) => {
        const category = curr.category || "Other";
        if (!acc[category]) acc[category] = { name: category, value: 0 };
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

  const totalBudgetLimit = budgets.reduce(
    (sum, b) => sum + Number(b.monthlyLimit || 0),
    0
  );

  const budgetUsagePercent =
    totalBudgetLimit > 0
      ? Math.min((totalExpense / totalBudgetLimit) * 100, 100)
      : 0;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="p-6">
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
              Reports
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-700 text-2xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Financial Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </header>

        <main className="p-6 space-y-8">

          {/* HERO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <HeroCard title="Total Balance" value={`$${balance}`} color="blue" />
            <HeroCard title="Total Income" value={`$${totalIncome}`} color="green" />
            <HeroCard title="Total Expense" value={`$${totalExpense}`} color="red" />
            <HeroCard title="Budget Usage" value={`${Math.round(budgetUsagePercent)}%`} color="purple" />

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <ChartCard title="Expense Breakdown">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={50}
                  >
                    {expenseByCategory.map((entry, index) => {
                      const colors = [
                        "#2563EB",
                        "#16A34A",
                        "#DC2626",
                        "#9333EA",
                        "#F59E0B",
                        "#06B6D4",
                      ];
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
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
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? "#16A34A" : "#DC2626"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>

          {/* BUDGET PROGRESS */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Budget Comparison
            </h2>

            {budgets.map((budget) => {
              const spent = expenseMap[budget.category] || 0;
              const percentage = (spent / budget.monthlyLimit) * 100;

              return (
                <div key={budget.id} className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{budget.category}</span>
                    <span>${spent} / ${budget.monthlyLimit}</span>
                  </div>

                  <div className="w-full bg-gray-200 h-4 rounded-full">
                    <div
                      className={`h-4 rounded-full ${
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

        </main>
      </div>
    </div>
  );
}

/* -------------------- COMPONENTS -------------------- */

const colorStyles: any = {
  blue: { border: "border-blue-500", text: "text-blue-600" },
  green: { border: "border-green-500", text: "text-green-600" },
  red: { border: "border-red-500", text: "text-red-600" },
  purple: { border: "border-purple-500", text: "text-purple-600" },
};

const HeroCard = ({ title, value, color }: any) => {
  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-md border-l-4 ${style.border}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-3 ${style.text}`}>
        {value}
      </p>
    </div>
  );
};

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      {title}
    </h2>
    {children}
  </div>
);