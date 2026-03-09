import { simpleWords } from "./simple-words";
import { complexWords } from "./complex-words";

export { simpleWords, complexWords };

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomWords(difficulty: "simple" | "complex", count: number): string[] {
  const pool = difficulty === "simple" ? simpleWords : complexWords;
  const shuffled = fisherYatesShuffle(pool);
  return shuffled.slice(0, count);
}
