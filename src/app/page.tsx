"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  // Navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              FinWise
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="#features" className="hover:opacity-80">
                Features
              </Link>
              <Link href="#about" className="hover:opacity-80">
                About
              </Link>
              <Link href="#contact" className="hover:opacity-80">
                Contact
              </Link>

              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Take Control of Your{" "}
              <span className="text-blue-600">Financial Future</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Track income, manage expenses, set budgets, and visualize your
              financial growth — all in one simple app.
            </p>

            <div className="flex space-x-4">
              <Link
                href="/register"
                className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="px-8 py-3 rounded-lg font-semibold border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Account Balance</span>
                <span className="text-2xl font-bold text-green-600">
                  $12,345
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Income</span>
                  <span className="text-green-600">+$5,000</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Expenses</span>
                  <span className="text-red-600">-$2,350</span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full w-[70%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage your money
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Smart Dashboard",
                desc: "View income, expenses, balance & charts instantly.",
              },
              {
                icon: "💰",
                title: "Expense Tracking",
                desc: "Categorize and manage daily spending easily.",
              },
              {
                icon: "📈",
                title: "Budget Planning",
                desc: "Set monthly limits and monitor progress.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to take control of your money?
        </h2>

        <p className="text-gray-600 mb-8">
          Join thousands of users improving their financial health.
        </p>

        <Link
          href="/register"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Free Account
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 border-t bg-white text-center text-gray-500">
        FinWise © 2026 • Built with Next.js & Firebase
      </footer>
    </div>
  );
}