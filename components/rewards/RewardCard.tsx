import { Gift, Package } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { Recompensa } from "@/types";

interface RewardCardProps {
  recompensa: Recompensa;
  userPoints: number;
  onCanjear: (recompensa: Recompensa) => void;
  loading?: boolean;
}

export function RewardCard({
  recompensa,
  userPoints,
  onCanjear,
  loading = false,
}: RewardCardProps) {
  const canAfford = userPoints >= recompensa.puntos_requeridos;
  const outOfStock = recompensa.stock === 0;
  const disabled = !canAfford || outOfStock || loading;

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-eco ${
        canAfford && !outOfStock ? "border-eco-100" : "border-gray-100 opacity-75"
      }`}
    >
      {/* Image / placeholder */}
      <div className="h-36 bg-eco-50 flex items-center justify-center shrink-0">
        {recompensa.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recompensa.imagen_url}
            alt={recompensa.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <Gift className="h-12 w-12 text-eco-300" />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Stock badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              outOfStock
                ? "bg-gray-100 text-gray-400"
                : recompensa.stock < 10
                ? "bg-red-50 text-red-500"
                : "bg-eco-50 text-eco-600"
            }`}
          >
            {outOfStock
              ? "Sin stock"
              : recompensa.stock < 10
              ? `¡Solo ${recompensa.stock} left!`
              : `${recompensa.stock} disponibles`}
          </span>
          <Package className="h-4 w-4 text-gray-300" />
        </div>

        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1">
          {recompensa.nombre}
        </h3>
        <p className="text-xs text-gray-400 flex-1 leading-relaxed mb-4">
          {recompensa.descripcion}
        </p>

        {/* Points + button */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            <p className="text-lg font-bold text-eco-600">
              {formatNumber(recompensa.puntos_requeridos)}
            </p>
            <p className="text-xs text-gray-400 -mt-0.5">puntos</p>
          </div>
          <button
            onClick={() => onCanjear(recompensa)}
            disabled={disabled}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-eco-600 text-white hover:bg-eco-700"
            }`}
          >
            {outOfStock ? "Agotado" : !canAfford ? "Sin puntos" : "Canjear"}
          </button>
        </div>

        {/* Points needed */}
        {!canAfford && !outOfStock && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Te faltan{" "}
            <span className="font-semibold text-eco-500">
              {formatNumber(recompensa.puntos_requeridos - userPoints)} pts
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
