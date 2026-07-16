import type { ErrorLocation, KeyStat } from '@gitype/shared';

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
}

export interface TypingResult extends TypingStats {
  startedAt: number;
  completedAt: number;
  durationMs: number;
  totalChars: number;
  errorLocations: ErrorLocation[];
  keyStats: KeyStat[];
}

function countCorrect(target: string, typed: string): number {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++;
  }
  return correct;
}

function findErrorLocations(target: string, typed: string): ErrorLocation[] {
  const errors: ErrorLocation[] = [];
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== target[i]) {
      errors.push({ index: i, expected: target[i], typed: typed[i] });
    }
  }
  return errors;
}

// Tallied by the expected character (the key the player was supposed to
// press), not what they actually typed — that's what makes "difficult keys"
// meaningful across sessions.
function computeKeyStats(target: string, typed: string): KeyStat[] {
  const tally = new Map<string, { hits: number; misses: number }>();
  for (let i = 0; i < typed.length; i++) {
    const key = target[i];
    const entry = tally.get(key) ?? { hits: 0, misses: 0 };
    if (typed[i] === key) entry.hits++;
    else entry.misses++;
    tally.set(key, entry);
  }
  return Array.from(tally.entries()).map(([key, { hits, misses }]) => ({ key, hits, misses }));
}

// Coefficient-of-variation based: tight, even keystroke timing scores near
// 100; bursty/erratic timing pulls it down. Needs a few keystrokes to be
// meaningful, so short runs are treated as perfectly consistent.
//
// Uses 100 / (1 + cov) rather than a linear 100 * (1 - cov): real typing
// regularly has a handful of longer pauses (a symbol, a glance back at the
// snippet) that push cov above 1 on their own, and a linear formula clamps
// that straight to 0 — which is what "consistency always 0%" turned out to
// be. The asymptotic curve degrades gracefully instead of cliff-ing.
function computeConsistency(keystrokeTimes: number[]): number {
  if (keystrokeTimes.length < 3) return 100;

  const intervals: number[] = [];
  for (let i = 1; i < keystrokeTimes.length; i++) {
    intervals.push(keystrokeTimes[i] - keystrokeTimes[i - 1]);
  }

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (mean === 0) return 100;

  const variance = intervals.reduce((sum, v) => sum + (v - mean) ** 2, 0) / intervals.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;

  return 100 / (1 + coefficientOfVariation);
}

export function computeStats(
  target: string,
  typed: string,
  elapsedMs: number,
  keystrokeTimes: number[],
): TypingStats {
  const elapsedMinutes = Math.max(elapsedMs, 1) / 60_000;
  const correctChars = countCorrect(target, typed);
  const incorrectChars = typed.length - correctChars;

  return {
    wpm: correctChars / 5 / elapsedMinutes,
    rawWpm: typed.length / 5 / elapsedMinutes,
    cpm: correctChars / elapsedMinutes,
    accuracy: typed.length === 0 ? 100 : (correctChars / typed.length) * 100,
    consistency: computeConsistency(keystrokeTimes),
    correctChars,
    incorrectChars,
  };
}

export function buildResult(
  target: string,
  typed: string,
  startedAt: number,
  completedAt: number,
  keystrokeTimes: number[],
): TypingResult {
  const durationMs = completedAt - startedAt;
  return {
    ...computeStats(target, typed, durationMs, keystrokeTimes),
    startedAt,
    completedAt,
    durationMs,
    totalChars: typed.length,
    errorLocations: findErrorLocations(target, typed),
    keyStats: computeKeyStats(target, typed),
  };
}
