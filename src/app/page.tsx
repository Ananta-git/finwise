"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{ backgroundColor: scrolled ? "#FFFFFF" : "transparent" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#2563EB" }}
            >
              FinWise
            </Link>

            <div className="flex items-center space-x-6 font-medium">
              <Link href="#features" style={{ color: "#111827" }}>
                Features
              </Link>
              <Link href="/login" style={{ color: "#2563EB" }}>
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-lg text-white transition"
                style={{ backgroundColor: "#2563EB" }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        className="pt-32 pb-24 px-6"
        style={{
          background:
            "linear-gradient(to bottom right, #F9FAFB, #FFFFFF)",
        }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* LEFT */}
          <div>
            <h1
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
              style={{ color: "#111827" }}
            >
              Smart Money.
              <br />
              <span style={{ color: "#2563EB" }}>
                Smarter Decisions.
              </span>
            </h1>

            <p
              className="text-xl mb-8"
              style={{ color: "#6B7280" }}
            >
              Track income, control expenses, plan budgets and
              grow your savings — all inside one powerful dashboard.
            </p>

            <div className="flex space-x-4">
              <Link
                href="/register"
                className="px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition"
                style={{ backgroundColor: "#2563EB" }}
              >
                Create Free Account
              </Link>

              <Link
                href="/login"
                className="px-8 py-3 rounded-lg font-semibold border transition"
                style={{
                  borderColor: "#2563EB",
                  color: "#2563EB",
                }}
              >
                Login
              </Link>
            </div>

            {/* Gold Accent Trust Badge */}
            <div
              className="mt-8 inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: "#FEF3C7",
                color: "#F59E0B",
              }}
            >
              Trusted by 2,000+ users
            </div>
          </div>

          {/* RIGHT DASHBOARD PREVIEW */}
          <div
            className="p-8 rounded-2xl shadow-2xl"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <span
                  className="font-semibold"
                  style={{ color: "#111827" }}
                >
                  Total Balance
                </span>
                <span
                  className="text-3xl font-bold"
                  style={{ color: "#16A34A" }}
                >
                  $12,345
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "#6B7280" }}>Income</span>
                  <span style={{ color: "#16A34A" }}>+$5,000</span>
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <span style={{ color: "#6B7280" }}>Expenses</span>
                  <span style={{ color: "#DC2626" }}>-$2,350</span>
                </div>

                <div
                  className="w-full h-3 rounded-full"
                  style={{ backgroundColor: "#F3F4F6" }}
                >
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: "65%",
                      backgroundColor: "#2563EB",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="py-20 px-6"
        style={{ backgroundColor: "#F3F4F6" }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl font-bold text-center mb-16"
            style={{ color: "#111827" }}
          >
            Built for Financial Clarity
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Income Tracking",
                color: "#16A34A",
                bg: "#DCFCE7",
                desc: "Monitor all your earnings with precision."
              },
              {
                title: "Expense Control",
                color: "#DC2626",
                bg: "#FEE2E2",
                desc: "Understand where your money goes."
              },
              {
                title: "Budget Goals",
                color: "#F59E0B",
                bg: "#FEF3C7",
                desc: "Set smart limits and achieve savings targets."
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl shadow-sm transition hover:shadow-lg"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <div
                  className="w-12 h-12 rounded-lg mb-6"
                  style={{ backgroundColor: item.bg }}
                ></div>

                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h3>

                <p style={{ color: "#6B7280" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        className="py-10 text-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <p style={{ color: "#9CA3AF" }}>
          FinWise © 2026 • Built with precision.
        </p>
      </footer>
    </div>
  );
}