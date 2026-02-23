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
  <div className="flex min-h-screen bg-gray-100">

    {/* SIDEBAR */}
    <aside className="w-64 bg-white shadow-xl p-6 hidden lg:block">
      <h2 className="text-2xl font-bold text-blue-600 mb-10 tracking-wide">
        FinWise
      </h2>

      <nav className="space-y-5 text-gray-700 font-medium">
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
        <button className="block hover:text-blue-600">
          Goals
        </button>
        <button className="block hover:text-blue-600">
          Settings
        </button>
      </nav>
    </aside>

    {/* MAIN CONTENT */}
    <div className="flex-1 flex flex-col">

      {/* TOP NAVBAR */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Advanced Dashboard
        </h1>

        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded-lg text-sm focus:outline-none"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8 space-y-10">

        {/* HERO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <HeroCard title="Total Balance" value={balance} color="blue" />
          <HeroCard title="Total Income" value={totalIncome} color="green" />
          <HeroCard title="Total Expense" value={totalExpense} color="red" />
          <HeroCard title="Active Budgets" value={budgets.length} color="yellow" />
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
            color="purple"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* PIE */}
          <ChartCard title="Expense Breakdown">
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
          </ChartCard>

          {/* LINE TREND */}
          <ChartCard title="Income vs Expense Trend">
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

                {percentage > 100 && (
                  <p className="text-red-500 text-xs mt-1">
                    ⚠ Budget exceeded!
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* GOALS SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Savings Goals
          </h2>

          <GoalCard title="Emergency Fund" target={1000} current={balance} />
          <GoalCard title="Vacation" target={500} current={balance} />
        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Recent Transactions
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Category</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2">{t.category || "Other"}</td>
                  <td className="py-2">{t.type}</td>
                  <td
                    className={`py-2 font-semibold ${
                      t.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

const colorStyles: any = {
  blue: {
    border: "border-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  green: {
    border: "border-green-500",
    text: "text-green-600",
    bg: "bg-green-50",
  },
  red: {
    border: "border-red-500",
    text: "text-red-600",
    bg: "bg-red-50",
  },
  yellow: {
    border: "border-yellow-500",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  purple: {
    border: "border-purple-500",
    text: "text-purple-600",
    bg: "bg-purple-50",
  },
};

const HeroCard = ({ title, value, color }: any) => {
  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`p-6 rounded-2xl shadow-md border-l-4 bg-white ${style.border}`}
    >
      <p className="text-sm text-gray-500 tracking-wide">
        {title}
      </p>
      <p className={`text-3xl font-bold mt-3 ${style.text}`}>
        {value}
      </p>
    </div>
  );
};