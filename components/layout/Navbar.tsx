"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Recycle,
  Trophy,
  Gift,
  BarChart2,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getInitials, formatNumber } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/dashboard/escanear", icon: Recycle, label: "Escanear" },
  { href: "/dashboard/ranking", icon: Trophy, label: "Ranking" },
  { href: "/dashboard/recompensas", icon: Gift, label: "Puntos" },
  { href: "/dashboard/impacto", icon: BarChart2, label: "Impacto" },
];

export function Navbar() {
  const pathname = usePathname();
  const { profile } = useUser();

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden bg-white border-b border-eco-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-eco-600">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-eco-800">EcoPoints</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-eco-600">
            {formatNumber(profile?.puntos_totales ?? 0)} pts
          </span>
          <div className="h-8 w-8 rounded-full bg-eco-100 flex items-center justify-center text-eco-700 font-bold text-sm">
            {profile ? getInitials(profile.username) : "?"}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-eco-100 z-20 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
                  active ? "text-eco-600" : "text-gray-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
