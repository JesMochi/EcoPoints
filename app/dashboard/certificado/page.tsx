"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  Leaf,
  Award,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getDashboardStats } from "@/lib/queries";
import { getEquivalencias, formatNumber, formatDate } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export default function CertificadoPage() {
  const { profile } = useUser();
  const certRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!profile) return;
    getDashboardStats(profile.id)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [profile?.id]);

  const equiv = stats ? getEquivalencias(stats.kg_reciclados) : null;
  const today = formatDate(new Date().toISOString());

  async function downloadCertificate() {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-ecopoints-${profile?.username ?? "usuario"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  }

  async function shareCertificate() {
    const text =
      `🌱 Contribuí al medio ambiente reciclando ${stats?.kg_reciclados ?? 0} kg ` +
      `y evité ${stats?.co2_evitado ?? 0} kg de CO₂ con EcoPoints. ` +
      `#EcoPoints #HackaTec2026 #Sustentabilidad`;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Mi Certificado EcoPoints", text });
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }
    } catch {
      // user cancelled share
    }
  }

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
          <h1 className="text-xl font-bold text-gray-800">
            Certificado de impacto
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Descarga y comparte tu logro
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 text-eco-500 animate-spin" />
          <p className="text-sm text-gray-400">Generando certificado...</p>
        </div>
      ) : (
        <>
          {/* ===== CERTIFICADO ===== */}
          <div
            ref={certRef}
            className="bg-white rounded-3xl shadow-eco border-4 border-eco-600 p-8 mb-6 relative overflow-hidden"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {/* Decoración de fondo */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
              style={{ background: "#22c55e" }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-10"
              style={{ background: "#22c55e" }}
            />

            {/* Logo + fecha */}
            <div className="flex items-start justify-between mb-8 relative">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-eco-600 rounded-xl flex items-center justify-center shrink-0">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p
                    className="font-bold text-eco-800 text-xl leading-tight"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    EcoPoints
                  </p>
                  <p className="text-xs text-eco-500">
                    HackaTec 2026 · InnovaTecNM
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Emitido el</p>
                <p className="text-sm font-semibold text-gray-600">{today}</p>
              </div>
            </div>

            {/* Título */}
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center gap-2 bg-eco-50 px-4 py-1.5 rounded-full mb-4">
                <Award className="h-4 w-4 text-eco-600" />
                <span className="text-xs font-semibold text-eco-600 uppercase tracking-widest">
                  Certificado de Impacto Ambiental
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Este certificado acredita que</p>
              <h2
                className="text-3xl font-bold text-eco-800 mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {profile?.username ?? "Usuario"}
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                ha contribuido activamente a la economía circular y al
                cuidado del medio ambiente mediante el reciclaje responsable.
              </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <CertMetric
                value={String(stats?.kg_reciclados ?? 0)}
                unit="kg"
                label="Reciclados"
              />
              <CertMetric
                value={String(stats?.co2_evitado ?? 0)}
                unit="kg CO₂"
                label="Evitados"
                highlight
              />
              <CertMetric
                value={formatNumber(stats?.puntos_totales ?? 0)}
                unit="pts"
                label="Acumulados"
              />
            </div>

            {/* Equivalencias */}
            {equiv && stats && stats.kg_reciclados > 0 && (
              <div className="bg-eco-50 rounded-2xl p-4 mb-6 text-center border border-eco-100">
                <p className="text-xs text-eco-600 font-medium mb-1.5">
                  Tu impacto equivale a
                </p>
                <p className="text-sm font-semibold text-eco-700">
                  🌳 {equiv.arboles} árboles salvados &nbsp;·&nbsp; 💧{" "}
                  {formatNumber(equiv.litrosAgua)} litros de agua ahorrados
                </p>
              </div>
            )}

            {/* Firma / pie */}
            <div className="flex items-center justify-between border-t border-eco-100 pt-4">
              <div>
                <p className="text-xs font-semibold text-gray-600">
                  Posición en ranking
                </p>
                <p className="text-lg font-bold text-eco-700">
                  #{stats?.posicion_ranking ?? "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Verificado por</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-eco-400" />
                  <div className="h-2 w-2 rounded-full bg-eco-500" />
                  <div className="h-2 w-2 rounded-full bg-eco-600" />
                  <p className="text-xs font-bold text-eco-700 ml-1">
                    ECOPOINTS
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={downloadCertificate}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 bg-eco-600 text-white py-3 rounded-xl font-semibold hover:bg-eco-700 transition-colors disabled:opacity-60 text-sm"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloading ? "Descargando..." : "Descargar PNG"}
            </button>
            <button
              onClick={shareCertificate}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-eco-600 text-eco-700 py-3 rounded-xl font-semibold hover:bg-eco-50 transition-colors text-sm"
            >
              <Share2 className="h-4 w-4" />
              {shared ? "¡Copiado!" : "Compartir"}
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4">
            La imagen se descarga con alta resolución (2×) lista para compartir
          </p>
        </>
      )}
    </div>
  );
}

function CertMetric({
  value,
  unit,
  label,
  highlight = false,
}: {
  value: string;
  unit: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 text-center ${
        highlight ? "bg-eco-600" : "bg-eco-50 border border-eco-100"
      }`}
    >
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-white" : "text-eco-700"
        }`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        {value}
      </p>
      <p
        className={`text-xs font-medium mt-0.5 ${
          highlight ? "text-eco-100" : "text-eco-500"
        }`}
      >
        {unit}
      </p>
      <p
        className={`text-xs mt-1 ${
          highlight ? "text-eco-200" : "text-gray-400"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
