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
import Sidebar from "../components/Dashboard/Sidebar";
import { useRouter } from "next/navigation";
import { Bar, Pie } from "react-chartjs-2";
import { toast, Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
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
  spent?: number;
  month: number;
  year: number;
  createdAt?: any; // Firestore Timestamp
}

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function BudgetPage() {
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ category?: string; monthlyLimit?: string }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const router = useRouter();

  const filteredBudgets = budgets.filter(
    (b) => b.month === month && b.year === year
  );

  const calculatedBudgets = filteredBudgets.map((budget) => {
    const spent = transactions.reduce((sum, t) => {
      if (t.type !== "expense") return sum;
      if (t.category !== budget.category) return sum;
      if (!t.date?.toDate) return sum;

      const txnDate = t.date.toDate();

      if (
        txnDate.getMonth() + 1 === month &&
        txnDate.getFullYear() === year
      ) {
        return sum + Number(t.amount || 0);
      }

      return sum;
    }, 0);

    return { ...budget, spent };
  });

  // Fetch budgets filtered by month/year
  useEffect(() => {
    let unsubscribeBudgets: any;
    let unsubscribeTransactions: any;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const budgetsRef = collection(db, "users", user.uid, "budgets");
      const transactionsRef = collection(db, "users", user.uid, "transactions");

      unsubscribeBudgets = onSnapshot(
        query(budgetsRef, orderBy("createdAt", "desc")),
        (budgetSnap) => {
          const budgetData: Budget[] = budgetSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Budget, "id">),
          }));
          setBudgets(budgetData);
        }
      );

      unsubscribeTransactions = onSnapshot(transactionsRef, (txnSnap) => {
        const txnData = txnSnap.docs.map((doc) => doc.data());
        setTransactions(txnData);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeBudgets) unsubscribeBudgets();
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, [router]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!category) newErrors.category = "Category is required";
    if (!monthlyLimit || Number(monthlyLimit) <= 0)
      newErrors.monthlyLimit = "Monthly limit must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBudget = async () => {
    if (!validateForm()) return;

    if (!auth.currentUser) return;

    try {
      setLoading(true);
      await addDoc(collection(db, "users", auth.currentUser.uid, "budgets"), {
        category,
        monthlyLimit: Number(monthlyLimit),
        month,
        year,
        createdAt: serverTimestamp(),
      });

      setCategory("");
      setMonthlyLimit("");
      toast.success("Budget added successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "budgets", id));
      toast.success("Budget deleted successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Chart Data
    const barData = {
      labels: calculatedBudgets.map((b) => b.category),
      datasets: [
        {
          label: "Budget",
          data: calculatedBudgets.map((b) => b.monthlyLimit),
          backgroundColor: "#2563EB",
        },
        {
          label: "Spent",
          data: calculatedBudgets.map((b) => b.spent || 0),
          backgroundColor: "#DC2626",
        },
      ],
    };

    const pieData = {
      labels: calculatedBudgets.map((b) => b.category),
      datasets: [
        {
          label: "Budget Distribution",
          data: calculatedBudgets.map((b) => b.monthlyLimit),
          backgroundColor: ["#2563EB", "#FBBF24", "#16A34A", "#F4A261", "#DC2626"],
        },
      ],
    };

    //For latest date calculation in dropdown
    const currentYear = new Date().getFullYear();

    const transactionYears = transactions
      .filter((t) => t.date?.toDate)
      .map((t) => t.date.toDate().getFullYear());

    const budgetYears = budgets.map((b) => b.year);

    const allYears = [...transactionYears, ...budgetYears];

    const startYear =
      allYears.length > 0
        ? Math.min(...allYears)
        : currentYear;

    const years = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex relative">
      <Toaster position="top-right" />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center md:px-10 lg:px-12">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-[#0F3D3E] text-2xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
            <h2 className="text-2xl font-semibold text-[#0F3D3E] tracking-tight">
              Budget Management
            </h2>
          </div>
        </header>

        <main className="p-6 md:p-10 flex-1">
          {/* Month / Year Filter */}
          <div className="flex gap-4 mb-6 items-center">
            <select
              className="border border-gray-300 px-4 py-2 rounded-xl text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              className="border border-gray-300 px-4 py-2 rounded-xl text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold text-[#2563EB]">
                Rs {calculatedBudgets.reduce((a, b) => a + b.monthlyLimit, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-[#DC2626]">
                Rs {calculatedBudgets.reduce((a, b) => a + (b.spent || 0), 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-sm text-gray-500">Remaining Budget</p>
              <p className="text-2xl font-bold text-[#16A34A]">
                Rs {calculatedBudgets.reduce((a, b) => a + b.monthlyLimit - (b.spent || 0), 0)}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Budget Form */}
            <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-md border">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
                Add Budget
              </h3>
              <div className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Food"
                    className={`w-full border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-base focus:ring-2 focus:outline-none transition ${
                      errors.category
                        ? "border-red-500 ring-red-500"
                        : "focus:ring-blue-500 border-gray-300"
                    }`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Monthly Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    placeholder="Rs 0.00"
                    className={`w-full border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-base focus:ring-2 focus:outline-none transition ${
                      errors.monthlyLimit
                        ? "border-red-500 ring-red-500"
                        : "focus:ring-blue-500 border-gray-300"
                    }`}
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                  />
                  {errors.monthlyLimit && (
                    <p className="text-red-500 text-sm mt-1">{errors.monthlyLimit}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-3">
                  <button
                    onClick={handleAddBudget}
                    disabled={loading}
                    className="flex-1 bg-[#F4A261] text-white py-3 rounded-xl font-medium hover:bg-[#e3934b] shadow-md transition text-base"
                  >
                    {loading ? "Adding..." : "Add Budget"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("");
                      setMonthlyLimit("");
                      setErrors({});
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium shadow-sm transition text-base"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Budget List Table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">
                Budget List
              </h3>

              {calculatedBudgets.length === 0 ? (
                <p className="text-gray-400 text-base">No budgets set yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 border-b text-sm font-medium text-gray-700">Category</th>
                        <th className="p-3 border-b text-sm font-medium text-gray-700">Monthly Limit</th>
                        <th className="p-3 border-b text-sm font-medium text-gray-700">Spent</th>
                        <th className="p-3 border-b text-sm font-medium text-gray-700">Remaining</th>
                        <th className="p-3 border-b text-sm font-medium text-gray-700">Progress</th>
                        <th className="p-3 border-b text-sm font-medium text-gray-700">Updated</th>
                        <th className="p-3 border-b text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedBudgets.map((b, idx) => {
                        const remaining = b.monthlyLimit - (b.spent || 0);
                        const percent = Math.min(
                          100,
                          ((b.spent || 0) / b.monthlyLimit) * 100
                        );
                        const progressColor =
                          percent < 80 ? "#16A34A" : percent <= 100 ? "#FBBF24" : "#DC2626";
                        const rowBg = idx % 2 === 0 ? "bg-white" : "bg-gray-50";

                        return (
                          <tr
                            key={b.id}
                            className={`${rowBg} hover:bg-gray-100 transition-colors`}
                          >
                            <td className="p-3 text-gray-800 font-medium">{b.category}</td>
                            <td className="p-3 text-gray-800 font-medium">Rs {b.monthlyLimit}</td>
                            <td className="p-3 text-gray-800 font-medium">Rs {b.spent || 0}</td>
                            <td className="p-3 text-gray-800 font-medium">Rs {remaining}</td>
                            <td className="p-3">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${percent}%`, backgroundColor: progressColor }}
                                />
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-500">
                              {b.createdAt?.toDate
                                ? b.createdAt.toDate().toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="p-3 flex gap-2">
                              <button
                                onClick={() => handleDeleteBudget(b.id)}
                                className="text-red-500 hover:underline text-sm font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          {calculatedBudgets.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-2xl shadow border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget vs Spent</h3>
                <Bar data={barData} options={{ responsive: true }} />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Distribution</h3>
                <Pie data={pieData} options={{ responsive: true }} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}