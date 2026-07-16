import { useMemo, useRef, useState } from 'react';
import { buildResult, computeStats, type TypingResult, type TypingStats } from './scoring';

export function useTypingEngine(target: string, onComplete: (result: TypingResult) => void) {
  const [typed, setTyped] = useState('');
  const startedAtRef = useRef<number | null>(null);
  const keystrokeTimesRef = useRef<number[]>([]);
  const completedRef = useRef(false);

  function handleChange(value: string) {
    if (completedRef.current || value.length > target.length) return;

    const now = Date.now();
    if (startedAtRef.current === null && value.length > 0) {
      startedAtRef.current = now;
    }
    if (value.length > typed.length) {
      keystrokeTimesRef.current.push(now);
    }
    setTyped(value);

    if (value.length === target.length) {
      completedRef.current = true;
      const startedAt = startedAtRef.current ?? now;
      onComplete(buildResult(target, value, startedAt, now, keystrokeTimesRef.current));
    }
  }

  const stats: TypingStats = useMemo(() => {
    const startedAt = startedAtRef.current;
    if (startedAt === null) {
      return {
        wpm: 0,
        rawWpm: 0,
        cpm: 0,
        accuracy: 100,
        consistency: 100,
        correctChars: 0,
        incorrectChars: 0,
      };
    }
    return computeStats(target, typed, Date.now() - startedAt, keystrokeTimesRef.current);
  }, [typed, target]);

  return { typed, handleChange, stats };
}
