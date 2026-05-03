"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  QrCode,
  RefreshCw,
  Printer,
  Loader2,
  Building2,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import {
  getCentrosAcopio,
  getCentroByUserId,
  getTransaccionesByCentro,
} from "@/lib/queries";
import { generateQRData } from "@/lib/qr";
import { QRGenerator } from "@/components/qr/QRGenerator";
import { formatDate } from "@/lib/utils";
import type { CentroAcopio, Transaccion, Material, Profile } from "@/types";

export default function GenerarQRPage() {
  const { profile, loading: userLoading } = useUser();
  const [centro, setCentro] = useState<CentroAcopio | null>(null);
  const [centros, setCentros] = useState<CentroAcopio[]>([]);
  const [qrValue, setQrValue] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

  const loadTransacciones = useCallback(async (centroId: string) => {
    const txs = await getTransaccionesByCentro(centroId, 10);
    setTransacciones(txs);
  }, []);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const [centroUser, allCentros] = await Promise.all([
        getCentroByUserId(profile.id),
        getCentrosAcopio(),
      ]);
      if (centroUser) {
        setCentro(centroUser);
        await loadTransacciones(centroUser.id);
      }
      setCentros(allCentros);
      setLoading(false);
    };
    load();
  }, [profile?.id, loadTransacciones]);

  async function handleSelectCentro(centroId: string) {
    const found = centros.find((c) => c.id === centroId) ?? null;
    setCentro(found);
    setQrValue("");
    if (found) await loadTransacciones(found.id);
    else setTransacciones([]);
  }

  function generateQR() {
    if (!centro) return;
    const { raw } = generateQRData(centro.id);
    setQrValue(raw);
  }

  if (userLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 text-eco-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/centro"
          className="p-2 hover:bg-eco-50 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Generar QR de sesión</h1>
      </div>

      {/* Selector de centro */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Centro de acopio
        </label>
        <select
          value={centro?.id ?? ""}
          onChange={(e) => handleSelectCentro(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eco-500 bg-white"
        >
          <option value="">Selecciona un centro</option>
          {centros.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* QR card */}
      <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-6 mb-5">
        {!centro ? (
          <div className="flex flex-col items-center py-8 gap-3 text-gray-400">
            <Building2 className="h-10 w-10 text-eco-200" />
            <p className="text-sm text-center">
              Selecciona un centro para generar su QR
            </p>
          </div>
        ) : !qrValue ? (
          <div className="flex flex-col items-center py-6 gap-4">
            <QrCode className="h-16 w-16 text-eco-200" />
            <div className="text-center">
              <p className="font-semibold text-gray-700">{centro.nombre}</p>
              <p className="text-xs text-gray-400 mt-1">{centro.direccion}</p>
            </div>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Genera un QR de sesión para que los ciudadanos registren su reciclaje.
            </p>
            <button
              onClick={generateQR}
              className="bg-eco-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-eco-700 transition-colors"
            >
              Generar QR
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-semibold text-gray-700">{centro.nombre}</p>
            <QRGenerator
              data={qrValue}
              size={220}
              label="Válido por 8 horas · Muéstralo a los ciudadanos"
            />
            <div className="flex gap-3 print:hidden">
              <button
                onClick={generateQR}
                className="flex items-center gap-2 border border-eco-200 text-eco-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-eco-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Nuevo QR
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-eco-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-eco-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Últimos escaneos */}
      {transacciones.length > 0 && (
        <div className="bg-white rounded-2xl border border-eco-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Últimos 10 escaneos
          </h2>
          <div className="space-y-0">
            {transacciones.map((tx) => {
              const mat = tx.materiales as
                | Pick<Material, "nombre" | "icono">
                | undefined;
              const user = tx.profiles as
                | Pick<Profile, "username">
                | undefined;
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-eco-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{mat?.icono ?? "♻️"}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {user?.username ?? "Usuario"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {mat?.nombre ?? "Material"} · {tx.peso_kg} kg ·{" "}
                        {formatDate(tx.created_at)}
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

      {centro && transacciones.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          Aún no hay escaneos registrados en este centro.
        </p>
      )}
    </div>
  );
}
