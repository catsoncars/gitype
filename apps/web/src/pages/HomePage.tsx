import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Difficulty, LanguageStats } from '@gitype/shared';
import { fetchLanguageStats, fetchRecentLanguages } from '../lib/api';
import './HomePage.css';

const LANGUAGES = ['javascript', 'python', 'rust', 'go'];
const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

const BOOT_LINES = [
  'pulling real code from public github repos',
  'tracking wpm, accuracy, and consistency live',
  'ranking your hardest keys across every run',
  'sign in with github to save your history',
];

const TYPE_MS = 28;
const DELETE_MS = 16;
const HOLD_MS = 1700;

/** Types out each line, holds, deletes it, then moves to the next — loops forever. */
function useTypewriterLines(lines: string[]): string {
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (lines.length === 0) return;
    const line = lines[lineIndex % lines.length];

    if (!deleting) {
      if (charCount < line.length) {
        const t = setTimeout(() => setCharCount((c) => c + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (charCount > 0) {
      const t = setTimeout(() => setCharCount((c) => c - 1), DELETE_MS);
      return () => clearTimeout(t);
    }

    setDeleting(false);
    setLineIndex((i) => (i + 1) % lines.length);
  }, [charCount, deleting, lineIndex, lines]);

  const line = lines[lineIndex % lines.length] ?? '';
  return line.slice(0, charCount);
}

export function HomePage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [languageStats, setLanguageStats] = useState<LanguageStats[] | null>(null);
  const [recentLanguages, setRecentLanguages] = useState<string[] | null>(null);

  useEffect(() => {
    fetchLanguageStats('global')
      .then(setLanguageStats)
      .catch(() => setLanguageStats([]));
    fetchRecentLanguages()
      .then(setRecentLanguages)
      .catch(() => setRecentLanguages([]));
  }, []);

  const totals = useMemo(() => {
    if (!languageStats || languageStats.length === 0) return null;
    return {
      totalRuns: languageStats.reduce((sum, l) => sum + l.runs, 0),
      bestWpm: Math.max(...languageStats.map((l) => l.bestWpm)),
      languageCount: languageStats.length,
    };
  }, [languageStats]);

  const objectiveLines = useMemo(() => {
    const lines = [...BOOT_LINES];
    if (recentLanguages && recentLanguages.length > 0) {
      lines.push(`recently typed: ${recentLanguages.join(', ')}`);
    }
    return lines;
  }, [recentLanguages]);

  const typedObjective = useTypewriterLines(objectiveLines);

  function handleStart() {
    navigate(`/type?language=${language}&difficulty=${difficulty}`);
  }

  return (
    <section className="picker">
      <div className="picker-intro">
        <h1>Gitype</h1>
        <p>Type real code, pulled straight from public GitHub repos.</p>
      </div>

      <div className="status-widget">
        <span className="status-dot" aria-hidden="true" />
        <span className="status-text">{typedObjective}</span>
      </div>

      {totals && (
        <div className="typing-stats home-stats">
          <span className="stat-pill">{totals.totalRuns} runs</span>
          <span className="stat-pill">{Math.round(totals.bestWpm)} best wpm</span>
          <span className="stat-pill">{totals.languageCount} languages</span>
        </div>
      )}

      <div className="card picker-card">
        <div className="picker-fields">
          <label className="field-label">
            Language
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="button" className="btn btn-primary start-button" onClick={handleStart}>
          Start typing
        </button>
      </div>
    </section>
  );
}
