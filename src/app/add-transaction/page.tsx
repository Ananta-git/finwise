"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import Sidebar from "../components/Dashboard/Sidebar";
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

export default function AddTransaction() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-[#F9FAFB] flex relative">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center md:px-10 lg:px-12">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-[#0F3D3E] text-2xl"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>

            <h2 className="text-2xl font-semibold text-[#0F3D3E] tracking-tight">
              Add Transaction
            </h2>
          </div>
        </header>

        <main className="p-6 md:p-10 flex-1">

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Form Card */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border">

              <form onSubmit={handleAdd} className="space-y-6">
                {/* Transaction Type, Category, Amount, Note */}
                {/* ...keep your existing form fields here... */}
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
                      <p className="font-medium text-gray-700">{tx.category}</p>
                      <p className="text-gray-400 text-xs">{tx.type}</p>
                    </div>
                    <p
                      className={`font-semibold ${
                        tx.type === "income" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      ₹ {tx.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}