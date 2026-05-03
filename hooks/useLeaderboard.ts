"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "./useUser";
import type { LeaderboardEntry } from "@/types";

export function useLeaderboard() {
  const { profile } = useUser();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, puntos_totales")
      .order("puntos_totales", { ascending: false })
      .limit(10);

    if (error || !profiles) return;

    // Suma de kg reciclados para el top 10
    const userIds = profiles.map((p) => p.id);
    const { data: txs } = await supabase
      .from("transacciones")
      .select("user_id, peso_kg")
      .in("user_id", userIds);

    const kgByUser: Record<string, number> = {};
    (txs ?? []).forEach((tx) => {
      kgByUser[tx.user_id] = (kgByUser[tx.user_id] ?? 0) + Number(tx.peso_kg);
    });

    const leaderboard: LeaderboardEntry[] = profiles.map((p, i) => ({
      id: p.id,
      username: p.username,
      puntos_totales: p.puntos_totales,
      kg_reciclados: Math.round((kgByUser[p.id] ?? 0) * 100) / 100,
      posicion: i + 1,
    }));

    setEntries(leaderboard);
    setLastUpdate(new Date());

    // Posición del usuario actual si no está en el top 10
    if (profile && !leaderboard.find((e) => e.id === profile.id)) {
      const [{ count }, { data: myTxs }] = await Promise.all([
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gt("puntos_totales", profile.puntos_totales),
        supabase
          .from("transacciones")
          .select("peso_kg")
          .eq("user_id", profile.id),
      ]);

      const myKg =
        Math.round(
          (myTxs ?? []).reduce((s, tx) => s + Number(tx.peso_kg), 0) * 100
        ) / 100;

      setMyEntry({
        id: profile.id,
        username: profile.username,
        puntos_totales: profile.puntos_totales,
        kg_reciclados: myKg,
        posicion: (count ?? 0) + 1,
      });
    } else {
      setMyEntry(null);
    }

    setLoading(false);
  }, [profile?.id, profile?.puntos_totales, profile?.username]);

  useEffect(() => {
    fetchLeaderboard();

    // Suscripción en tiempo real — se re-consulta cuando cambia cualquier perfil
    const channel = supabase
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  return { entries, myEntry, loading, lastUpdate };
}
