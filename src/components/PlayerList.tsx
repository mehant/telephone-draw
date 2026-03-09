"use client";

import type { PlayerInfo } from "@/lib/types";

interface PlayerListProps {
  players: PlayerInfo[];
  myId: string | null;
}

export default function PlayerList({ players, myId }: PlayerListProps) {
  return (
    <div className="space-y-2">
      {players.map((p) => (
        <div
          key={p.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-2 ${
            p.id === myId ? "bg-gray-700" : "bg-gray-800"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              p.connected ? "bg-green-400" : "bg-gray-500"
            }`}
          />
          <span className="flex-1 font-medium">{p.name}</span>
          {p.isHost && (
            <span className="rounded bg-yellow-600/30 px-2 py-0.5 text-xs text-yellow-400">
              Host
            </span>
          )}
          {p.id === myId && (
            <span className="text-xs text-gray-400">You</span>
          )}
        </div>
      ))}
    </div>
  );
}
