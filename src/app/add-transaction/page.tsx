"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddTransaction() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch budget categories (Expense only)
  useEffect(() => {
    const fetchCategories = async () => {
      if (!auth.currentUser || type === "income") return;

      const snapshot = await getDocs(
        collection(db, "users", auth.currentUser.uid, "budgets")
      );

      const cats = snapshot.docs.map((doc) => doc.data().category as string);
      setCategories(cats);
    };

    fetchCategories();
  }, [type]);

  // Fetch recent transactions
  useEffect(() => {
    const fetchRecent = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "users", auth.currentUser.uid, "transactions"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentTransactions(data);
    };

    fetchRecent();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("User not logged in");
    if (!category) return alert("Please enter or select a category");

    try {
      setLoading(true);
      await addDoc(
        collection(db, "users", auth.currentUser.uid, "transactions"),
        {
          type,
          category,
          amount,
          note,
          date: serverTimestamp(),
          createdAt: serverTimestamp(),
        }
      );

      alert("Transaction added successfully!");
      router.push("/transactions");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">FinWise</h1>

        <nav className="flex flex-col gap-4 text-gray-600">
          <Link href="/dashboard" className="hover:text-blue-600 transition">
            Dashboard
          </Link>
          <Link href="/add-transaction" className="text-blue-600 font-semibold">
            Add Transaction
          </Link>
          <Link href="/budget" className="hover:text-blue-600 transition">
            Budgets
          </Link>
          <Link href="/transactions" className="hover:text-blue-600 transition">
            Transactions
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Add Transaction
          </h2>
          <p className="text-gray-500 mt-1">
            Record your income or expenses to keep your finances updated.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border">

            <form onSubmit={handleAdd} className="space-y-6">

              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Transaction Type
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setType("expense");
                      setCategory("");
                      setIsOtherCategory(false);
                    }}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                      type === "expense"
                        ? "bg-white shadow text-gray-800"
                        : "text-gray-500"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType("income");
                      setCategory("");
                    }}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                      type === "income"
                        ? "bg-white shadow text-gray-800"
                        : "text-gray-500"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Category
                </label>

                {type === "income" ? (
                  <input
                    type="text"
                    placeholder="e.g., Salary"
                    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                ) : (
                  <>
                    {!isOtherCategory ? (
                      <select
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === "other") {
                            setIsOtherCategory(true);
                            setCategory("");
                          } else {
                            setCategory(e.target.value);
                          }
                        }}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter new category"
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    )}
                  </>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  maxLength={200}
                  placeholder="Add additional details..."
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white py-3 rounded-xl font-medium transition"
                >
                  {loading ? "Adding..." : "Add Transaction"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Transactions
            </h3>

            <div className="space-y-3 text-sm">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-700">
                      {tx.category}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {tx.type}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    ₹ {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}