"use client";

import { useMemo } from "react";
import DrawingCanvas from "./DrawingCanvas";
import type { RevealEntry, PlayerInfo, Stroke } from "@/lib/types";

interface RevealPhaseProps {
  entries: RevealEntry[];
  isHost: boolean;
  isFinished: boolean;
  onRevealNext: () => void;
  onPlayAgain: () => void;
  players: PlayerInfo[];
}

export default function RevealPhase({ entries, isHost, isFinished, onRevealNext, onPlayAgain, players }: RevealPhaseProps) {
  // Group entries by chain
  const chains = useMemo(() => {
    const map = new Map<number, RevealEntry[]>();
    for (const entry of entries) {
      const arr = map.get(entry.chainIndex) || [];
      arr.push(entry);
      map.set(entry.chainIndex, arr);
    }
    return map;
  }, [entries]);

  const currentChainIndex = entries.length > 0 ? entries[entries.length - 1].chainIndex : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold">The Reveal</h2>
        <p className="text-gray-400">
          Chain {currentChainIndex + 1} of {players.length}
        </p>
      </div>

      {/* Show current chain's entries */}
      {Array.from(chains.entries()).map(([chainIdx, chainEntries]) => (
        <div key={chainIdx} className={`space-y-3 ${chainIdx !== currentChainIndex && !isFinished ? "hidden" : ""}`}>
          {chainIdx !== currentChainIndex && isFinished && (
            <div className="border-t border-gray-700 pt-4 mt-4">
              <p className="text-center text-sm text-gray-500 mb-3">Chain {chainIdx + 1}</p>
            </div>
          )}
          {chainEntries.map((re, idx) => (
            <RevealCard key={`${chainIdx}-${idx}`} entry={re} />
          ))}
        </div>
      ))}

      {entries.length === 0 && (
        <p className="text-center text-gray-400">
          {isHost ? "Click the button below to start the reveal!" : "Waiting for the host to start the reveal..."}
        </p>
      )}

      <div className="flex justify-center gap-4">
        {isHost && !isFinished && (
          <button
            onClick={onRevealNext}
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition hover:bg-blue-700"
          >
            {entries.length === 0 ? "Start Reveal" : "Next"}
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

function RevealCard({ entry }: { entry: RevealEntry }) {
  const e = entry.entry;

  if (e.type === "word") {
    return (
      <div className="rounded-lg bg-gray-800 p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">{e.playerName}&apos;s word</p>
        <p className="text-2xl font-bold text-blue-400">{e.content}</p>
      </div>
    );
  }

  if (e.type === "guess") {
    return (
      <div className="rounded-lg bg-gray-800 p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">{e.playerName} guessed</p>
        <p className="text-2xl font-bold text-yellow-400">{e.content}</p>
      </div>
    );
  }

  // Drawing
  let strokes: Stroke[] = [];
  try {
    strokes = JSON.parse(e.content);
  } catch {
    // empty
  }

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <p className="text-xs text-gray-500 mb-2 text-center">{e.playerName} drew</p>
      <DrawingCanvas readOnly initialStrokes={strokes} />
    </div>
  );
}
