import { Game } from "./Game";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${msg}`);
  } else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

function simulateGame(playerCount: number): Game {
  const game = new Game("TEST");
  const playerIds: string[] = [];

  // Add players
  for (let i = 0; i < playerCount; i++) {
    const id = `player-${i}`;
    playerIds.push(id);
    game.addPlayer(id, `Player ${i}`, i === 0);
  }

  // Start game
  game.startGame(() => {});

  // Play all rounds
  while (game.state.phase === "playing") {
    const isDrawing = game.isDrawingRound();

    for (const id of playerIds) {
      if (isDrawing) {
        game.submitDrawing(id, '[{"points":[]}]');
      } else {
        game.submitGuess(id, "test guess");
      }
    }

    game.advanceRound();
  }

  return game;
}

function runTests() {
  console.log("=== Game Chain Tests ===\n");

  for (const playerCount of [2, 3, 4, 5, 6, 7]) {
    console.log(`\n--- ${playerCount} players ---`);

    const game = simulateGame(playerCount);

    assert(
      game.state.phase === "reveal" || game.state.phase === "finished",
      `Game ended in ${game.state.phase}`
    );

    assert(
      game.state.totalRounds % 2 === 0,
      `totalRounds (${game.state.totalRounds}) is even`
    );

    for (let i = 0; i < game.state.chains.length; i++) {
      const chain = game.state.chains[i];
      const lastEntry = chain.entries[chain.entries.length - 1];

      assert(
        chain.entries[0].type === "word",
        `Chain ${i}: starts with a word`
      );

      assert(
        lastEntry.type === "guess",
        `Chain ${i}: ends with a guess (got "${lastEntry.type}")`
      );

      // Verify alternating pattern: word, drawing, guess, drawing, guess, ...
      for (let j = 1; j < chain.entries.length; j++) {
        const expected = j % 2 === 1 ? "drawing" : "guess";
        assert(
          chain.entries[j].type === expected,
          `Chain ${i}, entry ${j}: expected "${expected}", got "${chain.entries[j].type}"`
        );
      }
    }

    // Verify no player appears twice in game entries (entries 1+, excluding the initial word prompt)
    for (const chain of game.state.chains) {
      const seen = new Set<string>();
      for (let j = 1; j < chain.entries.length; j++) {
        const pid = chain.entries[j].playerId;
        assert(
          !seen.has(pid),
          `Chain by ${chain.originalPlayerId}: player ${pid} appears twice in game entries`
        );
        seen.add(pid);
      }
    }

    game.destroy();
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
