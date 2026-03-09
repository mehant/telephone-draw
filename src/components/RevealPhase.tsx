"use client";

import { useState, useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import type { RevealChainData, ChainEntry, PlayerInfo, Stroke } from "@/lib/types";

interface RevealPhaseProps {
  revealedChains: RevealChainData[];
  isHost: boolean;
  isFinished: boolean;
  onRevealNext: () => void;
  onPlayAgain: () => void;
  players: PlayerInfo[];
}

export default function RevealPhase({ revealedChains, isHost, isFinished, onRevealNext, onPlayAgain, players }: RevealPhaseProps) {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  // Auto-advance to newest chain when host reveals it
  useEffect(() => {
    if (revealedChains.length > 0) {
      setCurrentViewIndex(revealedChains.length - 1);
    }
  }, [revealedChains.length]);

  const currentChain = revealedChains[currentViewIndex];
  const totalChains = players.length;
  const canGoPrevious = currentViewIndex > 0;
  const canGoNext = currentViewIndex < revealedChains.length - 1;
  const isOnLastRevealed = revealedChains.length === 0 || currentViewIndex === revealedChains.length - 1;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold">The Reveal</h2>
        {revealedChains.length > 0 && (
          <p className="text-gray-400">
            Chain {currentViewIndex + 1} of {totalChains}
          </p>
        )}
      </div>

      {/* Show current chain's entries */}
      {currentChain && (
        <div className="space-y-3">
          {currentChain.entries.map((entry, idx) => (
            <RevealCard key={`${currentChain.chainIndex}-${idx}`} entry={entry} />
          ))}
        </div>
      )}

      {revealedChains.length === 0 && (
        <p className="text-center text-gray-400">
          {isHost ? "Click the button below to start the reveal!" : "Waiting for the host to start the reveal..."}
        </p>
      )}

      <div className="flex justify-center gap-4">
        {canGoPrevious && (
          <button
            onClick={() => setCurrentViewIndex((i) => i - 1)}
            className="rounded-lg bg-gray-700 px-6 py-3 text-lg font-bold text-white transition hover:bg-gray-600"
          >
            Previous
          </button>
        )}

        {canGoNext && (
          <button
            onClick={() => setCurrentViewIndex((i) => i + 1)}
            className="rounded-lg bg-gray-700 px-6 py-3 text-lg font-bold text-white transition hover:bg-gray-600"
          >
            Next
          </button>
        )}

        {isHost && !isFinished && isOnLastRevealed && (
          <button
            onClick={onRevealNext}
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition hover:bg-blue-700"
          >
            {revealedChains.length === 0 ? "Start Reveal" : "Next Chain"}
          </button>
        )}

        {isHost && isFinished && (
          <button
            onClick={onPlayAgain}
            className="rounded-lg bg-green-600 px-8 py-3 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}

function RevealCard({ entry }: { entry: ChainEntry }) {
  if (entry.type === "word") {
    return (
      <div className="rounded-lg bg-gray-800 p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">{entry.playerName}&apos;s word</p>
        <p className="text-2xl font-bold text-blue-400">{entry.content}</p>
      </div>
    );
  }

  if (entry.type === "guess") {
    return (
      <div className="rounded-lg bg-gray-800 p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">{entry.playerName} guessed</p>
        <p className="text-2xl font-bold text-yellow-400">{entry.content}</p>
      </div>
    );
  }

  // Drawing
  let strokes: Stroke[] = [];
  try {
    strokes = JSON.parse(entry.content);
  } catch {
    // empty
  }

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <p className="text-xs text-gray-500 mb-2 text-center">{entry.playerName} drew</p>
      <DrawingCanvas readOnly initialStrokes={strokes} />
    </div>
  );
}
