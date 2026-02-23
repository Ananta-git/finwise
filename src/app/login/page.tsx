"use client";

import Navbar from "../components/Navbar";
import BrandingPanel from "../components/BrandingPanel";
import AuthCard from "../components/AuthCard";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar minimal showAuthButtons={false} />

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#E2F3F5] to-[#F8FBFA]">
          <BrandingPanel />
        </div>
        <div className="flex flex-1 justify-center items-center p-6">
          <AuthCard type="login" onSubmit={handleLogin} loading={loading} error={error} />
        </div>
      </div>
      <Footer minimal />    </div>
  );
}