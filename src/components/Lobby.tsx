"use client";

import { useState } from "react";
import type { PlayerInfo, Difficulty } from "@/lib/types";
import PlayerList from "./PlayerList";

interface LobbyProps {
  gameId: string;
  players: PlayerInfo[];
  myId: string | null;
  isHost: boolean;
  difficulty: Difficulty;
  onSetDifficulty: (d: Difficulty) => void;
  onStart: () => void;
}

export default function Lobby({
  gameId,
  players,
  myId,
  isHost,
  difficulty,
  onSetDifficulty,
  onStart,
}: LobbyProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/game/${gameId}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Telephone Draw</h1>
          <p className="mt-1 text-gray-400">Share this code with friends</p>
        </div>

        {/* Game code + copy */}
        <div className="rounded-xl bg-gray-800 p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Game Code</p>
          <p className="mt-1 font-mono text-4xl font-bold tracking-[0.3em] text-blue-400">{gameId}</p>
          <button
            onClick={handleCopy}
            className="mt-3 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium transition hover:bg-gray-600"
          >
            {copied ? "Copied!" : "Copy Invite Link"}
          </button>
        </div>

        {/* Player list */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Players ({players.length})
          </h3>
          {players.length === 0 ? (
            <div className="rounded-lg bg-gray-800/50 py-8 text-center">
              <p className="text-gray-500">Connecting...</p>
            </div>
          ) : (
            <PlayerList players={players} myId={myId} />
          )}
          {players.length === 1 && (
            <p className="mt-2 text-center text-sm text-yellow-400/80">
              Waiting for more players to join...
            </p>
          )}
        </div>

        {/* Host controls */}
        {isHost && (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Difficulty
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onSetDifficulty("simple")}
                  className={`flex-1 rounded-lg py-2.5 font-medium transition ${
                    difficulty === "simple"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Simple Words
                </button>
                <button
                  onClick={() => onSetDifficulty("complex")}
                  className={`flex-1 rounded-lg py-2.5 font-medium transition ${
                    difficulty === "complex"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Complex Phrases
                </button>
              </div>
            </div>

            <button
              onClick={onStart}
              disabled={players.length < 2}
              className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {players.length < 2
                ? "Need at least 2 players"
                : `Start Game with ${players.length} players`}
            </button>
          </div>
        )}

        {/* Non-host waiting message */}
        {!isHost && players.length > 0 && (
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-5 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded-full bg-blue-500/20">
              <div className="flex h-full items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-blue-400" />
              </div>
            </div>
            <p className="font-medium text-white">You&apos;re in the game!</p>
            <p className="mt-1 text-sm text-gray-400">
              Waiting for the host to start...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
