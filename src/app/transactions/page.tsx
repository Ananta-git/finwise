"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth"; // Added this
import { updateDoc } from "firebase/firestore";
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
  const [loading, setLoading] = useState(true); // Added loading state for better UX

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState<number>(0);

  //handle edit
  const handleEdit = async (id: string) => {
  if (!auth.currentUser) return;
  try {
    await updateDoc(
      doc(db, "users", auth.currentUser.uid, "transactions", id),
      {
        category: editCategory,
        amount: editAmount,
      }
    );
    setEditingId(null);
    fetchTransactions(auth.currentUser.uid);
  } catch (error) {
    console.error(error);
  }
};

  // Modified to take the uid directly so it doesn't depend on global timing
  const fetchTransactions = async (userId: string) => {
    try {
      const q = query(
        collection(db, "users", userId, "transactions"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TransactionType[];
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "transactions", id));
      fetchTransactions(auth.currentUser.uid); // refresh with active UID
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  useEffect(() => {
    // Listen for auth state changes. This safely handles the initial loading delay
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTransactions(user.uid);
      } else {
        setTransactions([]);
        setLoading(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl text-black font-bold mb-4">Transactions</h1>

      {loading ? (
        <p className="text-black">Loading your financial ledger...</p>
      ) : transactions.length === 0 ? (
        <p className="text-black">No transactions yet.</p>
      ) : (
        <ul className="space-y-2 text-black">
        {transactions.map((t) => (
            <li
            key={t.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
            <div className="flex-1">
                {/* EDIT MODE */}
                {editingId === t.id ? (
                <div className="space-y-2">
                    <input
                    className="border px-2 py-1 rounded w-full"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    />

                    <input
                    type="number"
                    className="border px-2 py-1 rounded w-full"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    />

                    <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => handleEdit(t.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        Save
                    </button>

                    <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                ) : (
                <>
                    <p className="font-bold">
                    {t.category} ({t.type})
                    </p>
                    <p>${t.amount}</p>
                    {t.note && <p className="text-gray-500 text-sm">{t.note}</p>}
                </>
                )}
            </div>

            {/* ACTION BUTTONS */}
            {editingId !== t.id && (
                <div className="flex gap-2 ml-4">
                {/* EDIT BUTTON */}
                <button
                    onClick={() => {
                    setEditingId(t.id);
                    setEditCategory(t.category);
                    setEditAmount(t.amount);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                >
                    ✏️
                </button>

                {/* DELETE BUTTON */}
                <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                >
                    🗑
                </button>
                </div>
            )}
            </li>
        ))}
        </ul>
      )}
    </div>
  );
}
