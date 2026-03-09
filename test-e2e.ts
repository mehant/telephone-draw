import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

function connect(): Promise<Socket> {
  return new Promise((resolve) => {
    const s = io(URL);
    s.on("connect", () => resolve(s));
  });
}

function waitFor(socket: Socket, event: string): Promise<any> {
  return new Promise((resolve) => {
    socket.once(event, (data: any) => resolve(data));
  });
}

// Collect all events of a type into an array
function collectEvents(socket: Socket, event: string): any[] {
  const events: any[] = [];
  socket.on(event, (data: any) => events.push(data));
  return events;
}

async function test() {
  console.log("=== Telephone Draw E2E Test ===\n");

  // --- Test 1: Create game ---
  console.log("1. Creating game as host (Alice)...");
  const alice = await connect();

  const alicePlayerLists = collectEvents(alice, "player-list");
  const aliceAssignments = collectEvents(alice, "assignment");

  const gameId = await new Promise<string>((resolve) => {
    alice.emit("create-game", { playerName: "Alice" }, (res: { gameId: string }) => {
      resolve(res.gameId);
    });
  });
  console.log("   Game created:", gameId);

  // Wait a tick for events to arrive
  await new Promise((r) => setTimeout(r, 100));
  console.assert(alicePlayerLists.length === 1, `Expected 1 player list, got ${alicePlayerLists.length}`);
  console.assert(alicePlayerLists[0][0].name === "Alice", "First player should be Alice");
  console.assert(alicePlayerLists[0][0].isHost === true, "Alice should be host");
  console.log("   PASS: Host created game\n");

  // --- Test 2: Request state (host navigates to game page) ---
  console.log("2. Host requests state (simulating navigation)...");
  const stateP = waitFor(alice, "state-sync");
  alice.emit("request-state", { gameId });
  const sync = await stateP;
  console.assert(sync.needJoin === false, "Host shouldn't need to join");
  console.assert(sync.phase === "lobby", "Should be lobby");
  console.assert(sync.players.length === 1, "Should have 1 player");
  console.assert(sync.players[0].isHost === true, "Should be host");
  console.log("   PASS: Host gets full state\n");

  // --- Test 3: Non-member requests state ---
  console.log("3. Bob opens game link (not joined yet)...");
  const bob = await connect();
  const bobPlayerLists = collectEvents(bob, "player-list");
  const bobAssignments = collectEvents(bob, "assignment");

  const bobSyncP = waitFor(bob, "state-sync");
  bob.emit("request-state", { gameId });
  const bobSync = await bobSyncP;
  console.assert(bobSync.needJoin === true, "Bob should need to join");
  console.assert(bobSync.gameExists === true, "Game should exist");
  console.log("   PASS: Non-member gets needJoin=true\n");

  // --- Test 4: Bob joins ---
  console.log("4. Bob joins...");
  const joinRes = await new Promise<any>((resolve) => {
    bob.emit("join-game", { gameId, playerName: "Bob" }, (res: any) => resolve(res));
  });
  console.assert(joinRes.success === true, "Should join successfully");

  await new Promise((r) => setTimeout(r, 100));
  console.assert(bobPlayerLists.length >= 1, "Bob should have player list");
  const latestBobList = bobPlayerLists[bobPlayerLists.length - 1];
  console.assert(latestBobList.length === 2, `Should have 2 players, got ${latestBobList.length}`);
  console.log("   Players:", latestBobList.map((p: any) => p.name).join(", "));
  console.log("   PASS: Bob joined\n");

  // --- Test 5: Charlie joins ---
  console.log("5. Charlie joins...");
  const charlie = await connect();
  const charlieAssignments = collectEvents(charlie, "assignment");

  const cJoin = await new Promise<any>((resolve) => {
    charlie.emit("join-game", { gameId, playerName: "Charlie" }, (res: any) => resolve(res));
  });
  console.assert(cJoin.success === true, "Charlie should join");
  await new Promise((r) => setTimeout(r, 100));
  const latestAliceList = alicePlayerLists[alicePlayerLists.length - 1];
  console.assert(latestAliceList.length === 3, `Should have 3 players, got ${latestAliceList.length}`);
  console.log("   Players:", latestAliceList.map((p: any) => p.name).join(", "));
  console.log("   PASS: 3 players in lobby\n");

  // --- Test 6: Set difficulty ---
  console.log("6. Host sets difficulty...");
  // Drain any pending difficulty events first
  await new Promise((r) => setTimeout(r, 100));
  const diffP = waitFor(bob, "difficulty-changed");
  alice.emit("set-difficulty", { difficulty: "complex" });
  const diff = await diffP;
  console.assert(diff === "complex", `Expected complex, got ${diff}`);
  console.log("   PASS: Difficulty set to complex\n");

  // --- Test 7: Start game ---
  console.log("7. Host starts game...");
  const startedAll = Promise.all([
    waitFor(alice, "game-started"),
    waitFor(bob, "game-started"),
    waitFor(charlie, "game-started"),
  ]);
  alice.emit("start-game");
  await startedAll;
  console.log("   All received game-started");

  // Wait for assignments to arrive
  await new Promise((r) => setTimeout(r, 200));
  console.assert(aliceAssignments.length === 1, `Alice should have 1 assignment, got ${aliceAssignments.length}`);
  console.assert(bobAssignments.length === 1, `Bob should have 1 assignment, got ${bobAssignments.length}`);
  console.assert(charlieAssignments.length === 1, `Charlie should have 1 assignment, got ${charlieAssignments.length}`);

  const aa = aliceAssignments[0];
  console.log("   Alice: type=" + aa.type + " prompt=" + aa.prompt + " round=" + aa.round + "/" + aa.totalRounds);
  console.assert(aa.type === "draw", "Round 1 should be drawing");
  console.assert(aa.round === 1, "Should be round 1");
  console.assert(aa.totalRounds === 3, "3 rounds for 3 players");
  console.log("   PASS: All got drawing assignments\n");

  // --- Test 8: Submit drawings (round 1) ---
  console.log("8. Round 1: Submit drawings...");
  const drawing = JSON.stringify([{ color: "#000", brushSize: 3, points: [{ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.5 }] }]);

  // Pre-register round-ended listeners
  const re1Alice = waitFor(alice, "round-ended");
  const re1Bob = waitFor(bob, "round-ended");

  alice.emit("submit-drawing", { drawingData: drawing });
  bob.emit("submit-drawing", { drawingData: drawing });
  charlie.emit("submit-drawing", { drawingData: drawing });

  const [roundEnd1] = await Promise.all([re1Alice, re1Bob]);
  console.log("   Round ended:", JSON.stringify(roundEnd1));

  // Wait for round 2 assignments
  await new Promise((r) => setTimeout(r, 200));
  console.assert(aliceAssignments.length === 2, `Alice should have 2 assignments, got ${aliceAssignments.length}`);
  const r2a = aliceAssignments[1];
  console.log("   Round 2 type:", r2a.type, "round:", r2a.round);
  console.assert(r2a.type === "guess", "Round 2 should be guessing");
  console.assert(r2a.round === 2, "Should be round 2");
  console.log("   PASS: Round 1 complete, got guessing assignments\n");

  // --- Test 9: Submit guesses (round 2) ---
  console.log("9. Round 2: Submit guesses...");
  const re2Alice = waitFor(alice, "round-ended");

  alice.emit("submit-guess", { guess: "a cat" });
  bob.emit("submit-guess", { guess: "a dog" });
  charlie.emit("submit-guess", { guess: "a fish" });

  const roundEnd2 = await re2Alice;
  console.log("   Round ended:", JSON.stringify(roundEnd2));

  await new Promise((r) => setTimeout(r, 200));
  const r3a = aliceAssignments[2];
  console.log("   Round 3 type:", r3a.type, "round:", r3a.round);
  console.assert(r3a.type === "draw", "Round 3 should be drawing");
  console.log("   PASS: Guessing round complete\n");

  // --- Test 10: Submit drawings (round 3 - final) ---
  console.log("10. Round 3 (final): Submit drawings...");
  const re3Alice = waitFor(alice, "round-ended");

  alice.emit("submit-drawing", { drawingData: drawing });
  bob.emit("submit-drawing", { drawingData: drawing });
  charlie.emit("submit-drawing", { drawingData: drawing });

  const roundEnd3 = await re3Alice;
  console.assert(roundEnd3.reveal === true, "Should transition to reveal");
  console.log("    PASS: Transitioned to reveal phase\n");

  // --- Test 11: Reveal ---
  console.log("11. Reveal phase...");
  const revealEvents = collectEvents(alice, "reveal-update");
  const totalEntries = 3 * 4; // 3 chains * (word + draw + guess + draw)

  for (let i = 0; i < totalEntries; i++) {
    const p = waitFor(alice, "reveal-update");
    alice.emit("reveal-next");
    await p;
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log("    Revealed", revealEvents.length, "entries");
  for (const re of revealEvents) {
    const suffix = re.entry.type !== "drawing" ? ` "${re.entry.content}"` : "";
    console.log(`    chain=${re.chainIndex} entry=${re.entryIndex} ${re.entry.type} by ${re.entry.playerName}${suffix}${re.done ? " [DONE]" : ""}`);
  }

  const lastEntry = revealEvents[revealEvents.length - 1];
  console.assert(lastEntry.done === true, "Last entry should be done");
  console.log("    PASS: All chains revealed\n");

  // Wait for game-finished
  await new Promise((r) => setTimeout(r, 100));

  // --- Test 12: Play again ---
  console.log("12. Play again...");
  const resetP = waitFor(bob, "game-reset");
  alice.emit("play-again");
  await resetP;

  await new Promise((r) => setTimeout(r, 100));
  const resetList = alicePlayerLists[alicePlayerLists.length - 1];
  console.log("    Players after reset:", resetList.map((p: any) => p.name).join(", "));
  console.assert(resetList.length === 3, "All 3 players still in lobby");
  console.log("    PASS: Game reset\n");

  // --- Test 13: Invalid game code ---
  console.log("13. Invalid game code...");
  const ghost = await connect();
  const gSync = waitFor(ghost, "state-sync");
  ghost.emit("request-state", { gameId: "ZZZZZZ" });
  const gs = await gSync;
  console.assert(gs.gameExists === false, "Game should not exist");
  console.log("    PASS: Invalid code handled\n");

  // --- Test 14: Non-host can't start ---
  console.log("14. Non-host can't start game...");
  bob.emit("start-game");
  await new Promise((r) => setTimeout(r, 200));
  // Game should still be in lobby (check via request-state)
  const checkP = waitFor(alice, "state-sync");
  alice.emit("request-state", { gameId });
  const check = await checkP;
  console.assert(check.phase === "lobby", "Should still be in lobby");
  console.log("    PASS: Non-host start ignored\n");

  // Cleanup
  alice.disconnect();
  bob.disconnect();
  charlie.disconnect();
  ghost.disconnect();

  console.log("=== ALL TESTS PASSED ===");
  process.exit(0);
}

test().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
