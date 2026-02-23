"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
  );
}