"use client";

import { useState } from "react";

interface AuthCardProps {
  type: "login" | "register";
  onSubmit: (data: { email: string; password: string; fullName?: string }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export default function AuthCard({ type, onSubmit, loading = false, error }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password, fullName });
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-[#0F3D3E]">
        {type === "login" ? "Welcome Back 👋" : "Create Your Account"}
      </h2>
      <p className="text-gray-600 mb-6">
        {type === "login"
          ? "Login to your account"
          : "Start managing your finances today"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "register" && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F4A261] text-white py-2 rounded-lg shadow-md hover:opacity-90 transition"
        >
          {loading
            ? type === "login"
              ? "Logging in..."
              : "Creating account..."
            : type === "login"
            ? "Login"
            : "Create Account"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        {type === "login" ? (
          <>Don't have an account? <a href="/register" className="text-[#F4A261]">Register</a></>
        ) : (
          <>Already have an account? <a href="/login" className="text-[#F4A261]">Login</a></>
        )}
      </div>

      <div className="mt-4 text-center text-gray-500 text-xs">
        🔒 Secured with Firebase Authentication
      </div>
    </div>
  );
}