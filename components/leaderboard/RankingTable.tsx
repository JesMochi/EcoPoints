import { getInitials, formatNumber } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

interface RankingTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function RankingTable({ entries, currentUserId }: RankingTableProps) {
  return (
    <div className="space-y-1">
      {entries.map((entry) => {
        const isMe = entry.id === currentUserId;
        return (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isMe
                ? "bg-eco-50 border border-eco-200"
                : "hover:bg-gray-50"
            }`}
          >
            {/* Position */}
            <span
              className={`text-sm font-bold w-7 text-center shrink-0 ${
                isMe ? "text-eco-600" : "text-gray-400"
              }`}
            >
              #{entry.posicion}
            </span>

            {/* Avatar */}
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isMe
                  ? "bg-eco-200 text-eco-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {getInitials(entry.username)}
            </div>

            {/* Name + kg */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  isMe ? "text-eco-700" : "text-gray-700"
                }`}
              >
                {entry.username}
                {isMe && (
                  <span className="ml-1.5 text-xs font-medium text-eco-500">
                    (tú)
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {entry.kg_reciclados} kg reciclados
              </p>
            </div>

            {/* Points */}
            <p
              className={`text-sm font-bold shrink-0 ${
                isMe ? "text-eco-600" : "text-gray-600"
              }`}
            >
              {formatNumber(entry.puntos_totales)}
              <span className="text-xs font-normal text-gray-400 ml-0.5">
                pts
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
