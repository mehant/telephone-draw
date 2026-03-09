"use client";

interface WaitingPhaseProps {
  submittedCount: { count: number; total: number } | null;
}

export default function WaitingPhase({ submittedCount }: WaitingPhaseProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500" />
        <h2 className="text-2xl font-bold">Waiting for others...</h2>
        {submittedCount && (
          <p className="text-gray-400">
            {submittedCount.count}/{submittedCount.total} players submitted
          </p>
        )}
      </div>
    </div>
  );
}
