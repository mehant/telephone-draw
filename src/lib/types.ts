export interface PlayerInfo {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
}

export interface Stroke {
  color: string;
  brushSize: number;
  points: { x: number; y: number }[];
}

export interface ChainEntry {
  playerId: string;
  playerName: string;
  type: "word" | "drawing" | "guess";
  content: string;
}

export interface AssignmentData {
  type: "draw" | "guess";
  prompt: string;
  round: number;
  totalRounds: number;
  duration: number;
}

export interface RevealChainData {
  chainIndex: number;
  entries: ChainEntry[];
  done: boolean;
}

export type Difficulty = "simple" | "complex";
export type ClientPhase = "home" | "connecting" | "need-join" | "lobby" | "playing" | "reveal" | "finished";
