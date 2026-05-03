"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Gift,
  CheckCircle,
  X,
  ClipboardCopy,
  History,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { getRecompensas, createCanje, getCanjesByUser } from "@/lib/queries";
import { RewardCard } from "@/components/rewards/RewardCard";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Recompensa, Canje } from "@/types";

type View = "catalogo" | "historial";

export default function RecompensasPage() {
  const { profile } = useUser();
  const [view, setView] = useState<View>("catalogo");
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [canjes, setCanjes] = useState<Canje[]>([]);
  const [loading, setLoading] = useState(true);
  const [canjeLoading, setCanjeLoading] = useState(false);

  // Modal de confirmación
  const [selectedRecompensa, setSelectedRecompensa] = useState<Recompensa | null>(null);
  // Modal de éxito
  const [successCanje, setSuccessCanje] = useState<Canje | null>(null);

  // Puntos locales (se actualizan después de canjear)
  const [localPoints, setLocalPoints] = useState<number | null>(null);
  const userPoints = localPoints ?? profile?.puntos_totales ?? 0;

  useEffect(() => {
    if (!profile) return;
    Promise.all([getRecompensas(), getCanjesByUser(profile.id)])
      .then(([r, c]) => {
        setRecompensas(r);
        setCanjes(c);
      })
      .finally(() => setLoading(false));
  }, [profile?.id]);

  async function handleConfirmCanje() {
    if (!profile || !selectedRecompensa) return;
    setCanjeLoading(true);
    try {
      const canje = await createCanje(profile.id, selectedRecompensa);
      // Actualiza puntos locales
      setLocalPoints(userPoints - selectedRecompensa.puntos_requeridos);
      // Actualiza stock local
      setRecompensas((prev) =>
        prev.map((r) =>
          r.id === selectedRecompensa.id ? { ...r, stock: r.stock - 1 } : r
        )
      );
      setCanjes((prev) => [canje, ...prev]);
      setSelectedRecompensa(null);
      setSuccessCanje(canje);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al canjear");
    } finally {
      setCanjeLoading(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 text-eco-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-eco-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Recompensas</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Tienes{" "}
              <span className="font-semibold text-eco-600">
                {formatNumber(userPoints)} pts
              </span>
            </p>
          </div>
        </div>

        {/* Toggle tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <TabButton active={view === "catalogo"} onClick={() => setView("catalogo")}>
            <Gift className="h-3.5 w-3.5" />
            Catálogo
          </TabButton>
          <TabButton active={view === "historial"} onClick={() => setView("historial")}>
            <History className="h-3.5 w-3.5" />
            Historial
          </TabButton>
        </div>
      </div>

      {/* === CATÁLOGO === */}
      {view === "catalogo" && (
        <>
          {recompensas.length === 0 ? (
            <EmptyState
              icon={<Gift className="h-12 w-12 text-eco-200" />}
              text="No hay recompensas disponibles por ahora"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recompensas.map((r) => (
                <RewardCard
                  key={r.id}
                  recompensa={r}
                  userPoints={userPoints}
                  onCanjear={setSelectedRecompensa}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* === HISTORIAL === */}
      {view === "historial" && (
        <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-4">
          {canjes.length === 0 ? (
            <EmptyState
              icon={<History className="h-12 w-12 text-eco-200" />}
              text="Aún no has canjeado ninguna recompensa"
            />
          ) : (
            <div className="space-y-0">
              {canjes.map((canje) => {
                const rew = canje.recompensas as
                  | { nombre: string }
                  | undefined;
                return (
                  <div
                    key={canje.id}
                    className="flex items-center justify-between py-4 border-b border-eco-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-eco-50 flex items-center justify-center shrink-0">
                        <Gift className="h-5 w-5 text-eco-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {rew?.nombre ?? "Recompensa"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(canje.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-eco-600">
                        -{formatNumber(canje.puntos_usados)} pts
                      </p>
                      <button
                        onClick={() => copyCode(canje.codigo_canje)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-eco-600 transition-colors mt-0.5"
                      >
                        <ClipboardCopy className="h-3 w-3" />
                        {canje.codigo_canje}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* === MODAL CONFIRMACIÓN === */}
      {selectedRecompensa && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-eco-50">
              <h2 className="font-bold text-gray-800">Confirmar canje</h2>
              <button
                onClick={() => setSelectedRecompensa(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-eco-50 rounded-xl p-4">
                <p className="font-semibold text-gray-800">
                  {selectedRecompensa.nombre}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRecompensa.descripcion}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Puntos a descontar</span>
                <span className="font-bold text-eco-600">
                  -{formatNumber(selectedRecompensa.puntos_requeridos)} pts
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Puntos después del canje</span>
                <span className="font-semibold text-gray-700">
                  {formatNumber(
                    userPoints - selectedRecompensa.puntos_requeridos
                  )}{" "}
                  pts
                </span>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button
                onClick={() => setSelectedRecompensa(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCanje}
                disabled={canjeLoading}
                className="flex-1 bg-eco-600 text-white py-2.5 rounded-xl font-semibold hover:bg-eco-700 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {canjeLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL ÉXITO === */}
      {successCanje && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl text-center p-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-eco-100 mb-4">
              <CheckCircle className="h-8 w-8 text-eco-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">¡Canje exitoso!</h2>
            <p className="text-gray-400 text-sm mb-5">
              Guarda tu código de canje
            </p>

            <div
              onClick={() => copyCode(successCanje.codigo_canje)}
              className="bg-eco-50 border-2 border-dashed border-eco-200 rounded-2xl p-4 cursor-pointer hover:bg-eco-100 transition-colors mb-5 group"
            >
              <p className="text-lg font-bold text-eco-700 tracking-widest">
                {successCanje.codigo_canje}
              </p>
              <p className="text-xs text-eco-500 mt-1 flex items-center justify-center gap-1">
                <ClipboardCopy className="h-3 w-3" />
                Toca para copiar
              </p>
            </div>

            <button
              onClick={() => setSuccessCanje(null)}
              className="w-full bg-eco-600 text-white py-2.5 rounded-xl font-semibold hover:bg-eco-700 transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? "bg-white text-eco-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {icon}
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
