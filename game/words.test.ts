import { getRandomWords, simpleWords, complexWords } from "./words";

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

function runTests() {
  console.log("=== Word List & Randomness Tests ===\n");

  // --- Test 1: Pool sizes ---
  console.log("1. Word pool sizes");
  assert(simpleWords.length === 5000, `simpleWords has ${simpleWords.length} entries (expected 5000)`);
  assert(complexWords.length === 5000, `complexWords has ${complexWords.length} entries (expected 5000)`);

  // --- Test 2: No duplicates within each pool ---
  console.log("\n2. No duplicates within pools");
  const simpleSet = new Set(simpleWords);
  assert(simpleSet.size === simpleWords.length, `simpleWords has ${simpleWords.length - simpleSet.size} duplicates`);
  const complexSet = new Set(complexWords);
  assert(complexSet.size === complexWords.length, `complexWords has ${complexWords.length - complexSet.size} duplicates`);

  // --- Test 3: No empty strings ---
  console.log("\n3. No empty or whitespace-only strings");
  assert(simpleWords.every(w => w.trim().length > 0), "All simpleWords are non-empty");
  assert(complexWords.every(w => w.trim().length > 0), "All complexWords are non-empty");

  // --- Test 4: getRandomWords returns correct count ---
  console.log("\n4. getRandomWords returns correct count");
  assert(getRandomWords("simple", 5).length === 5, "Returns 5 simple words when asked for 5");
  assert(getRandomWords("complex", 10).length === 10, "Returns 10 complex words when asked for 10");
  assert(getRandomWords("simple", 1).length === 1, "Returns 1 word when asked for 1");

  // --- Test 5: No duplicates within a single call ---
  console.log("\n5. No duplicates within a single call");
  for (let i = 0; i < 20; i++) {
    const words = getRandomWords("simple", 50);
    const wordSet = new Set(words);
    assert(wordSet.size === words.length, `Simple call ${i + 1}: no duplicates in 50-word selection`);
  }
  for (let i = 0; i < 20; i++) {
    const words = getRandomWords("complex", 50);
    const wordSet = new Set(words);
    assert(wordSet.size === words.length, `Complex call ${i + 1}: no duplicates in 50-word selection`);
  }

  // --- Test 6: Consecutive calls produce different results ---
  console.log("\n6. Consecutive calls produce different results");
  const TRIALS = 100;
  let simpleDiffCount = 0;
  let complexDiffCount = 0;

  for (let i = 0; i < TRIALS; i++) {
    const a = getRandomWords("simple", 3);
    const b = getRandomWords("simple", 3);
    if (a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2]) simpleDiffCount++;
  }
  for (let i = 0; i < TRIALS; i++) {
    const a = getRandomWords("complex", 3);
    const b = getRandomWords("complex", 3);
    if (a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2]) complexDiffCount++;
  }

  // With 5000 words picking 3, probability of identical consecutive calls is astronomically low
  // We expect at least 95% of trials to produce different results
  assert(simpleDiffCount >= 95, `Simple: ${simpleDiffCount}/${TRIALS} consecutive calls differ (expect >=95)`);
  assert(complexDiffCount >= 95, `Complex: ${complexDiffCount}/${TRIALS} consecutive calls differ (expect >=95)`);

  // --- Test 7: First word varies across calls (not always same first pick) ---
  console.log("\n7. First word varies across many calls");
  const firstWords = new Set<string>();
  for (let i = 0; i < 200; i++) {
    firstWords.add(getRandomWords("simple", 1)[0]);
  }
  // With 5000 words and 200 draws, we should see many unique first picks
  assert(firstWords.size >= 100, `Got ${firstWords.size} unique first words in 200 calls (expect >=100)`);

  const firstComplex = new Set<string>();
  for (let i = 0; i < 200; i++) {
    firstComplex.add(getRandomWords("complex", 1)[0]);
  }
  assert(firstComplex.size >= 100, `Got ${firstComplex.size} unique first complex words in 200 calls (expect >=100)`);

  // --- Test 8: Distribution uniformity check ---
  console.log("\n8. Distribution uniformity (chi-squared approximation)");
  // Pick from a smaller subset to make statistical testing feasible
  // Count how often each of first 100 words appears as position 0 in 10000 draws
  const DRAWS = 10000;
  const BUCKET_SIZE = 100; // check first 100 words
  const counts = new Map<string, number>();
  for (const w of simpleWords.slice(0, BUCKET_SIZE)) counts.set(w, 0);

  for (let i = 0; i < DRAWS; i++) {
    const word = getRandomWords("simple", 1)[0];
    if (counts.has(word)) counts.set(word, counts.get(word)! + 1);
  }

  // Expected count per word ≈ DRAWS / total_pool_size * 1 (for each word showing up first)
  // With 5000 words and 10000 draws, expected = 10000/5000 = 2 per word
  // But we're only checking 100 of them, so total hits ≈ 100 * 2 = 200
  const totalHits = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  const expectedPerWord = DRAWS / simpleWords.length;
  const maxDeviation = Math.max(...Array.from(counts.values()).map(c => Math.abs(c - expectedPerWord)));
  // With expected ~2 per word, allow large relative deviation but absolute should be reasonable
  assert(maxDeviation < expectedPerWord * 10, `Max deviation from expected: ${maxDeviation.toFixed(1)} (expected ~${expectedPerWord.toFixed(1)} per word)`);
  console.log(`  Info: ${totalHits} hits out of ${DRAWS} draws landed on first 100 words (expected ~${(BUCKET_SIZE * expectedPerWord).toFixed(0)})`);

  // --- Test 9: Simulate multiple game sessions ---
  console.log("\n9. Multiple game sessions produce different word sets");
  const gameSessions = 50;
  const playersPerGame = 6;
  const sessionWords: string[][] = [];

  for (let i = 0; i < gameSessions; i++) {
    sessionWords.push(getRandomWords("simple", playersPerGame));
  }

  // Count how many unique word-sets we get
  const uniqueSessions = new Set(sessionWords.map(w => w.join("|")));
  assert(uniqueSessions.size === gameSessions, `${uniqueSessions.size}/${gameSessions} sessions had unique word sets`);

  // Same for complex
  const complexSessions: string[][] = [];
  for (let i = 0; i < gameSessions; i++) {
    complexSessions.push(getRandomWords("complex", playersPerGame));
  }
  const uniqueComplexSessions = new Set(complexSessions.map(w => w.join("|")));
  assert(uniqueComplexSessions.size === gameSessions, `${uniqueComplexSessions.size}/${gameSessions} complex sessions had unique word sets`);

  // --- Summary ---
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
