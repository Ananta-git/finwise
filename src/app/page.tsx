"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "@/lib/AuthContext";

    export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    /**
     * OPTIONAL: Auto redirect logged-in users
     * This gives YouTube/Facebook-like behavior
     */
    useEffect(() => {
        if (loading) return;
        if (user) {
        router.replace("/dashboard");
        }
    }, [user, loading, router]);
    /**
     * Prevent UI decision before auth is ready
     * (avoids incorrect state flashes)
     */
    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
            Loading...
        </div>
        );
    }

  return (
    <div className="bg-[#F8FBFA] text-gray-800">

      {/* ================= NAVBAR ================= */}
      <Header />

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-r from-[#E2F3F5] to-[#F8FBFA]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">

          {/* Hero Text */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#0F3D3E]">
              Take Control of <br /> Your Financial Future
            </h1>

            <p className="mt-6 text-lg text-gray-700 max-w-xl">
              Track income, manage expenses, set budgets, and visualize your
              financial growth — all in one beautifully simple app.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
            onClick={() => {
                if (user) router.push("/dashboard");
                else router.push("/register");
            }}
            className="px-8 py-4 bg-[#0F3D3E] text-white rounded-xl shadow-lg hover:scale-105 transition"
            >
            Get Started
            </button>

            <button
            onClick={() => {
                if (user) router.push("/dashboard");
                else router.push("/login");
            }}
            className="px-8 py-4 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
            Login
            </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 max-w-md mx-auto">

            {/* Optional Finance Illustration */}
            <div className="absolute top-4 right-4 opacity-20">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0F3D3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="12" x2="14" y2="14" />
              </svg>
            </div>

            {/* Top Bar */}
            <div className="h-4 w-20 bg-gray-200 rounded mb-6"></div>

            {/* Balance Box */}
            <div className="h-24 bg-[#F0FFF4] rounded-lg p-4 flex flex-col justify-between mb-6">
              <p className="text-gray-600 text-sm">Current Balance</p>
              <p className="text-2xl font-bold text-[#0F3D3E]">$5,250.00</p>
            </div>

            {/* Income / Expense Boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-[#E6FFFA] rounded-lg p-3 flex flex-col justify-between">
                <p className="text-green-600 text-sm font-medium">Income</p>
                <p className="text-green-700 font-bold text-lg">+$3,200</p>
              </div>

              <div className="h-20 bg-[#FFF5F5] rounded-lg p-3 flex flex-col justify-between">
                <p className="text-red-600 text-sm font-medium">Expenses</p>
                <p className="text-red-700 font-bold text-lg">-$1,150</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#0F3D3E] mb-4">
            Powerful Yet Simple
          </h2>
          <p className="text-gray-600 mb-16">
            Everything you need to manage your personal finances efficiently.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Smart Dashboard",
                desc: "View income, expenses, balance & charts instantly.",
              },
              {
                title: "Expense Tracking",
                desc: "Categorize and manage daily spending easily.",
              },
              {
                title: "Budget Planning",
                desc: "Set monthly limits and monitor progress.",
              },
              {
                title: "Transaction History",
                desc: "Keep a complete log of all financial activities.",
              },
              {
                title: "Visual Reports",
                desc: "Pie charts and bar graphs for smarter decisions.",
              },
              {
                title: "Cloud Sync",
                desc: "Securely access your data anytime, anywhere.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-[#F8FBFA] hover:shadow-xl transition border border-gray-100"
              >
                <div className="text-[#F4A261] text-3xl mb-4">●</div>
                <h3 className="text-xl font-semibold mb-2 text-[#0F3D3E]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#0F3D3E] mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              "Create an Account",
              "Add Your Income & Expenses",
              "Track Progress & Improve Savings",
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="w-16 h-16 mx-auto bg-[#0F3D3E] text-white flex items-center justify-center rounded-full text-xl font-bold mb-6 shadow-lg">
                  {i + 1}
                </div>
                <p className="text-lg text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section id="about" className="py-24 bg-[#0F3D3E] text-white px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Why Choose FinWise?
            </h2>
            <ul className="space-y-4 text-lg">
              <li>✔ 100% Free</li>
              <li>✔ Secure Firebase Authentication</li>
              <li>✔ Cloud-Based Storage</li>
              <li>✔ Beginner-Friendly Interface</li>
              <li>✔ No Ads</li>
              <li>✔ Fast Performance</li>
            </ul>
          </div>

          <div className="bg-white text-[#0F3D3E] rounded-2xl p-10 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Your Data. Your Control.
            </h3>
            <p>
              Built using modern technologies with privacy and simplicity in
              mind. Designed to grow with you.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 text-center px-6">
        <h2 className="text-4xl font-bold text-[#0F3D3E] mb-6">
          Ready to take control of your money?
        </h2>

        <button
          onClick={() => router.push("/register")}
          className="px-10 py-5 bg-[#F4A261] text-white rounded-2xl shadow-xl text-lg hover:scale-105 transition"
        >
          Create Free Account
        </button>

        <p className="mt-4 text-gray-500 text-sm">
          No credit card required.
        </p>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
