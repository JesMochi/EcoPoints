"use client";

import { useRouter } from "next/navigation";
import { Building2, LogOut, QrCode, List } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { signOut } from "@/lib/auth";
import Link from "next/link";

export default function CentroPage() {
  const { profile, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-eco-50">
        <Building2 className="h-6 w-6 text-eco-600 animate-pulse" />
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
          <Building2 className="h-6 w-6 text-eco-600" />
          <span className="font-bold text-eco-800 text-lg">
            Centro de Acopio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{profile?.username}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Panel del centro
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/centro/generar-qr"
            className="bg-eco-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <QrCode className="h-8 w-8" />
            <span className="font-semibold">Generar QR</span>
          </Link>
          <Link
            href="/centro/historial"
            className="bg-eco-700 text-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <List className="h-8 w-8" />
            <span className="font-semibold">Historial</span>
          </Link>
        </div>
        <p className="mt-10 text-center text-sm text-gray-400">
          Panel completo — Paso 5
        </p>
      </main>
    </div>
  );
}
