"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Leaf, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getImpactMetrics } from "@/lib/queries";
import { ImpactMetricsCharts } from "@/components/impact/ImpactMetrics";
import { StatCard } from "@/components/ui/StatCard";
import { formatNumber } from "@/lib/utils";
import type { ImpactMetrics } from "@/types";

export default function ImpactoPage() {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getImpactMetrics()
      .then(setMetrics)
      .catch(() => setError("Error cargando métricas"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-6 lg:px-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-eco-50 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Impacto ambiental</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Métricas globales de la plataforma
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 text-eco-500 animate-spin" />
          <p className="text-sm text-gray-400">Calculando impacto...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm text-center">
          {error}
        </div>
      )}

      {!loading && metrics && (
        <>
          {/* Stats globales */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatCard
              icon={<Leaf className="h-5 w-5" />}
              label="Kg reciclados"
              value={formatNumber(metrics.total_kg_reciclados)}
              unit="kg"
              highlight
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="CO₂ evitado"
              value={formatNumber(metrics.total_co2_evitado)}
              unit="kg"
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Usuarios activos"
              value={metrics.total_usuarios_activos}
            />
          </div>

          {/* Gráficas y equivalencias */}
          <ImpactMetricsCharts metrics={metrics} />

          {metrics.total_kg_reciclados === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">
                Aún no hay datos. ¡Empieza reciclando para ver el impacto global!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
