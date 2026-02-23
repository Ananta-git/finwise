"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-[#F8FBFA] text-gray-800">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-white/70 border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-[#0F3D3E] tracking-wide">
            FinWise
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-[#0F3D3E] transition">
              Features
            </a>
            <a href="#about" className="hover:text-[#0F3D3E] transition">
              About
            </a>
            <a href="#contact" className="hover:text-[#0F3D3E] transition">
              Contact
            </a>

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
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#0F3D3E]">
              Take Control of <br /> Your Financial Future
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Track income, manage expenses, set budgets, and visualize your
              financial growth — all in one beautifully simple app.
            </p>

            <div className="mt-8 flex gap-4">
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

          {/* Mock Dashboard Preview */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="h-4 w-20 bg-gray-200 rounded mb-6"></div>
            <div className="h-24 bg-[#E2F3F5] rounded-lg mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-100 rounded-lg"></div>
              <div className="h-20 bg-gray-100 rounded-lg"></div>
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
      <footer id="contact" className="bg-white border-t border-gray-200 py-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
          
          <div className="text-[#0F3D3E] font-semibold">
            FinWise © 2026
          </div>

          <div className="flex flex-col gap-2">
            <a href="/login" className="hover:text-[#0F3D3E]">Login</a>
            <a href="/register" className="hover:text-[#0F3D3E]">Register</a>
            <a href="#features" className="hover:text-[#0F3D3E]">Features</a>
          </div>

          <div className="flex flex-col gap-2">
            <p>Email: support@finwise.app</p>
            <p>Built with Next.js</p>
            <p>Powered by Firebase</p>
          </div>

        </div>
      </footer>

    </div>
  );
}