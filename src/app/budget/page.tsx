"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  doc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Sidebar from "../components/Dashboard/Sidebar";
import { Bar, Pie } from "react-chartjs-2";
import { toast, Toaster } from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  month: number;
  year: number;
  createdAt?: any;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function BudgetPage() {
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ category?: string; monthlyLimit?: string }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ================= AUTH LISTENER ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /* ================= REALTIME BUDGET LISTENER ================= */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "budgets"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Budget[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Budget, "id">),
        }))
        .filter((b) => b.month === month && b.year === year);

      setBudgets(data);
    });

    return () => unsubscribe();
  }, [user, month, year]);

  /* ================= REALTIME TRANSACTION LISTENER ================= */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(txData);
    });

    return () => unsubscribe();
  }, [user]);

  /* ================= CALCULATE SPENT ================= */
  const budgetsWithSpent = budgets.map((b) => {
    const totalSpent = transactions
      .filter((t) => {
        if (t.type !== "expense") return false;
        if (t.category !== b.category) return false;
        if (!t.createdAt?.seconds) return false;

        const date = new Date(t.createdAt.seconds * 1000);

        return (
          date.getMonth() + 1 === b.month &&
          date.getFullYear() === b.year
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return { ...b, spent: totalSpent };
  });

  const totalBudget = budgetsWithSpent.reduce((a, b) => a + b.monthlyLimit, 0);
  const totalSpent = budgetsWithSpent.reduce((a, b) => a + (b.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!category) newErrors.category = "Category is required";
    if (!monthlyLimit || Number(monthlyLimit) <= 0)
      newErrors.monthlyLimit = "Monthly limit must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= ADD BUDGET ================= */
  const handleAddBudget = async () => {
    if (!validateForm()) return;
    if (!user) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "users", user.uid, "budgets"), {
        category,
        monthlyLimit: Number(monthlyLimit),
        month,
        year,
        createdAt: serverTimestamp(),
      });

      setCategory("");
      setMonthlyLimit("");
      setErrors({});
      toast.success("Budget added successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteBudget = async (id: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "budgets", id));
      toast.success("Budget deleted successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  /* ================= CHART DATA ================= */
  const barData = {
    labels: budgetsWithSpent.map((b) => b.category),
    datasets: [
      {
        label: "Budget",
        data: budgetsWithSpent.map((b) => b.monthlyLimit),
        backgroundColor: "#2563EB",
      },
      {
        label: "Spent",
        data: budgetsWithSpent.map((b) => b.spent || 0),
        backgroundColor: "#DC2626",
      },
    ],
  };

  const pieData = {
    labels: budgetsWithSpent.map((b) => b.category),
    datasets: [
      {
        label: "Budget Distribution",
        data: budgetsWithSpent.map((b) => b.monthlyLimit),
        backgroundColor: ["#2563EB", "#FBBF24", "#16A34A", "#F4A261", "#DC2626"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex relative">
      <Toaster position="top-right" />

      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col w-full">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center md:px-10 lg:px-12">
          <h2 className="text-2xl font-semibold text-[#0F3D3E] tracking-tight">
            Budget Management
          </h2>
        </header>

        <main className="p-6 md:p-10 flex-1">

          {/* Month / Year */}
          <div className="flex gap-4 mb-6 items-center">
            <select
              className="border border-gray-300 px-4 py-2 rounded-xl"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 px-4 py-2 rounded-xl"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold text-[#2563EB]">
                Rs {totalBudget}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-[#DC2626]">
                Rs {totalSpent}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Remaining Budget</p>
              <p className="text-2xl font-bold text-[#16A34A]">
                Rs {totalRemaining}
              </p>
            </div>
          </div>

          {/* Rest of your table + charts remain SAME but use budgetsWithSpent */}

          {/* Charts */}
          {budgetsWithSpent.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-2xl shadow border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Budget vs Spent
                </h3>
                <Bar data={barData} options={{ responsive: true }} />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Budget Distribution
                </h3>
                <Pie data={pieData} options={{ responsive: true }} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}