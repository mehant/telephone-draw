# CLAUDE.md - Telephone Draw

## What is this?

Real-time multiplayer drawing & guessing game (like "telephone"). Players create chains: draw a word, next player guesses, next draws that guess, etc. At the end, reveal chains to see how the original word transformed. Live at https://telephone-draw.com/.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript
- **Backend:** Node.js HTTP server + Socket.IO 4 (in `server.ts`)
- **Real-time:** Socket.IO (client in `src/lib/socket.ts`, server in `game/GameManager.ts`)
- **Analytics:** PostHog
- **Runtime TS execution:** tsx

## Commands

```bash
npm run dev          # Dev server (tsx server.ts) on port 3000
npm run build        # next build
npm start            # NODE_ENV=production tsx server.ts
npx tsx game/game.test.ts   # Run unit tests (314 assertions)
npx tsx test-e2e.ts         # Run e2e tests
```

No `npm test` script exists — run tests directly with `npx tsx`.

## Project Structure

```
server.ts                         # HTTP + Socket.IO server entry point
game/
  Game.ts                         # Core state machine (phases, rounds, chains, reveals)
  GameManager.ts                  # Socket.IO event handlers, game orchestration
  events.ts                       # C2S and S2C event name constants
  types.ts                        # Backend types (Player, Chain, GameState, etc.)
  words.ts                        # getRandomWords() with Fisher-Yates shuffle
  simple-words.ts                 # ~5000 simple words
  complex-words.ts                # ~5000 complex phrases
  game.test.ts                    # Unit tests for game logic
src/
  app/
    layout.tsx                    # Root layout + PostHog provider
    page.tsx                      # Home page (create/join game)
    about/page.tsx                # How-to-play instructions
    game/[gameId]/page.tsx        # Main game page (renders phase components)
  components/
    Lobby.tsx                     # Pre-game: player list, difficulty, start button
    DrawingPhase.tsx              # Drawing round: prompt, canvas, timer
    GuessingPhase.tsx             # Guessing round: drawing display, input, timer
    WaitingPhase.tsx              # Spinner while waiting for submissions
    RevealPhase.tsx               # Post-game chain reveal with navigation
    DrawingCanvas.tsx             # HTML5 Canvas (draw/view mode, color/brush controls)
    Timer.tsx                     # Countdown timer with progress bar
    ColorPicker.tsx               # 10-color palette selector
    PlayerList.tsx                # Player names with host/connection indicators
    PostHogProvider.tsx           # PostHog client init
  hooks/
    useSocket.ts                  # Socket.IO hook: all state + emit methods
  lib/
    socket.ts                     # Socket.IO client singleton factory
    types.ts                      # Frontend types (PlayerInfo, AssignmentData, etc.)
    posthog.ts                    # PostHog init
test-e2e.ts                       # End-to-end Socket.IO tests
```

## Game Phases & State Machine

```
LOBBY → PLAYING (rounds alternate draw/guess) → REVEAL → FINISHED → (Play Again → LOBBY)
```

- **Lobby:** Players join via 6-letter code. Host sets difficulty (simple/complex), starts game.
- **Playing:** Alternating rounds. Odd rounds = draw (60s), even rounds = guess (45s). Server auto-submits on timeout (+3s grace): empty drawing `"[]"` or guess `"???"`.
- **Reveal:** Host clicks through chains one by one. Page scrolls to top on each reveal.
- **Finished:** All chains revealed. Host can "Play Again" to reset to lobby.

### Round count
- Even player count → totalRounds = playerCount
- Odd player count → totalRounds = playerCount - 1
- Always ends on a guess round

### Chain rotation formula
```typescript
const chainIndex = ((player.order - (round - 1)) % n + n) % n
```
Each round, players rotate to work on a different chain. Each player draws their own word in round 1.

## Socket.IO Events

### Client → Server (C2S) — defined in `game/events.ts`
| Event | Purpose |
|-------|---------|
| `create-game` | Create game, get gameId back |
| `join-game` | Join with code + name |
| `request-state` | Re-sync on reconnect |
| `set-difficulty` | Host sets simple/complex |
| `start-game` | Host starts game |
| `submit-drawing` | Submit JSON-stringified strokes |
| `submit-guess` | Submit guess text |
| `reveal-next` | Host reveals next chain |
| `play-again` | Host resets to lobby |

### Server → Client (S2C)
| Event | Purpose |
|-------|---------|
| `state-sync` | Full state on join/reconnect |
| `player-list` | Updated player list |
| `difficulty-changed` | Difficulty updated |
| `game-started` | Game began |
| `assignment` | Player's task for this round |
| `player-submitted` | Submission count update |
| `round-ended` | Round complete (may include reveal flag) |
| `reveal-update` | Chain data for reveal |
| `game-finished` | All chains revealed |
| `game-reset` | Back to lobby |
| `error` | Error message |

## Key Types

### Backend (`game/types.ts`)
- `Player` — id, name, isHost, connected, order
- `Stroke` — color, brushSize, points (normalized 0-1 coords)
- `ChainEntry` — playerId, playerName, type (word/drawing/guess), content
- `Chain` — originalPlayerId, entries[]
- `GameState` — gameId, players (Map), phase, difficulty, chains, currentRound, totalRounds, roundStartTime, roundDuration, revealChainIndex
- `PlayerAssignment` — chainIndex, type (draw/guess), prompt
- `GamePhase` — "lobby" | "playing" | "reveal" | "finished"
- `Difficulty` — "simple" | "complex"

### Frontend (`src/lib/types.ts`)
- Mirrors backend types plus: `AssignmentData` (includes round/totalRounds/duration), `RevealChainData` (chainIndex, entries, done), `ClientPhase` (adds "home", "connecting", "need-join")

## Key Implementation Details

- **Drawing coordinates** are normalized (0-1) for responsive scaling
- **Drawings** are serialized as JSON arrays of `Stroke` objects
- **Host-only actions:** set difficulty, start game, reveal chains, play again
- **Reconnection:** Players marked disconnected but stay in game; can reconnect with new socket ID via `request-state`
- **Game cleanup:** Games destroyed when all players disconnect
- **CORS:** Socket.IO allows all origins (`"*"`)
- **Port:** `process.env.PORT` or 3000

## Environment Variables

```
NEXT_PUBLIC_POSTHOG_KEY=<posthog project key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## PostHog Events Tracked

- `create_game_clicked`, `start_game_clicked`, `play_again_clicked`, `reveal_phase_viewed`

## Testing

- `game/game.test.ts` — Tests chain structure for 2-7 players: correct phase transitions, alternating draw/guess pattern, proper player rotation, totalRounds is even
- `test-e2e.ts` — Full game flow via Socket.IO client connections
- No test framework (vitest/jest) — tests use plain assertions with `process.exit(1)` on failure
