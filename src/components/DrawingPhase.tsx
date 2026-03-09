"use client";

import { useRef, useCallback, useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import Timer from "./Timer";
import type { Stroke } from "@/lib/types";

interface DrawingPhaseProps {
  prompt: string;
  duration: number;
  round: number;
  totalRounds: number;
  onSubmit: (drawingData: string) => void;
}

export default function DrawingPhase({ prompt, duration, round, totalRounds, onSubmit }: DrawingPhaseProps) {
  const strokesRef = useRef<Stroke[]>([]);
  const getStrokesRef = useRef<(() => Stroke[]) | null>(null);
  const submittedRef = useRef(false);
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const handleStrokesChange = useCallback((strokes: Stroke[]) => {
    strokesRef.current = strokes;
  }, []);

  const doSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const allStrokes = getStrokesRef.current ? getStrokesRef.current() : strokesRef.current;
    onSubmitRef.current(JSON.stringify(allStrokes));
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
        <p className="text-sm text-gray-400">Draw this word:</p>
        <p className="text-3xl font-bold text-blue-400">{prompt}</p>
      </div>

      <DrawingCanvas onStrokesChange={handleStrokesChange} getStrokesRef={getStrokesRef} />

      <button
        onClick={doSubmit}
        className="w-full rounded-lg bg-green-600 py-3 text-lg font-bold text-white transition hover:bg-green-700"
      >
        Submit Drawing
      </button>
    </div>
  );
}
