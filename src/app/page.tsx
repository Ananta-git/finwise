// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to FinWise</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Track your income and expenses, set budgets, and see your financial health at a glance.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/register")}
          className="bg-blue-500 text-blac px-6 py-3 rounded shadow hover:bg-blue-600 transition"
        >
          Register
        </button>

        <button
          onClick={() => router.push("/login")}
          className="bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}