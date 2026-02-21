"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddTransaction() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("User not logged in");

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

        <select
          className="w-full border p-2 mb-3"
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2 mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 mb-3"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />

        <input
          type="text"
          placeholder="Note (optional)"
          className="w-full border p-2 mb-3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Transaction
        </button>
      </form>
    </div>
  );
}