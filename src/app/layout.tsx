// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata = {
  title: "FinWise",
  description: "Personal Finance Tracker",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
