"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddTransaction() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<string[]>([]); // 🔹
  const router = useRouter();

  // 🔹 Fetch categories from budget collection
  useEffect(() => {
    const fetchCategories = async () => {
      if (!auth.currentUser) return;

      const snapshot = await getDocs(
        collection(db, "users", auth.currentUser.uid, "budgets")
      );

      const cats = snapshot.docs.map(doc => doc.data().category);
      setCategories(cats);
    };

    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("User not logged in");
    if (!category) return alert("Please select a category");

    try {
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
      alert("Transaction added!");
      router.push("/transactions");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

        {/* Type Selector */}
        <select
          className="w-full text-black border p-2 mb-3 rounded"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category Dropdown */}
        {categories.length > 0 ? (
          <select
            className="w-full text-black border p-2 mb-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Category (No budgets yet)"
            className="w-full text-black border p-2 mb-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        )}

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          className="w-full text-black border p-2 mb-3 rounded"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />

        {/* Note */}
        <input
          type="text"
          placeholder="Note (optional)"
          className="w-full text-black border p-2 mb-3 rounded"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition">
          Add Transaction
        </button>
      </form>
    </div>
  );
}