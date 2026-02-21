"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

type TransactionType = {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

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
  };

  const handleDelete = async (id: string) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "transactions", id));
    fetchTransactions(); // refresh
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl text-black font-bold mb-4">Transactions</h1>
      {transactions.length === 0 && <p>No transactions yet.</p>}

      <ul className="space-y-2 text-black">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{t.category} ({t.type})</p>
              <p>${t.amount}</p>
              {t.note && <p className="text-black">{t.note}</p>}
            </div>
            <button
              onClick={() => handleDelete(t.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}