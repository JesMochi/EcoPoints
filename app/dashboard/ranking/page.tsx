"use client";

import { ArrowLeft, Loader2, Wifi, Trophy } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { PodiumCard } from "@/components/leaderboard/PodiumCard";
import { RankingTable } from "@/components/leaderboard/RankingTable";
import type { LeaderboardEntry } from "@/types";
import { getInitials, formatNumber } from "@/lib/utils";

export default function RankingPage() {
  const { profile } = useUser();
  const { entries, myEntry, loading, lastUpdate } = useLeaderboard();

  const top3 = entries.filter((e) => e.posicion <= 3);
  const rest = entries.filter((e) => e.posicion > 3);

  // Ordena el podio visualmente: 2 - 1 - 3
  const podiumOrder = [
    top3.find((e) => e.posicion === 2),
    top3.find((e) => e.posicion === 1),
    top3.find((e) => e.posicion === 3),
  ].filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="px-4 py-6 lg:px-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-eco-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Ranking</h1>
        </div>

        {/* Indicador tiempo real */}
        <div className="flex items-center gap-1.5 text-xs text-eco-600 bg-eco-50 border border-eco-100 px-3 py-1.5 rounded-full">
          <Wifi className="h-3.5 w-3.5 animate-pulse" />
          <span>En vivo</span>
          {lastUpdate && (
            <span className="text-eco-400">
              ·{" "}
              {lastUpdate.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 text-eco-500 animate-spin" />
          <p className="text-sm text-gray-400">Cargando ranking...</p>
        </div>
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Podio */}
          {top3.length > 0 && (
            <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-6 mb-4">
              <div className="flex items-end justify-center gap-4">
                {podiumOrder.map((entry) => (
                  <PodiumCard
                    key={entry.id}
                    entry={entry}
                    isMe={entry.id === profile?.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Posiciones 4–10 */}
          {rest.length > 0 && (
            <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-4 mb-4">
              <RankingTable entries={rest} currentUserId={profile?.id} />
            </div>
          )}

          {/* Mi posición si no estoy en top 10 */}
          {myEntry && (
            <div className="bg-eco-50 border border-eco-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-eco-600 uppercase tracking-wide mb-3">
                Tu posición
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-eco-600 w-7 text-center">
                  #{myEntry.posicion}
                </span>
                <div className="h-9 w-9 rounded-full bg-eco-200 flex items-center justify-center text-eco-700 font-bold text-sm shrink-0">
                  {getInitials(myEntry.username)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-eco-700 truncate">
                    {myEntry.username}
                    <span className="ml-1.5 text-xs font-medium text-eco-500">
                      (tú)
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {myEntry.kg_reciclados} kg reciclados
                  </p>
                </div>
                <p className="text-sm font-bold text-eco-600 shrink-0">
                  {formatNumber(myEntry.puntos_totales)}
                  <span className="text-xs font-normal text-gray-400 ml-0.5">
                    pts
                  </span>
                </p>
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Te faltan{" "}
                <span className="font-semibold text-eco-600">
                  {formatNumber(
                    (entries[entries.length - 1]?.puntos_totales ?? 0) -
                      myEntry.puntos_totales +
                      1
                  )}{" "}
                  pts
                </span>{" "}
                para entrar al top 10
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Trophy className="h-14 w-14 text-eco-200" />
      <div className="text-center">
        <p className="text-gray-600 font-semibold">El ranking está vacío</p>
        <p className="text-sm text-gray-400 mt-1">
          ¡Sé el primero en reciclar y llegar al top!
        </p>
      </div>
      <Link
        href="/dashboard/escanear"
        className="bg-eco-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-eco-700 transition-colors text-sm"
      >
        Escanear QR
      </Link>
    </div>
  );
}
