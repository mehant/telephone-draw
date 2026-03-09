"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket } from "@/lib/socket";
import type { PlayerInfo, AssignmentData, RevealEntry, Difficulty, ClientPhase } from "@/lib/types";

export function useSocket(gameId?: string) {
  const [phase, setPhase] = useState<ClientPhase>(gameId ? "connecting" : "home");
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("simple");
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [submittedCount, setSubmittedCount] = useState<{ count: number; total: number } | null>(null);
  const [revealEntries, setRevealEntries] = useState<RevealEntry[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(getSocket());
  const gameIdRef = useRef(gameId);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket.connected) {
      socket.connect();
    }

    const requestState = () => {
      if (gameIdRef.current) {
        socket.emit("request-state", { gameId: gameIdRef.current });
      }
    };

    socket.on("connect", () => {
      setMyId(socket.id ?? null);
      setConnected(true);
      requestState();
    });

    // If already connected when hook mounts, request state immediately
    if (socket.connected) {
      setMyId(socket.id ?? null);
      setConnected(true);
      requestState();
    }

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("state-sync", (data: {
      needJoin: boolean;
      gameExists: boolean;
      phase?: string;
      players?: PlayerInfo[];
      difficulty?: Difficulty;
    }) => {
      if (!data.gameExists) {
        setPhase("home");
        setError("Game not found");
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (data.needJoin) {
        if (data.phase !== "lobby") {
          setError("Game already in progress");
          setTimeout(() => setError(null), 3000);
          setPhase("home");
        } else {
          setPhase("need-join");
        }
        return;
      }

      // Already in the game — restore state
      if (data.players) setPlayers(data.players);
      if (data.difficulty) setDifficulty(data.difficulty);
      setPhase((data.phase as ClientPhase) || "lobby");
    });

    socket.on("player-list", (list: PlayerInfo[]) => {
      setPlayers(list);
    });

    socket.on("difficulty-changed", (d: Difficulty) => {
      setDifficulty(d);
    });

    socket.on("game-started", () => {
      setPhase("playing");
    });

    socket.on("assignment", (data: AssignmentData) => {
      setAssignment(data);
      setSubmittedCount(null);
    });

    socket.on("player-submitted", (data: { count: number; total: number }) => {
      setSubmittedCount(data);
    });

    socket.on("round-ended", (data: { round: number; reveal?: boolean }) => {
      if (data.reveal) {
        setPhase("reveal");
        setAssignment(null);
      }
    });

    socket.on("reveal-update", (data: RevealEntry) => {
      setRevealEntries((prev) => [...prev, data]);
      if (data.done) {
        setIsFinished(true);
      }
    });

    socket.on("game-finished", () => {
      setPhase("finished");
    });

    socket.on("game-reset", () => {
      setPhase("lobby");
      setAssignment(null);
      setSubmittedCount(null);
      setRevealEntries([]);
      setIsFinished(false);
    });

    socket.on("error", (msg: string) => {
      setError(msg);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("state-sync");
      socket.off("player-list");
      socket.off("difficulty-changed");
      socket.off("game-started");
      socket.off("assignment");
      socket.off("player-submitted");
      socket.off("round-ended");
      socket.off("reveal-update");
      socket.off("game-finished");
      socket.off("game-reset");
      socket.off("error");
    };
  }, []);

  const createGame = useCallback((playerName: string): Promise<string> => {
    return new Promise((resolve) => {
      socketRef.current.emit("create-game", { playerName }, (res: { gameId: string }) => {
        resolve(res.gameId);
      });
    });
  }, []);

  const joinGame = useCallback((gId: string, playerName: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      socketRef.current.emit("join-game", { gameId: gId.toUpperCase(), playerName }, (res: { success: boolean; error?: string }) => {
        if (res.success) {
          setPhase("lobby");
        }
        resolve(res);
      });
    });
  }, []);

  const setGameDifficulty = useCallback((difficulty: Difficulty) => {
    socketRef.current.emit("set-difficulty", { difficulty });
  }, []);

  const startGame = useCallback(() => {
    socketRef.current.emit("start-game");
  }, []);

  const submitDrawing = useCallback((drawingData: string) => {
    socketRef.current.emit("submit-drawing", { drawingData });
    setAssignment(null);
  }, []);

  const submitGuess = useCallback((guess: string) => {
    socketRef.current.emit("submit-guess", { guess });
    setAssignment(null);
  }, []);

  const revealNext = useCallback(() => {
    socketRef.current.emit("reveal-next");
  }, []);

  const playAgain = useCallback(() => {
    socketRef.current.emit("play-again");
  }, []);

  const isHost = players.find((p) => p.id === myId)?.isHost ?? false;

  return {
    phase,
    players,
    difficulty,
    assignment,
    submittedCount,
    revealEntries,
    isFinished,
    error,
    myId,
    isHost,
    connected,
    createGame,
    joinGame,
    setDifficulty: setGameDifficulty,
    startGame,
    submitDrawing,
    submitGuess,
    revealNext,
    playAgain,
  };
}
