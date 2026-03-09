export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
  order: number;
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
  content: string; // word/guess text, or JSON-stringified Stroke[] for drawings
}

export interface Chain {
  originalPlayerId: string;
  entries: ChainEntry[];
}

export type Difficulty = "simple" | "complex";
export type GamePhase = "lobby" | "playing" | "reveal" | "finished";

export interface GameState {
  gameId: string;
  players: Map<string, Player>;
  phase: GamePhase;
  difficulty: Difficulty;
  chains: Chain[];
  currentRound: number;
  totalRounds: number;
  roundStartTime: number;
  roundDuration: number; // in seconds
  revealChainIndex: number;
}

export interface PlayerAssignment {
  chainIndex: number;
  type: "draw" | "guess";
  prompt: string; // the word or guess to draw, or the drawing data to guess from
}
