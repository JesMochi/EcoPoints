"use client";

import { Leaf, Recycle, Trophy, Gift, TrendingUp, Loader2, Award } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/ui/StatCard";
import { EcoChart } from "@/components/ui/EcoChart";
import { formatNumber, formatDate } from "@/lib/utils";
import type { Transaccion, Material } from "@/types";

export default function DashboardPage() {
  const { profile, loading: userLoading } = useUser();
  const { stats, chartData, loading: statsLoading } = useDashboard();

  if (userLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 text-eco-500 animate-spin" />
      </div>
    );
  }

  const loading = statsLoading;

  return (
    <div className="px-4 py-6 lg:px-8 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hola, {profile?.username ?? "..."} 🌱
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Así va tu impacto ambiental
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<Leaf className="h-5 w-5" />}
          label="Puntos totales"
          value={loading ? "—" : formatNumber(stats?.puntos_totales ?? 0)}
          unit="pts"
          highlight
        />
        <StatCard
          icon={<Recycle className="h-5 w-5" />}
          label="Kg reciclados"
          value={loading ? "—" : stats?.kg_reciclados ?? 0}
          unit="kg"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="CO₂ evitado"
          value={loading ? "—" : stats?.co2_evitado ?? 0}
          unit="kg"
        />
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Posición"
          value={loading ? "—" : `#${stats?.posicion_ranking ?? "—"}`}
          unit="ranking"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Actividad — últimos 7 días
          </h2>
          <span className="text-xs text-gray-400">kg reciclados / puntos</span>
        </div>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-eco-400 animate-spin" />
          </div>
        ) : chartData.length > 0 ? (
          <EcoChart data={chartData} />
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-center">
            <Recycle className="h-10 w-10 text-eco-200" />
            <p className="text-sm text-gray-400">
              Aún no hay registros.{" "}
              <Link href="/dashboard/escanear" className="text-eco-600 underline">
                ¡Empieza reciclando!
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <QuickAction
          href="/dashboard/escanear"
          icon={<Recycle className="h-6 w-6" />}
          label="Escanear QR"
          className="bg-eco-600 hover:bg-eco-700"
        />
        <QuickAction
          href="/dashboard/ranking"
          icon={<Trophy className="h-6 w-6" />}
          label="Ver ranking"
          className="bg-earth-500 hover:bg-earth-600"
        />
        <QuickAction
          href="/dashboard/recompensas"
          icon={<Gift className="h-6 w-6" />}
          label="Canjear"
          className="bg-eco-700 hover:bg-eco-800"
        />
        <QuickAction
          href="/dashboard/certificado"
          icon={<Award className="h-6 w-6" />}
          label="Certificado"
          className="bg-eco-500 hover:bg-eco-600"
        />
      </div>

      {/* Recent activity */}
      {!loading &&
        stats?.transacciones_recientes &&
        stats.transacciones_recientes.length > 0 && (
          <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Actividad reciente
            </h2>
            <div className="space-y-0">
              {stats.transacciones_recientes.map((tx: Transaccion) => {
                const mat = tx.materiales as Pick<Material, "nombre" | "icono"> | undefined;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-eco-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mat?.icono ?? "♻️"}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {mat?.nombre ?? "Material"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(tx.created_at)} · {tx.peso_kg} kg
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-eco-600">
                      +{tx.puntos_ganados} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`${className} text-white rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors shadow-sm`}
    >
      {icon}
      <span className="text-xs font-semibold text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}
