"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function BudgetPage() {
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const router = useRouter();

  const handleAddBudget = async () => {
    if (!auth.currentUser) return;

    try {
      await addDoc(
        collection(db, "users", auth.currentUser.uid, "budgets"),
        {
          category,
          monthlyLimit: Number(monthlyLimit),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          createdAt: new Date(),
        }
      );

      alert("Budget added successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Set Monthly Budget</h1>

      <input
        type="text"
        placeholder="Category (e.g. Food)"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Monthly Limit"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) => setMonthlyLimit(e.target.value)}
      />

      <button
        onClick={handleAddBudget}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Save Budget
      </button>
    </div>
  );
}