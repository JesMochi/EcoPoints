import { getInitials, formatNumber } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

const RANK_CONFIG = {
  1: {
    medal: "🥇",
    avatarSize: "h-16 w-16 text-lg",
    barHeight: "h-24",
    avatarBg: "bg-earth-400 ring-earth-200",
    barBg: "bg-earth-100 border-earth-200",
  },
  2: {
    medal: "🥈",
    avatarSize: "h-12 w-12 text-base",
    barHeight: "h-16",
    avatarBg: "bg-gray-300 ring-gray-100",
    barBg: "bg-gray-100 border-gray-200",
  },
  3: {
    medal: "🥉",
    avatarSize: "h-12 w-12 text-base",
    barHeight: "h-12",
    avatarBg: "bg-amber-500 ring-amber-200",
    barBg: "bg-amber-50 border-amber-200",
  },
} as const;

interface PodiumCardProps {
  entry: LeaderboardEntry;
  isMe: boolean;
}

export function PodiumCard({ entry, isMe }: PodiumCardProps) {
  const rank = entry.posicion as 1 | 2 | 3;
  const cfg = RANK_CONFIG[rank];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-2xl leading-none">{cfg.medal}</span>

      {/* Avatar */}
      <div
        className={`${cfg.avatarSize} rounded-full ${cfg.avatarBg} ring-4 flex items-center justify-center font-bold text-white shrink-0 ${
          isMe ? "ring-eco-500 ring-4" : ""
        }`}
      >
        {getInitials(entry.username)}
      </div>

      {/* Name + points */}
      <p
        className={`text-xs font-semibold max-w-[80px] truncate text-center leading-tight ${
          isMe ? "text-eco-700" : "text-gray-700"
        }`}
      >
        {isMe ? "Tú" : entry.username}
      </p>
      <p className="text-xs text-gray-400 font-medium">
        {formatNumber(entry.puntos_totales)} pts
      </p>

      {/* Podium bar */}
      <div
        className={`w-20 ${cfg.barHeight} ${cfg.barBg} rounded-t-xl border-t-2 border-x-2`}
      />
    </div>
  );
}
