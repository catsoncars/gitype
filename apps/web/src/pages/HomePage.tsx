import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Difficulty } from '@gitype/shared';
import './HomePage.css';

const LANGUAGES = ['javascript', 'python', 'rust', 'go'];
const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

export function HomePage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');

  function handleStart() {
    navigate(`/type?language=${language}&difficulty=${difficulty}`);
  }

  return (
    <section className="picker">
      <div className="picker-intro">
        <h1>Type real code</h1>
        <p>Practice typing snippets pulled straight from public GitHub repos.</p>
      </div>

      <div className="card picker-card">
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

        <button type="button" className="btn btn-primary start-button" onClick={handleStart}>
          Start typing
        </button>
      </div>
    </section>
  );
}
