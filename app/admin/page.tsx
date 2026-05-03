"use client";

import { useRouter } from "next/navigation";
import { Shield, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { signOut } from "@/lib/auth";

export default function AdminPage() {
  const { profile, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-eco-50">
        <Shield className="h-6 w-6 text-eco-600 animate-pulse" />
      </div>
    );
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-eco-50">
      <header className="bg-white border-b border-eco-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-eco-600" />
          <span className="font-bold text-eco-800 text-lg">
            Admin — EcoPoints
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Panel de administración
        </h1>
        <p className="text-gray-500">
          Sesión activa:{" "}
          <span className="font-medium">{profile?.email}</span>
        </p>
      </main>
    </div>
  );
}
