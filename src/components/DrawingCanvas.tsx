"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { Stroke } from "@/lib/types";
import ColorPicker from "./ColorPicker";

const BRUSH_SIZES = [3, 6, 12, 24];

interface DrawingCanvasProps {
  onStrokesChange?: (strokes: Stroke[]) => void;
  readOnly?: boolean;
  initialStrokes?: Stroke[];
  getStrokesRef?: React.MutableRefObject<(() => Stroke[]) | null>;
}

export default function DrawingCanvas({ onStrokesChange, readOnly = false, initialStrokes, getStrokesRef }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>(initialStrokes || []);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 600 });

  // Expose a getter that includes in-progress stroke
  const strokesStateRef = useRef(strokes);
  const currentStrokeRef = useRef(currentStroke);
  strokesStateRef.current = strokes;
  currentStrokeRef.current = currentStroke;

  useEffect(() => {
    if (getStrokesRef) {
      getStrokesRef.current = () => {
        const all = [...strokesStateRef.current];
        if (currentStrokeRef.current && currentStrokeRef.current.points.length >= 1) {
          all.push(currentStrokeRef.current);
        }
        return all;
      };
    }
  }, [getStrokesRef]);

  // Resize canvas to fit container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, 600);
        setCanvasSize({ width: size, height: size });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Redraw on any change
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvasSize;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
    for (const stroke of allStrokes) {
      if (stroke.points.length === 0) continue;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (stroke.points.length === 1) {
        // Single click — draw a dot
        const p = stroke.points[0];
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, stroke.brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x * width, stroke.points[0].y * height);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x * width, stroke.points[i].y * height);
        }
        ctx.stroke();
      }
    }
  }, [strokes, currentStroke, canvasSize]);

  const getPoint = useCallback(
    (e: React.PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (readOnly) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDrawing(true);
      const point = getPoint(e);
      setCurrentStroke({ color, brushSize, points: [point] });
    },
    [color, brushSize, readOnly, getPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing || readOnly) return;
      e.preventDefault();
      const point = getPoint(e);
      setCurrentStroke((prev) => {
        if (!prev) return null;
        return { ...prev, points: [...prev.points, point] };
      });
    },
    [isDrawing, readOnly, getPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing || readOnly) return;
    setIsDrawing(false);
    if (currentStroke && currentStroke.points.length >= 1) {
      const newStrokes = [...strokes, currentStroke];
      setStrokes(newStrokes);
      onStrokesChange?.(newStrokes);
    }
    setCurrentStroke(null);
  }, [isDrawing, readOnly, currentStroke, strokes, onStrokesChange]);

  const handleUndo = () => {
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    onStrokesChange?.(newStrokes);
  };

  const handleClear = () => {
    setStrokes([]);
    onStrokesChange?.([]);
  };

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="rounded-lg border-2 border-gray-600 cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-4">
          <ColorPicker selected={color} onSelect={setColor} />

          <div className="flex items-center gap-1.5">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`flex h-8 w-8 items-center justify-center rounded transition ${
                  brushSize === size ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: Math.min(size, 20), height: Math.min(size, 20) }}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={strokes.length === 0}
              className="rounded bg-gray-700 px-3 py-1.5 text-sm transition hover:bg-gray-600 disabled:opacity-30"
            >
              Undo
            </button>
            <button
              onClick={handleClear}
              disabled={strokes.length === 0}
              className="rounded bg-gray-700 px-3 py-1.5 text-sm transition hover:bg-gray-600 disabled:opacity-30"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
