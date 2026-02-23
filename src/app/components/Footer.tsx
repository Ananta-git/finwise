export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1F2937] text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

        {/* Branding / Logo */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-bold text-white">FinWise</h3>

          <p className="text-gray-400 text-sm">
            © 2026 FinWise. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Built with Next.js & powered by Firebase.
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
          <p>
            Email:{" "}
            <a
              href="mailto:anantalawati6@gmail.com"
              className="hover:text-[#F4A261] transition"
            >
              anantalawati6@gmail.com
            </a>
          </p>
          <p>
            GitHub:{" "}
            <a
              href="https://github.com/Ananta-git"
              target="_blank"
              className="hover:text-[#F4A261] transition"
            >
              FinWise GitHub
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-[#F4A261] transition"
            >
              FinWise LinkedIn
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Made with 💌 by Ananta Lawati
      </div>
    </footer>
  );
}