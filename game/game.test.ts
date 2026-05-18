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

  // === Disconnect edge case tests ===

  console.log("\n\n=== Disconnect Edge Case Tests ===");

  // Test: Player disconnects during drawing round (round 1)
  {
    console.log("\n--- Player disconnects during round 1 (drawing) ---");
    const game = new Game("DC-TEST-1");
    const ids = ["p0", "p1", "p2", "p3"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // p2 disconnects before submitting in round 1
    game.removePlayer("p2");
    game.submitDrawing("p0", '[{"points":[]}]');
    game.submitDrawing("p1", '[{"points":[]}]');
    game.submitDrawing("p3", '[{"points":[]}]');

    // hasAllSubmitted should be true (only checks connected)
    assert(game.hasAllSubmitted(), "hasAllSubmitted true after connected players submit");

    // advanceRound should auto-submit for p2
    game.advanceRound();

    // Check that p2's chain got an auto-submitted drawing entry
    for (const chain of game.state.chains) {
      assert(
        chain.entries.length === 2,
        `Chain has 2 entries after round 1 (word + drawing), got ${chain.entries.length}`
      );
      assert(
        chain.entries[1].type === "drawing",
        `Second entry is drawing, got ${chain.entries[1].type}`
      );
    }
    game.destroy();
  }

  // Test: Player disconnects during guess round (round 2)
  {
    console.log("\n--- Player disconnects during round 2 (guessing) ---");
    const game = new Game("DC-TEST-2");
    const ids = ["p0", "p1", "p2", "p3"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // Round 1: all submit drawings
    ids.forEach((id) => game.submitDrawing(id, '[{"points":[]}]'));
    game.advanceRound();

    // Round 2 (guess): p1 disconnects
    game.removePlayer("p1");
    game.submitGuess("p0", "guess0");
    game.submitGuess("p2", "guess2");
    game.submitGuess("p3", "guess3");

    assert(game.hasAllSubmitted(), "hasAllSubmitted true after connected players submit in round 2");
    game.advanceRound();

    // All chains should have 3 entries: word, drawing, guess
    for (let i = 0; i < game.state.chains.length; i++) {
      const chain = game.state.chains[i];
      assert(
        chain.entries.length === 3,
        `Chain ${i} has 3 entries after round 2, got ${chain.entries.length}`
      );
      assert(
        chain.entries[2].type === "guess",
        `Third entry is guess, got ${chain.entries[2].type}`
      );
    }

    // The chain p1 was assigned to should have "???" as the guess
    const p1Assignment = game.getAssignment("p1");
    // p1 is disconnected but still in game, previous round assignment would have been for round 2
    // Let's check by finding the "???" guess
    let foundAutoGuess = false;
    for (const chain of game.state.chains) {
      if (chain.entries[2].content === "???") {
        foundAutoGuess = true;
        assert(
          chain.entries[2].playerId === "p1",
          `Auto-submitted guess belongs to disconnected player p1`
        );
      }
    }
    assert(foundAutoGuess, "Found auto-submitted '???' guess for disconnected player");
    game.destroy();
  }

  // Test: Player disconnects after already submitting (no impact)
  {
    console.log("\n--- Player disconnects after submitting ---");
    const game = new Game("DC-TEST-3");
    const ids = ["p0", "p1", "p2", "p3"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // p2 submits then disconnects
    game.submitDrawing("p0", '[{"points":[]}]');
    game.submitDrawing("p2", '[{"points":"p2drew"}]');
    game.removePlayer("p2");
    game.submitDrawing("p1", '[{"points":[]}]');
    game.submitDrawing("p3", '[{"points":[]}]');

    game.advanceRound();

    // p2's submission should be their actual drawing, not auto-submitted
    let foundP2Drawing = false;
    for (const chain of game.state.chains) {
      if (chain.entries[1].playerId === "p2") {
        assert(
          chain.entries[1].content === '[{"points":"p2drew"}]',
          "p2's actual drawing preserved (not overwritten by auto-submit)"
        );
        foundP2Drawing = true;
      }
    }
    assert(foundP2Drawing, "Found p2's drawing entry");
    game.destroy();
  }

  // Test: Multiple players disconnect
  {
    console.log("\n--- Multiple players disconnect ---");
    const game = new Game("DC-TEST-4");
    const ids = ["p0", "p1", "p2", "p3", "p4", "p5"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // p2 and p4 disconnect in round 1
    game.removePlayer("p2");
    game.removePlayer("p4");
    game.submitDrawing("p0", '[{"points":[]}]');
    game.submitDrawing("p1", '[{"points":[]}]');
    game.submitDrawing("p3", '[{"points":[]}]');
    game.submitDrawing("p5", '[{"points":[]}]');
    game.advanceRound();

    // All 6 chains should have word + drawing
    for (let i = 0; i < game.state.chains.length; i++) {
      assert(
        game.state.chains[i].entries.length === 2,
        `Chain ${i} has 2 entries with 2 disconnected players, got ${game.state.chains[i].entries.length}`
      );
    }

    // Auto-submitted drawings should be "[]"
    let autoDrawCount = 0;
    for (const chain of game.state.chains) {
      if (chain.entries[1].content === "[]") autoDrawCount++;
    }
    assert(autoDrawCount === 2, `2 auto-submitted empty drawings, got ${autoDrawCount}`);
    game.destroy();
  }

  // Test: Full game with disconnected player has correct chain structure
  {
    console.log("\n--- Full game with disconnected player: chain structure ---");
    const game = new Game("DC-TEST-5");
    const ids = ["p0", "p1", "p2", "p3"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // p2 disconnects before round 1
    game.removePlayer("p2");
    const connectedIds = ["p0", "p1", "p3"];

    while (game.state.phase === "playing") {
      const isDrawing = game.isDrawingRound();
      for (const id of connectedIds) {
        if (isDrawing) {
          game.submitDrawing(id, '[{"points":[]}]');
        } else {
          game.submitGuess(id, "test guess");
        }
      }
      game.advanceRound();
    }

    assert(
      game.state.phase === "reveal" || game.state.phase === "finished",
      `Game with disconnect completed: phase=${game.state.phase}`
    );

    // Every chain should have correct alternating structure
    for (let i = 0; i < game.state.chains.length; i++) {
      const chain = game.state.chains[i];
      const expectedEntries = game.state.totalRounds + 1; // word + one entry per round
      assert(
        chain.entries.length === expectedEntries,
        `Chain ${i} has ${expectedEntries} entries, got ${chain.entries.length}`
      );

      assert(chain.entries[0].type === "word", `Chain ${i} starts with word`);

      for (let j = 1; j < chain.entries.length; j++) {
        const expected = j % 2 === 1 ? "drawing" : "guess";
        assert(
          chain.entries[j].type === expected,
          `Chain ${i}, entry ${j}: expected "${expected}", got "${chain.entries[j].type}"`
        );
      }

      // Last entry should be guess
      assert(
        chain.entries[chain.entries.length - 1].type === "guess",
        `Chain ${i} ends with guess`
      );
    }
    game.destroy();
  }

  // Test: Player disconnects in round 1, prompt in round 2 is a drawing (not raw JSON text)
  {
    console.log("\n--- Prompt type correctness after disconnect ---");
    const game = new Game("DC-TEST-6");
    const ids = ["p0", "p1", "p2", "p3"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // Round 1: p2 disconnects, others submit
    game.removePlayer("p2");
    game.submitDrawing("p0", '[{"color":"red"}]');
    game.submitDrawing("p1", '[{"color":"blue"}]');
    game.submitDrawing("p3", '[{"color":"green"}]');
    game.advanceRound(); // auto-submits "[]" for p2

    // Round 2 (guess): every connected player's assignment prompt should be a drawing
    // NOT a word and NOT raw JSON displayed as a word prompt
    for (const id of ["p0", "p1", "p3"]) {
      const assignment = game.getAssignment(id);
      assert(assignment !== null, `${id} has assignment in round 2`);
      assert(assignment!.type === "guess", `${id} assignment is guess type`);
      // The prompt should be drawing data (starts with "[")
      assert(
        assignment!.prompt.startsWith("["),
        `${id} prompt is drawing data, not a word`
      );
    }
    game.destroy();
  }

  // Test: Player disconnects mid-game, then reconnects
  {
    console.log("\n--- Player disconnects and reconnects ---");
    const game = new Game("DC-TEST-7");
    const ids = ["p0", "p1", "p2", "p3"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // Round 1: p2 disconnects
    game.removePlayer("p2");
    game.submitDrawing("p0", '[{"points":[]}]');
    game.submitDrawing("p1", '[{"points":[]}]');
    game.submitDrawing("p3", '[{"points":[]}]');
    game.advanceRound(); // auto-submits for p2

    // p2 reconnects with new socket id
    const reconnected = game.reconnectPlayer("p2", "p2-new");
    assert(reconnected !== null, "p2 reconnected successfully");
    assert(reconnected!.connected === true, "p2 is now connected");

    // p2-new should get a valid assignment for round 2
    const assignment = game.getAssignment("p2-new");
    assert(assignment !== null, "Reconnected p2 has assignment");
    assert(assignment!.type === "guess", "Reconnected p2 gets guess assignment");

    game.destroy();
  }

  // Test: All players except host disconnect
  {
    console.log("\n--- All players except host disconnect ---");
    const game = new Game("DC-TEST-8");
    const ids = ["p0", "p1", "p2"];
    ids.forEach((id, i) => game.addPlayer(id, `P${i}`, i === 0));
    game.startGame(() => {});

    // p1 and p2 disconnect
    game.removePlayer("p1");
    game.removePlayer("p2");

    // Only p0 submits, then advance
    game.submitDrawing("p0", '[{"points":[]}]');
    assert(game.hasAllSubmitted(), "hasAllSubmitted with only host connected");

    // Play through all rounds
    while (game.state.phase === "playing") {
      if (!game.hasAllSubmitted()) {
        if (game.isDrawingRound()) {
          game.submitDrawing("p0", '[{"points":[]}]');
        } else {
          game.submitGuess("p0", "solo guess");
        }
      }
      game.advanceRound();
    }

    assert(
      game.state.phase === "reveal" || game.state.phase === "finished",
      `Game completed with only host: phase=${game.state.phase}`
    );

    // All chains should have correct entry count
    for (let i = 0; i < game.state.chains.length; i++) {
      const chain = game.state.chains[i];
      assert(
        chain.entries.length === game.state.totalRounds + 1,
        `Chain ${i}: ${game.state.totalRounds + 1} entries, got ${chain.entries.length}`
      );
    }
    game.destroy();
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
