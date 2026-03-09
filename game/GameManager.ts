import { Server, Socket } from "socket.io";
import { customAlphabet } from "nanoid";
import { Game } from "./Game";
import { C2S, S2C } from "./events";

const generateId = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export class GameManager {
  private games: Map<string, Game> = new Map();
  private socketToGame: Map<string, string> = new Map();

  constructor(private io: Server) {
    io.on("connection", (socket) => this.handleConnection(socket));
  }

  private handleConnection(socket: Socket): void {
    socket.on(C2S.CREATE_GAME, (data: { playerName: string }, callback: (res: { gameId: string }) => void) => {
      const gameId = generateId();
      const game = new Game(gameId);
      this.games.set(gameId, game);

      game.addPlayer(socket.id, data.playerName, true);
      socket.join(gameId);
      this.socketToGame.set(socket.id, gameId);

      callback({ gameId });
      this.io.to(gameId).emit(S2C.PLAYER_LIST, game.getPlayerList());
    });

    socket.on(C2S.JOIN_GAME, (data: { gameId: string; playerName: string }, callback: (res: { success: boolean; error?: string }) => void) => {
      const gameId = data.gameId.toUpperCase();
      const game = this.games.get(gameId);

      if (!game) {
        callback({ success: false, error: "Game not found" });
        return;
      }

      if (game.state.phase !== "lobby") {
        callback({ success: false, error: "Game already in progress" });
        return;
      }

      game.addPlayer(socket.id, data.playerName, false);
      socket.join(gameId);
      this.socketToGame.set(socket.id, gameId);

      callback({ success: true });
      this.io.to(gameId).emit(S2C.PLAYER_LIST, game.getPlayerList());
      this.io.to(gameId).emit(S2C.DIFFICULTY_CHANGED, game.state.difficulty);
    });

    socket.on(C2S.REQUEST_STATE, (data: { gameId: string }) => {
      const gameId = data.gameId.toUpperCase();
      const game = this.games.get(gameId);

      if (!game) {
        socket.emit(S2C.STATE_SYNC, { needJoin: false, gameExists: false });
        return;
      }

      // Check if this socket is already in the game
      const existingPlayer = game.state.players.get(socket.id);
      if (existingPlayer) {
        // Already in game - send full state
        socket.emit(S2C.STATE_SYNC, {
          needJoin: false,
          gameExists: true,
          phase: game.state.phase,
          players: game.getPlayerList(),
          difficulty: game.state.difficulty,
        });

        // If playing, also send current assignment
        if (game.state.phase === "playing") {
          const assignment = game.getAssignment(socket.id);
          if (assignment) {
            const elapsed = Math.floor((Date.now() - game.state.roundStartTime) / 1000);
            const remaining = Math.max(0, game.state.roundDuration - elapsed);
            socket.emit(S2C.ASSIGNMENT, {
              type: assignment.type,
              prompt: assignment.prompt,
              round: game.state.currentRound,
              totalRounds: game.state.totalRounds,
              duration: remaining,
            });
          }
        }

        // If in reveal, send revealed chains
        if (game.state.phase === "reveal" || game.state.phase === "finished") {
          const revealedChains = game.getRevealData();
          for (const chainData of revealedChains) {
            socket.emit(S2C.REVEAL_UPDATE, {
              chainIndex: chainData.chainIndex,
              entries: chainData.entries,
              done: chainData.done,
            });
          }
          if (game.state.phase === "finished") {
            socket.emit(S2C.GAME_FINISHED);
          }
        }
        return;
      }

      // Not in the game - tell client they need to join
      socket.emit(S2C.STATE_SYNC, {
        needJoin: true,
        gameExists: true,
        phase: game.state.phase,
      });
    });

    socket.on(C2S.SET_DIFFICULTY, (data: { difficulty: "simple" | "complex" }) => {
      const game = this.getGame(socket);
      if (!game) return;

      const player = game.state.players.get(socket.id);
      if (!player?.isHost) return;

      game.setDifficulty(data.difficulty);
      this.io.to(game.state.gameId).emit(S2C.DIFFICULTY_CHANGED, data.difficulty);
    });

    socket.on(C2S.START_GAME, () => {
      const game = this.getGame(socket);
      if (!game) return;

      const player = game.state.players.get(socket.id);
      if (!player?.isHost) return;

      const started = game.startGame(() => this.handleRoundTimeout(game));
      if (!started) {
        socket.emit(S2C.ERROR, "Need at least 2 players to start");
        return;
      }

      this.io.to(game.state.gameId).emit(S2C.GAME_STARTED);
      this.sendAssignments(game);
    });

    socket.on(C2S.SUBMIT_DRAWING, (data: { drawingData: string }) => {
      const game = this.getGame(socket);
      if (!game) return;

      const success = game.submitDrawing(socket.id, data.drawingData);
      if (!success) return;

      this.io.to(game.state.gameId).emit(S2C.PLAYER_SUBMITTED, {
        count: game.getSubmittedCount(),
        total: game.state.players.size,
      });

      if (game.hasAllSubmitted()) {
        this.advanceRound(game);
      }
    });

    socket.on(C2S.SUBMIT_GUESS, (data: { guess: string }) => {
      const game = this.getGame(socket);
      if (!game) return;

      const success = game.submitGuess(socket.id, data.guess);
      if (!success) return;

      this.io.to(game.state.gameId).emit(S2C.PLAYER_SUBMITTED, {
        count: game.getSubmittedCount(),
        total: game.state.players.size,
      });

      if (game.hasAllSubmitted()) {
        this.advanceRound(game);
      }
    });

    socket.on(C2S.REVEAL_NEXT, () => {
      const game = this.getGame(socket);
      if (!game) return;

      const player = game.state.players.get(socket.id);
      if (!player?.isHost) return;

      const result = game.revealChain();
      if (!result) return;

      this.io.to(game.state.gameId).emit(S2C.REVEAL_UPDATE, {
        chainIndex: result.chainIndex,
        entries: result.entries,
        done: result.done,
      });

      if (result.done) {
        this.io.to(game.state.gameId).emit(S2C.GAME_FINISHED);
      }
    });

    socket.on(C2S.PLAY_AGAIN, () => {
      const game = this.getGame(socket);
      if (!game) return;

      const player = game.state.players.get(socket.id);
      if (!player?.isHost) return;

      game.resetToLobby();
      this.io.to(game.state.gameId).emit(S2C.GAME_RESET);
      this.io.to(game.state.gameId).emit(S2C.PLAYER_LIST, game.getPlayerList());
    });

    socket.on("disconnect", () => {
      const game = this.getGame(socket);
      if (!game) return;

      const removed = game.removePlayer(socket.id);
      this.socketToGame.delete(socket.id);

      this.io.to(game.state.gameId).emit(S2C.PLAYER_LIST, game.getPlayerList());

      if (removed && game.state.players.size === 0) {
        game.destroy();
        this.games.delete(game.state.gameId);
      }
    });
  }

  private getGame(socket: Socket): Game | null {
    const gameId = this.socketToGame.get(socket.id);
    if (!gameId) return null;
    return this.games.get(gameId) || null;
  }

  private sendAssignments(game: Game): void {
    for (const [socketId, player] of game.state.players) {
      const assignment = game.getAssignment(socketId);
      if (assignment) {
        this.io.to(socketId).emit(S2C.ASSIGNMENT, {
          type: assignment.type,
          prompt: assignment.prompt,
          round: game.state.currentRound,
          totalRounds: game.state.totalRounds,
          duration: game.state.roundDuration,
        });
      }
    }
  }

  private advanceRound(game: Game): void {
    const hasMore = game.advanceRound();

    if (hasMore) {
      this.io.to(game.state.gameId).emit(S2C.ROUND_ENDED, {
        round: game.state.currentRound - 1,
      });
      this.sendAssignments(game);
    } else {
      // Game is in reveal phase now
      this.io.to(game.state.gameId).emit(S2C.ROUND_ENDED, {
        round: game.state.currentRound - 1,
        reveal: true,
      });
    }
  }

  private handleRoundTimeout(game: Game): void {
    this.advanceRound(game);
  }
}
