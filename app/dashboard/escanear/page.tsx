"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  Recycle,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getMateriales, createTransaccion } from "@/lib/queries";
import { validateQRCode } from "@/lib/qr";
import { calcularPuntos, calcularCO2, formatNumber } from "@/lib/utils";
import type { Material } from "@/types";

// Carga dinámica para evitar SSR — html5-qrcode usa APIs del navegador
const QRScanner = dynamic(
  () =>
    import("@/components/qr/QRScanner").then((m) => ({ default: m.QRScanner })),
  {
    ssr: false,
    loading: () => <ScannerSkeleton />,
  }
);

type Step = "scan" | "form" | "saving" | "success" | "error";

export default function EscanearPage() {
  const { profile } = useUser();
  const [step, setStep] = useState<Step>("scan");
  const [centroId, setCentroId] = useState<string>("");
  const [rawQR, setRawQR] = useState<string>("");
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [materialId, setMaterialId] = useState("");
  const [pesoKg, setPesoKg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{ puntos: number; co2: number } | null>(null);

  useEffect(() => {
    getMateriales().then(setMateriales).catch(console.error);
  }, []);

  const selectedMat = materiales.find((m) => m.id === materialId);
  const peso = parseFloat(pesoKg) || 0;
  const puntosPreview =
    selectedMat && peso > 0
      ? calcularPuntos(selectedMat.puntos_por_kg, peso)
      : 0;
  const co2Preview =
    selectedMat && peso > 0
      ? calcularCO2(selectedMat.co2_evitado_por_kg, peso)
      : 0;

  function handleScan(raw: string) {
    const payload = validateQRCode(raw);
    if (!payload) {
      setErrorMsg("QR inválido o expirado. Pide al centro que genere uno nuevo.");
      setStep("error");
      return;
    }
    setCentroId(payload.centro_id);
    setRawQR(raw);
    setStep("form");
  }

  function resetScan() {
    setStep("scan");
    setCentroId("");
    setRawQR("");
    setMaterialId("");
    setPesoKg("");
    setResult(null);
  }

  async function handleConfirm() {
    if (!profile || !centroId || !selectedMat || peso <= 0) return;
    setStep("saving");
    try {
      await createTransaccion({
        user_id: profile.id,
        centro_id: centroId,
        material_id: materialId,
        peso_kg: peso,
        puntos_ganados: puntosPreview,
        qr_code: rawQR,
      });
      setResult({ puntos: puntosPreview, co2: co2Preview });
      setStep("success");
    } catch {
      setErrorMsg("Error guardando el reciclaje. Intenta de nuevo.");
      setStep("error");
    }
  }

  return (
    <div className="px-4 py-6 lg:px-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-eco-50 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Escanear QR</h1>
      </div>

      {/* STEP: scan */}
      {step === "scan" && (
        <div>
          <p className="text-sm text-gray-400 text-center mb-4">
            Apunta la cámara al código QR del centro de acopio
          </p>
          <div className="rounded-2xl overflow-hidden border border-eco-100 shadow-sm bg-white">
            <QRScanner onScan={handleScan} />
          </div>
        </div>
      )}

      {/* STEP: form */}
      {step === "form" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 bg-eco-50 border border-eco-200 rounded-2xl p-4 text-sm text-eco-700">
            <CheckCircle className="h-4 w-4 shrink-0 text-eco-500" />
            QR válido — ingresa los datos del reciclaje
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Material reciclado
            </label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eco-500 bg-white"
            >
              <option value="">Selecciona un material</option>
              {materiales.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.icono} {m.nombre} — {m.puntos_por_kg} pts/kg
                </option>
              ))}
            </select>
          </div>

          {/* Peso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="500"
              value={pesoKg}
              onChange={(e) => setPesoKg(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eco-500"
              placeholder="Ej. 2.5"
            />
          </div>

          {/* Preview */}
          {puntosPreview > 0 && (
            <div className="bg-eco-600 text-white rounded-2xl p-5">
              <p className="text-xs font-medium text-eco-100 mb-3 uppercase tracking-wide">
                Vista previa
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-bold">
                    +{formatNumber(puntosPreview)}
                  </p>
                  <p className="text-xs text-eco-100 mt-0.5">puntos a ganar</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{co2Preview}</p>
                  <p className="text-xs text-eco-100 mt-0.5">kg CO₂ evitado</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={resetScan}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!materialId || peso <= 0}
              className="flex-1 bg-eco-600 text-white py-2.5 rounded-xl font-semibold hover:bg-eco-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* STEP: saving */}
      {step === "saving" && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="h-10 w-10 text-eco-500 animate-spin" />
          <p className="text-gray-500 text-sm">Registrando reciclaje...</p>
        </div>
      )}

      {/* STEP: success */}
      {step === "success" && result && (
        <div className="text-center py-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-eco-100 mb-5">
            <CheckCircle className="h-10 w-10 text-eco-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">¡Excelente!</h2>
          <p className="text-gray-400 text-sm mb-6">Tu reciclaje fue registrado</p>

          <div className="bg-eco-600 text-white rounded-2xl p-6 mb-6 text-left">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-eco-100 text-xs uppercase tracking-wide mb-1">
                  Puntos ganados
                </p>
                <p className="text-4xl font-bold">+{formatNumber(result.puntos)}</p>
              </div>
              <Recycle className="h-10 w-10 text-eco-400" />
            </div>
            <div className="mt-4 pt-4 border-t border-eco-500 text-sm text-eco-100">
              🌿 {result.co2} kg de CO₂ evitados
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetScan}
              className="flex-1 border border-eco-200 text-eco-700 py-2.5 rounded-xl font-medium hover:bg-eco-50 transition-colors text-sm"
            >
              Escanear otro
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-eco-600 text-white py-2.5 rounded-xl font-semibold text-center hover:bg-eco-700 transition-colors text-sm"
            >
              Ver dashboard
            </Link>
          </div>
        </div>
      )}

      {/* STEP: error */}
      {step === "error" && (
        <div className="text-center py-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-5">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Algo salió mal</h2>
          <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={resetScan}
            className="bg-eco-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-eco-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}

function ScannerSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 gap-3">
      <Camera className="h-10 w-10 text-eco-300 animate-pulse" />
      <p className="text-sm text-gray-400">Iniciando cámara...</p>
    </div>
  );
}
