"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";

export default function HomePage() {
  const router = useRouter();
  const { createGame, joinGame } = useSocket();
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const gameId = await createGame(name.trim());
    router.push(`/game/${gameId}`);
  };

  const handleJoin = async () => {
    if (!name.trim() || !joinCode.trim()) return;
    setLoading(true);
    const res = await joinGame(joinCode.trim(), name.trim());
    if (res.success) {
      router.push(`/game/${joinCode.trim().toUpperCase()}`);
    } else {
      setError(res.error || "Failed to join");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Telephone Draw
          </h1>
          <p className="mt-3 text-gray-400">
            Draw, guess, and laugh at the results
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />

          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Create Game
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-700" />
            <span className="text-sm text-gray-500">or join a game</span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Game code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 font-mono text-white uppercase placeholder-gray-500 focus:border-green-500 focus:outline-none"
            />
            <button
              onClick={handleJoin}
              disabled={!name.trim() || !joinCode.trim() || loading}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              Join
            </button>
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <div className="text-center">
            <Link href="/about" className="text-sm text-gray-500 hover:text-gray-300 transition">
              How does this game work?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
