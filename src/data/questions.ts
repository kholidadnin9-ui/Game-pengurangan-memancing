export type Question = {
  a: number;
  b: number;
  answer: number;
  options: number[];
};

type LevelConfig = {
  minA: number;
  maxA: number;
  minB: number;
  forceBorrow?: boolean;
  twoDigitB?: boolean;
};

// 5 levels with increasing difficulty
const LEVELS: LevelConfig[] = [
  { minA: 2, maxA: 10, minB: 1 }, // Level 1: pengurangan dalam 10
  { minA: 10, maxA: 20, minB: 1 }, // Level 2: pengurangan dalam 20
  { minA: 11, maxA: 20, minB: 2, forceBorrow: true }, // Level 3: dengan pinjam (menyingsingkan)
  { minA: 20, maxA: 50, minB: 2 }, // Level 4: pengurangan dalam 50
  { minA: 45, maxA: 99, minB: 8, twoDigitB: true }, // Level 5: pengurangan dalam 100
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(answer: number, level: number): number[] {
  const opts = new Set<number>([answer]);
  const deltas =
    level >= 4 ? [1, 2, 10, 5, -1, -2, 3] : [1, 2, 3, -1, -2, 4];
  for (const d of deltas) {
    if (opts.size >= 3) break;
    const v = answer + d;
    if (v >= 0 && v !== answer) opts.add(v);
  }
  let extra = 1;
  while (opts.size < 3) {
    const v = answer + extra;
    if (!opts.has(v)) opts.add(v);
    extra++;
  }
  return shuffle([...opts]);
}

export function generateQuestion(level: number): Question {
  const cfg = LEVELS[Math.min(Math.max(level, 1), 5) - 1];
  let a: number;
  let b: number;
  let answer: number;

  if (cfg.forceBorrow) {
    // pastikan butuh "pinjam" (ones digit a < b)
    do {
      a = randInt(cfg.minA, cfg.maxA);
      b = randInt(cfg.minB, 9);
      answer = a - b;
    } while (!(a % 10 < b) || answer < 0);
  } else {
    do {
      a = randInt(cfg.minA, cfg.maxA);
      const maxB = Math.max(cfg.minB, a);
      b = randInt(cfg.minB, maxB);
      if (cfg.twoDigitB && b < 10) b = randInt(10, Math.max(10, maxB));
      if (b > a) b = Math.max(1, a - 1);
      answer = a - b;
    } while (answer < 0 || b < 1 || a === b);
  }

  return { a, b, answer, options: makeOptions(answer, level) };
}

export const LEVEL_COUNT = 5;
export const QUESTIONS_PER_LEVEL = 10;
export const QUESTION_TIME = 30;
