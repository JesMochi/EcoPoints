"use client";

import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { getDashboardStats, getTransaccionesUltimosDias } from "@/lib/queries";
import type { DashboardStats } from "@/types";

export function useDashboard() {
  const { profile } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<
    { fecha: string; kg: number; puntos: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const load = async () => {
      try {
        const [statsData, txChart] = await Promise.all([
          getDashboardStats(profile.id),
          getTransaccionesUltimosDias(profile.id, 7),
        ]);
        setStats(statsData);
        setChartData(txChart);
      } catch (err) {
        console.error(err);
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profile?.id]);

  return { stats, chartData, loading, error };
}
