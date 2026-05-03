"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Recycle,
  Trophy,
  Gift,
  BarChart2,
  Award,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { useUser } from "@/hooks/useUser";
import { getInitials, formatNumber } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/dashboard/escanear", icon: Recycle, label: "Escanear QR" },
  { href: "/dashboard/certificado", icon: Award, label: "Mi certificado" },
  { href: "/dashboard/ranking", icon: Trophy, label: "Ranking" },
  { href: "/dashboard/recompensas", icon: Gift, label: "Recompensas" },
  { href: "/dashboard/impacto", icon: BarChart2, label: "Mi impacto" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useUser();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-eco-100 h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-eco-50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eco-600">
          <Leaf className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-eco-800 text-lg tracking-tight">
          EcoPoints
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-eco-50 text-eco-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${active ? "text-eco-600" : ""}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-eco-50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-eco-100 flex items-center justify-center text-eco-700 font-bold text-sm shrink-0">
            {profile ? getInitials(profile.username) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">
              {profile?.username ?? "..."}
            </p>
            <p className="text-xs text-eco-600 font-medium">
              {formatNumber(profile?.puntos_totales ?? 0)} pts
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
