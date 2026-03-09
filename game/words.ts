export const simpleWords = [
  "cat", "dog", "sun", "moon", "tree", "house", "car", "fish", "bird", "flower",
  "hat", "shoe", "book", "ball", "star", "rain", "snow", "fire", "cake", "boat",
  "apple", "banana", "pizza", "horse", "snake", "cloud", "heart", "crown", "ghost",
  "robot", "piano", "clock", "chair", "table", "lamp", "door", "key", "ring",
  "drum", "flag", "gift", "ice cream", "rainbow", "rocket", "spider", "turtle",
  "umbrella", "volcano", "whale", "mountain", "bridge", "castle", "dragon",
  "elephant", "giraffe", "lighthouse", "mermaid", "penguin", "pirate", "snowman",
];

export const complexWords = [
  "astronaut riding a horse", "dancing in the rain", "sleepwalking",
  "time travel", "alien invasion", "haunted house", "underwater city",
  "flying carpet", "invisible man", "treasure map", "zombie apocalypse",
  "black hole", "parallel universe", "enchanted forest", "robot uprising",
  "dream within a dream", "message in a bottle", "lost in space",
  "walking on sunshine", "catching lightning", "brain freeze",
  "cloud surfing", "disco inferno", "fortune cookie", "gravity boots",
  "hot potato", "ice skating on thin ice", "juggling chainsaws",
  "karaoke night", "lava surfing", "midnight snack attack",
  "ninja cat", "octopus handshake", "pillow fight", "quicksand",
  "roller coaster of emotions", "sneezing glitter", "tornado chaser",
  "unicorn stampede", "velociraptor in a tutu",
];

export function getRandomWords(difficulty: "simple" | "complex", count: number): string[] {
  const pool = difficulty === "simple" ? simpleWords : complexWords;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
