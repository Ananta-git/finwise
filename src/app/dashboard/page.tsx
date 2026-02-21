"use client";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

type TransactionType = {
  id: string;
  type: "income" | "expense";
  amount: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

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

    // calculate totals
    let income = 0;
    let expense = 0;
    data.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    setTotalIncome(income);
    setTotalExpense(expense);
    setBalance(income - expense);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => router.push("/add-transaction")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Transaction
        </button>

        <button
          onClick={() => router.push("/transactions")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          View Transactions
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Income</p>
          <p className="text-xl font-bold text-green-600">${totalIncome}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Expense</p>
          <p className="text-xl font-bold text-red-600">${totalExpense}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Balance</p>
          <p className="text-xl font-bold">${balance}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
      {transactions.length === 0 && <p>No transactions yet.</p>}
      <ul className="space-y-2">
        {transactions.slice(0, 5).map((t) => (
          <li
            key={t.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span>{t.type.toUpperCase()}: ${t.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}