"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser
      if (!user) return

      const querySnapshot = await getDocs(
        collection(db, "users", user.uid, "transactions")
      )

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      setTransactions(data)
      setLoading(false)
    }

    fetchTransactions()
  }, [])

  const handleDelete = async (id: string) => {
    const user = auth.currentUser
    if (!user) return

    await deleteDoc(doc(db, "users", user.uid, "transactions", id))

    setTransactions(transactions.filter(t => t.id !== id))
  }

  // ✅ Calculations
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const balance = totalIncome - totalExpense

  // ✅ Pie Data
  const expenseByCategory = Object.values(
    transactions
      .filter(t => t.type === "expense")
      .reduce((acc: any, curr: any) => {
        if (!acc[curr.category]) {
          acc[curr.category] = { name: curr.category, value: 0 }
        }
        acc[curr.category].value += Number(curr.amount)
        return acc
      }, {})
  )

  // ✅ Bar Data
  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ]

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">
            Rs {totalIncome}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Expense</h2>
          <p className="text-2xl font-bold text-red-600">
            Rs {totalExpense}
          </p>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Balance</h2>
          <p className="text-2xl font-bold text-blue-600">
            Rs {balance}
          </p>
        </div>
      </div>

      {/* 🔹 Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseByCategory}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Income vs Expense</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Transactions List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">All Transactions</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-gray-500">
                    {t.category} • {t.type}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={
                      t.type === "income"
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    Rs {t.amount}
                  </span>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}