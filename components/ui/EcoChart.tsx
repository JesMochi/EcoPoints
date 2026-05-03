"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";

interface ChartData {
  fecha: string;
  kg: number;
  puntos: number;
}

interface EcoChartProps {
  data: ChartData[];
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-eco-100 rounded-xl shadow-sm px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-eco-600">
        {payload[0].value} kg reciclados
      </p>
      <p className="text-earth-500">
        +{payload[1]?.value ?? 0} puntos
      </p>
    </div>
  );
}

export function EcoChart({ data }: EcoChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    fecha: new Date(d.fecha + "T12:00:00").toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={formatted}
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" vertical={false} />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          unit=" kg"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f0fdf4" }} />
        <Bar dataKey="kg" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={40} />
        <Bar dataKey="puntos" fill="#bbf7d0" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
