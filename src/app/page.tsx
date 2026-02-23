"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false); // ✅ add this


  return (
    <div className="bg-[#F8FBFA] text-gray-800">

    {/* ================= NAVBAR ================= */}
    <nav className="fixed top-0 w-full backdrop-blur-md bg-white/70 border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#0F3D3E] tracking-wide">
          FinWise
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-[#0F3D3E] transition">Features</a>
          <a href="#about" className="hover:text-[#0F3D3E] transition">About</a>
          <a href="#contact" className="hover:text-[#0F3D3E] transition">Contact</a>

          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 rounded-lg border border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 rounded-lg bg-[#F4A261] text-white shadow-md hover:opacity-90 transition"
          >
            Register
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-[#0F3D3E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 border-t border-gray-200">
          <div className="flex flex-col gap-4 px-6 py-4 text-sm font-medium">
            <a href="#features" className="hover:text-[#0F3D3E] transition">Features</a>
            <a href="#about" className="hover:text-[#0F3D3E] transition">About</a>
            <a href="#contact" className="hover:text-[#0F3D3E] transition">Contact</a>

            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-lg border border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white transition w-full"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2 rounded-lg bg-[#F4A261] text-white shadow-md hover:opacity-90 transition w-full"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>

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
                onClick={() => router.push("/register")}
                className="px-8 py-4 bg-[#0F3D3E] text-white rounded-xl shadow-lg hover:scale-105 transition"
              >
                Get Started
              </button>

              <button
                onClick={() => router.push("/login")}
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
      <footer id="contact" className="bg-[#1F2937] text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Branding / Logo */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-white">FinWise</h3>
            <p className="text-gray-400 text-sm">
              © 2026 FinWise. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Built with Next.js & powered by Firebase
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <a href="/login" className="hover:text-[#F4A261] transition">Login</a>
            <a href="/register" className="hover:text-[#F4A261] transition">Register</a>
            <a href="#features" className="hover:text-[#F4A261] transition">Features</a>
            <a href="#about" className="hover:text-[#F4A261] transition">About</a>
          </div>

          {/* Contact / Social */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-white font-semibold mb-2">Contact</h4>
            <p>Email: <a href="mailto:support@finwise.app" className="hover:text-[#F4A261] transition">support@finwise.app</a></p>
            <p>GitHub: <a href="https://github.com/yourrepo" target="_blank" className="hover:text-[#F4A261] transition">FinWise GitHub</a></p>
            <p>LinkedIn: <a href="https://linkedin.com" target="_blank" className="hover:text-[#F4A261] transition">FinWise LinkedIn</a></p>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Made with ❤️ by FinWise Team
        </div>
      </footer>

    </div>
  );
}