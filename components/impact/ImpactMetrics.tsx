"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { CHART_COLORS } from "@/utils/constants";
import { getEquivalencias, formatNumber } from "@/lib/utils";
import type { ImpactMetrics } from "@/types";

// Genera los 30 días completos, rellenando con 0 los días sin datos
function buildTrendData(tendencia: { fecha: string; kg: number }[]) {
  const map = new Map(tendencia.map((t) => [t.fecha, t.kg]));
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split("T")[0];
    return {
      fecha: d.toLocaleDateString("es-MX", { day: "numeric", month: "short" }),
      kg: map.get(key) ?? 0,
    };
  });
}

function PieTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-eco-100 rounded-xl shadow-sm px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700">{payload[0].name}</p>
      <p className="text-eco-600">{payload[0].value} kg</p>
      <p className="text-gray-400">{payload[0].payload.porcentaje}%</p>
    </div>
  );
}

interface ImpactMetricsProps {
  metrics: ImpactMetrics;
}

export function ImpactMetricsCharts({ metrics }: ImpactMetricsProps) {
  const trendData = buildTrendData(metrics.tendencia_30_dias);
  const equiv = getEquivalencias(metrics.total_kg_reciclados);

  return (
    <div className="space-y-5">
      {/* Equivalencias visuales */}
      <div className="grid grid-cols-3 gap-3">
        <EquivCard icon="🌳" value={equiv.arboles} label="árboles salvados" />
        <EquivCard icon="💧" value={equiv.litrosAgua} label="litros de agua ahorrados" />
        <EquivCard icon="⚡" value={equiv.diasEnergia} label="días de energía" />
      </div>

      {/* Gráfica de dona — distribución por material */}
      {metrics.distribucion_materiales.length > 0 && (
        <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Distribución por material
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={metrics.distribucion_materiales}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                dataKey="kg"
                nameKey="nombre"
                paddingAngle={3}
              >
                {metrics.distribucion_materiales.map((_, i) => (
                  <Cell
                    key={i}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfica de línea — tendencia 30 días */}
      <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Tendencia — últimos 30 días
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" vertical={false} />
            <XAxis
              dataKey="fecha"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              unit=" kg"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #dcfce7",
                fontSize: "12px",
              }}
              formatter={(v: number) => [`${v} kg`, "Reciclado"]}
            />
            <Line
              type="monotone"
              dataKey="kg"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#16a34a" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function EquivCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-eco-50 border border-eco-100 rounded-2xl p-4 text-center">
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-xl font-bold text-eco-700">{formatNumber(value)}</p>
      <p className="text-xs text-gray-400 mt-1 leading-snug">{label}</p>
    </div>
  );
}
