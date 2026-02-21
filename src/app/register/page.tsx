"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User Registered!");
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form onSubmit={handleRegister} className="bg-white  text-black p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full text-black border p-2 mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full  text-black border p-2 mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white w-full p-2">
          Register
        </button>
      </form>
    </div>
  );
}