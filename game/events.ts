// Client → Server
export const C2S = {
  CREATE_GAME: "create-game",
  JOIN_GAME: "join-game",
  REQUEST_STATE: "request-state",
  SET_DIFFICULTY: "set-difficulty",
  START_GAME: "start-game",
  SUBMIT_DRAWING: "submit-drawing",
  SUBMIT_GUESS: "submit-guess",
  REVEAL_NEXT: "reveal-next",
  PLAY_AGAIN: "play-again",
} as const;

// Server → Client
export const S2C = {
  GAME_CREATED: "game-created",
  STATE_SYNC: "state-sync",
  PLAYER_JOINED: "player-joined",
  PLAYER_LEFT: "player-left",
  PLAYER_LIST: "player-list",
  DIFFICULTY_CHANGED: "difficulty-changed",
  GAME_STARTED: "game-started",
  ROUND_STARTED: "round-started",
  ASSIGNMENT: "assignment",
  PLAYER_SUBMITTED: "player-submitted",
  ROUND_ENDED: "round-ended",
  REVEAL_UPDATE: "reveal-update",
  GAME_FINISHED: "game-finished",
  GAME_RESET: "game-reset",
  ERROR: "error",
} as const;
