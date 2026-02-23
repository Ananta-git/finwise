"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#E2F3F5] to-[#F8FBFA]">

      {/* Minimal Navbar */}
      <nav className="w-full py-4 px-6 flex justify-between items-center bg-white/50 backdrop-blur-md shadow-sm">
        <Link href="/" className="text-2xl font-bold text-[#0F3D3E]">
          FinWise
        </Link>
        <Link href="/" className="text-sm text-[#0F3D3E] hover:text-[#F4A261] transition">
          Back to Home
        </Link>
      </nav>

      {/* Centered Auth Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

          {/* Left Branding Panel */}
          <div className="hidden md:flex flex-col justify-center space-y-6 bg-gradient-to-br from-[#0F3D3E]/20 to-[#F4A261]/20 p-12 rounded-2xl">
            <h1 className="text-4xl font-bold text-[#0F3D3E]">FinWise</h1>
            <p className="text-[#0F3D3E]/80 text-lg font-medium">Track smarter. Spend wiser.</p>
            <p className="text-gray-700 max-w-sm">
              Manage your income, expenses, budgets, and financial growth — all in one place.
            </p>
            {/* Optional Dashboard Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 max-w-xs">
              <div className="h-4 w-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-[#F0FFF4] rounded mb-4"></div>
              <div className="h-16 bg-[#E6FFFA] rounded mb-2"></div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-[#0F3D3E] mb-2">Create Your Account</h2>
            <p className="text-gray-600 mb-6">Start managing your finances today</p>

            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition"
                required
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full py-3 bg-[#0F3D3E] text-white rounded-xl shadow-md hover:scale-105 transition disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Register"}
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#F4A261] font-medium hover:underline">
                Login
              </Link>
            </p>

            <p className="mt-6 text-xs text-gray-600 text-center flex items-center justify-center gap-1">
              🔒 Secured with Firebase Authentication
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}