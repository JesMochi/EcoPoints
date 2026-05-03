"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Building2,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { signUp, getRoleRedirect } from "@/lib/auth";
import type { UserRole } from "@/types";

type RoleOption = Extract<UserRole, "ciudadano" | "centro_acopio">;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "ciudadano" as RoleOption,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await signUp(form);

      if (data.session) {
        // Confirmación automática (email confirm desactivado en Supabase)
        router.push(getRoleRedirect(form.role));
        router.refresh();
      } else {
        // Supabase requiere confirmación de correo
        setSuccess(
          "¡Cuenta creada! Revisa tu correo y haz clic en el enlace de confirmación."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear la cuenta";
      setError(
        msg.includes("already registered")
          ? "Este correo ya está registrado"
          : msg
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-eco-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Casi listo!
          </h2>
          <p className="text-gray-500 mb-6">{success}</p>
          <Link
            href="/login"
            className="inline-block bg-eco-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-eco-700 transition-colors"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-eco-100 mb-4">
            <Leaf className="h-8 w-8 text-eco-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Únete a EcoPoints
          </h1>
          <p className="text-gray-500 mt-1">
            Crea tu cuenta y empieza a reciclar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-eco-100 p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Selector de rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <RoleCard
                selected={form.role === "ciudadano"}
                onClick={() =>
                  setForm((prev) => ({ ...prev, role: "ciudadano" }))
                }
                icon={<User className="h-5 w-5" />}
                title="Ciudadano"
                desc="Reciclo y gano puntos"
              />
              <RoleCard
                selected={form.role === "centro_acopio"}
                onClick={() =>
                  setForm((prev) => ({ ...prev, role: "centro_acopio" }))
                }
                icon={<Building2 className="h-5 w-5" />}
                title="Centro de acopio"
                desc="Gestiono un centro"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre de usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-eco-600 text-white py-2.5 rounded-lg font-semibold hover:bg-eco-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-eco-600 font-medium hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function RoleCard({
  selected,
  onClick,
  icon,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-3 text-left transition-all ${
        selected
          ? "border-eco-500 bg-eco-50"
          : "border-gray-200 hover:border-eco-200"
      }`}
    >
      <div className={`mb-1 ${selected ? "text-eco-600" : "text-gray-400"}`}>
        {icon}
      </div>
      <p
        className={`text-sm font-semibold ${
          selected ? "text-eco-700" : "text-gray-700"
        }`}
      >
        {title}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
    </button>
  );
}
