import { Chain, ChainEntry, Difficulty, GamePhase, GameState, Player, PlayerAssignment } from "./types";
import { getRandomWords } from "./words";

export class Game {
  state: GameState;
  private submittedThisRound: Set<string> = new Set();
  private roundTimer: ReturnType<typeof setTimeout> | null = null;
  private onRoundEnd: (() => void) | null = null;

  constructor(gameId: string) {
    this.state = {
      gameId,
      players: new Map(),
      phase: "lobby",
      difficulty: "simple",
      chains: [],
      currentRound: 0,
      totalRounds: 0,
      roundStartTime: 0,
      roundDuration: 60,
      revealChainIndex: 0,
    };
  }

  addPlayer(id: string, name: string, isHost: boolean): Player {
    const player: Player = {
      id,
      name,
      isHost,
      connected: true,
      order: this.state.players.size,
    };
    this.state.players.set(id, player);
    return player;
  }

  removePlayer(id: string): boolean {
    const player = this.state.players.get(id);
    if (!player) return false;

    if (this.state.phase === "lobby") {
      this.state.players.delete(id);
      // Reassign orders
      let order = 0;
      for (const p of this.state.players.values()) {
        p.order = order++;
      }
      // If host left, assign new host
      if (player.isHost && this.state.players.size > 0) {
        const newHost = this.state.players.values().next().value!;
        newHost.isHost = true;
      }
      return true;
    }

    // During game, mark disconnected
    player.connected = false;
    return false;
  }

  reconnectPlayer(oldId: string, newId: string): Player | null {
    const player = this.state.players.get(oldId);
    if (!player) return null;
    this.state.players.delete(oldId);
    player.id = newId;
    player.connected = true;
    this.state.players.set(newId, player);
    return player;
  }

  setDifficulty(difficulty: Difficulty): void {
    if (this.state.phase === "lobby") {
      this.state.difficulty = difficulty;
    }
  }

  getPlayerList(): { id: string; name: string; isHost: boolean; connected: boolean }[] {
    return Array.from(this.state.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      connected: p.connected,
    }));
  }

  startGame(onRoundEnd: () => void): boolean {
    if (this.state.phase !== "lobby") return false;
    if (this.state.players.size < 2) return false;

    this.onRoundEnd = onRoundEnd;
    const n = this.state.players.size;
    // Must be even so the game always ends on a guess round,
    // otherwise chains end with a drawing that nobody interprets.
    this.state.totalRounds = n % 2 === 0 ? n : n - 1;
    this.state.phase = "playing";

    // Initialize chains - one per player
    const words = getRandomWords(this.state.difficulty, n);
    const playerArr = this.getOrderedPlayers();

    this.state.chains = playerArr.map((player, i) => ({
      originalPlayerId: player.id,
      entries: [
        {
          playerId: player.id,
          playerName: player.name,
          type: "word" as const,
          content: words[i],
        },
      ],
    }));

    // Start round 1 (first drawing round)
    this.state.currentRound = 1;
    this.startRoundTimer();

    return true;
  }

  private getOrderedPlayers(): Player[] {
    return Array.from(this.state.players.values()).sort((a, b) => a.order - b.order);
  }

  private startRoundTimer(): void {
    const isDrawing = this.isDrawingRound();
    this.state.roundDuration = isDrawing ? 60 : 45;
    this.state.roundStartTime = Date.now();
    this.submittedThisRound = new Set();

    if (this.roundTimer) clearTimeout(this.roundTimer);
    // Grace period: wait a few extra seconds beyond what clients are told,
    // so client-side timers fire first and can submit before auto-submit kicks in.
    this.roundTimer = setTimeout(() => {
      this.autoSubmitMissing();
      this.onRoundEnd?.();
    }, (this.state.roundDuration + 3) * 1000);
  }

  isDrawingRound(): boolean {
    return this.state.currentRound % 2 === 1;
  }

  getAssignment(playerId: string): PlayerAssignment | null {
    if (this.state.phase !== "playing") return null;

    const player = this.state.players.get(playerId);
    if (!player) return null;

    const n = this.state.players.size;
    const round = this.state.currentRound;
    // Player at order p handles chain (p - round + N) % N in this round
    const chainIndex = ((player.order - round % n) + n) % n;
    const chain = this.state.chains[chainIndex];
    const lastEntry = chain.entries[chain.entries.length - 1];

    const isDrawing = this.isDrawingRound();
    return {
      chainIndex,
      type: isDrawing ? "draw" : "guess",
      prompt: lastEntry.content,
    };
  }

  submitDrawing(playerId: string, drawingData: string): boolean {
    if (this.state.phase !== "playing" || !this.isDrawingRound()) return false;
    if (this.submittedThisRound.has(playerId)) return false;

    const assignment = this.getAssignment(playerId);
    if (!assignment || assignment.type !== "draw") return false;

    const player = this.state.players.get(playerId)!;
    this.state.chains[assignment.chainIndex].entries.push({
      playerId,
      playerName: player.name,
      type: "drawing",
      content: drawingData,
    });

    this.submittedThisRound.add(playerId);
    return true;
  }

  submitGuess(playerId: string, guess: string): boolean {
    if (this.state.phase !== "playing" || this.isDrawingRound()) return false;
    if (this.submittedThisRound.has(playerId)) return false;

    const assignment = this.getAssignment(playerId);
    if (!assignment || assignment.type !== "guess") return false;

    const player = this.state.players.get(playerId)!;
    this.state.chains[assignment.chainIndex].entries.push({
      playerId,
      playerName: player.name,
      type: "guess",
      content: guess,
    });

    this.submittedThisRound.add(playerId);
    return true;
  }

  hasAllSubmitted(): boolean {
    const connected = Array.from(this.state.players.values()).filter((p) => p.connected);
    return connected.every((p) => this.submittedThisRound.has(p.id));
  }

  getSubmittedCount(): number {
    return this.submittedThisRound.size;
  }

  private autoSubmitMissing(): void {
    const connected = Array.from(this.state.players.values()).filter((p) => p.connected);
    for (const player of connected) {
      if (!this.submittedThisRound.has(player.id)) {
        if (this.isDrawingRound()) {
          this.submitDrawing(player.id, "[]"); // empty drawing
        } else {
          this.submitGuess(player.id, "???");
        }
      }
    }
  }

  advanceRound(): boolean {
    if (this.roundTimer) {
      clearTimeout(this.roundTimer);
      this.roundTimer = null;
    }

    this.state.currentRound++;

    if (this.state.currentRound > this.state.totalRounds) {
      // Game is over, go to reveal
      this.state.phase = "reveal";
      this.state.revealChainIndex = 0;
      return false; // no more rounds
    }

    this.startRoundTimer();
    return true; // more rounds to play
  }

  revealChain(): { chainIndex: number; entries: ChainEntry[]; done: boolean } | null {
    if (this.state.phase !== "reveal") return null;

    const chain = this.state.chains[this.state.revealChainIndex];
    if (!chain) return null;

    const result = {
      chainIndex: this.state.revealChainIndex,
      entries: chain.entries,
      done: false,
    };

    this.state.revealChainIndex++;
    if (this.state.revealChainIndex >= this.state.chains.length) {
      this.state.phase = "finished";
      result.done = true;
    }

    return result;
  }

  getRevealData(): { chainIndex: number; entries: ChainEntry[]; done: boolean }[] {
    const revealed: { chainIndex: number; entries: ChainEntry[]; done: boolean }[] = [];
    for (let i = 0; i < this.state.revealChainIndex; i++) {
      revealed.push({
        chainIndex: i,
        entries: this.state.chains[i].entries,
        done: this.state.phase === "finished" && i === this.state.chains.length - 1,
      });
    }
    return revealed;
  }

  resetToLobby(): void {
    if (this.roundTimer) {
      clearTimeout(this.roundTimer);
      this.roundTimer = null;
    }
    this.state.phase = "lobby";
    this.state.chains = [];
    this.state.currentRound = 0;
    this.state.totalRounds = 0;
    this.state.revealChainIndex = 0;
    this.submittedThisRound = new Set();
  }

  destroy(): void {
    if (this.roundTimer) {
      clearTimeout(this.roundTimer);
      this.roundTimer = null;
    }
  }
}
