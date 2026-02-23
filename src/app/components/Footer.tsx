"use client";

import Link from "next/link";

interface FooterProps {
  minimal?: boolean; // for auth pages if needed
}

export default function Footer({ minimal = false }: FooterProps) {
  return (
    <footer className="bg-[#111827] text-gray-300 pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto">

        {!minimal && (
          <div className="grid md:grid-cols-3 gap-12 mb-10">

            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">FinWise</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Smart personal finance management built with modern
                technologies. Secure, fast, and easy to use.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="hover:text-[#F4A261] transition">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#F4A261] transition">
                    Register
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#F4A261] transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#F4A261] transition">
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:anantalawati6@gmail.com"
                    className="hover:text-[#F4A261] transition"
                  >
                    anantalawati6@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Ananta-git"
                    target="_blank"
                    className="hover:text-[#F4A261] transition"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    className="hover:text-[#F4A261] transition"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

          </div>
        )}

        {/* Bottom Line */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FinWise. All rights reserved. <br />
          Built with Next.js & powered by Firebase.
        </div>

      </div>
    </footer>
  );
}