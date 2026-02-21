"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Welcome to FinWise Dashboard</h1>
      <button className="bg-red-500 text-white p-2" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}