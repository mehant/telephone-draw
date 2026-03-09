"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import Lobby from "@/components/Lobby";
import DrawingPhase from "@/components/DrawingPhase";
import GuessingPhase from "@/components/GuessingPhase";
import WaitingPhase from "@/components/WaitingPhase";
import RevealPhase from "@/components/RevealPhase";

export default function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params);
  const router = useRouter();
  const {
    phase,
    players,
    difficulty,
    assignment,
    submittedCount,
    revealedChains,
    isFinished,
    error,
    myId,
    isHost,
    joinGame,
    setDifficulty,
    startGame,
    submitDrawing,
    submitGuess,
    revealNext,
    playAgain,
  } = useSocket(gameId);

  // Connecting / loading state
  if (phase === "connecting") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500" />
          <p className="text-gray-400">Connecting...</p>
        </div>
      </div>
    );
  }

  // Need to join - show name entry form
  if (phase === "need-join") {
    return <JoinForm gameId={gameId} joinGame={joinGame} />;
  }

  // Game not found - redirect home
  if (phase === "home") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-400">{error || "Game not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {error && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {error}
        </div>
      )}

      {phase === "lobby" && (
        <Lobby
          gameId={gameId}
          players={players}
          myId={myId}
          isHost={isHost}
          difficulty={difficulty}
          onSetDifficulty={setDifficulty}
          onStart={startGame}
        />
      )}

      {phase === "playing" && assignment?.type === "draw" && (
        <DrawingPhase
          prompt={assignment.prompt}
          duration={assignment.duration}
          round={assignment.round}
          totalRounds={assignment.totalRounds}
          onSubmit={submitDrawing}
        />
      )}

      {phase === "playing" && assignment?.type === "guess" && (
        <GuessingPhase
          drawingData={assignment.prompt}
          duration={assignment.duration}
          round={assignment.round}
          totalRounds={assignment.totalRounds}
          onSubmit={submitGuess}
        />
      )}

      {phase === "playing" && !assignment && (
        <WaitingPhase submittedCount={submittedCount} />
      )}

      {(phase === "reveal" || phase === "finished") && (
        <RevealPhase
          revealedChains={revealedChains}
          isHost={isHost}
          isFinished={isFinished}
          onRevealNext={revealNext}
          onPlayAgain={playAgain}
          players={players}
        />
      )}
    </div>
  );
}

function JoinForm({
  gameId,
  joinGame,
}: {
  gameId: string;
  joinGame: (gameId: string, name: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await joinGame(gameId, name.trim());
    if (!res.success) {
      setError(res.error || "Failed to join");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold">Telephone Draw</h1>
          <p className="mt-2 text-gray-400">You&apos;ve been invited to join</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <p className="text-sm text-gray-400">Game Code</p>
          <p className="font-mono text-3xl tracking-widest text-blue-400">{gameId}</p>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-center text-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleJoin}
            disabled={!name.trim() || loading}
            className="w-full rounded-lg bg-green-600 py-3 text-lg font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Game"}
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
