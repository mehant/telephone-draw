"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import Timer from "./Timer";
import type { Stroke } from "@/lib/types";

interface GuessingPhaseProps {
  drawingData: string;
  duration: number;
  round: number;
  totalRounds: number;
  onSubmit: (guess: string) => void;
}

export default function GuessingPhase({ drawingData, duration, round, totalRounds, onSubmit }: GuessingPhaseProps) {
  const [guess, setGuess] = useState("");
  const guessRef = useRef(guess);
  guessRef.current = guess;
  const submittedRef = useRef(false);
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  let strokes: Stroke[] = [];
  try {
    strokes = JSON.parse(drawingData);
  } catch {
    // empty drawing
  }

  const doSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmitRef.current(guessRef.current.trim() || "???");
  }, []);


  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Round {round}/{totalRounds}
        </span>
        <Timer duration={duration} onExpire={doSubmit} />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400">What is this drawing?</p>
      </div>

      <DrawingCanvas readOnly initialStrokes={strokes} />

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your guess..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          maxLength={100}
          onKeyDown={(e) => e.key === "Enter" && doSubmit()}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          autoFocus
        />
        <button
          onClick={doSubmit}
          className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
