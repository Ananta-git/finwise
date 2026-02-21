// src/app/layout.tsx
import "./globals.css"; // Tailwind styles
import { ReactNode } from "react";

export const metadata = {
  title: "FinWise",
  description: "Personal Finance Tracker",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}