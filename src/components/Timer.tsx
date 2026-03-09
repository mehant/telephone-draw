"use client";

import { useEffect, useState, useRef } from "react";

interface TimerProps {
  duration: number;
  onExpire?: () => void;
}

export default function Timer({ duration, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemaining(duration);
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Call onExpire outside the state updater via ref
          setTimeout(() => onExpireRef.current?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [duration]);

  const pct = (remaining / duration) * 100;
  const urgent = remaining <= 10;

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            urgent ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`min-w-[3ch] text-right font-mono text-lg font-bold ${urgent ? "text-red-400" : "text-white"}`}>
        {remaining}
      </span>
    </div>
  );
}
