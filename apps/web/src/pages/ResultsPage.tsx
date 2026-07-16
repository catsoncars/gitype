import { Link, useLocation } from 'react-router';
import type { SnippetDto } from '@gitype/shared';
import type { TypingResult } from '../features/typing/scoring';
import './ResultsPage.css';

interface ResultsState {
  result: TypingResult;
  snippet: SnippetDto;
}

export function ResultsPage() {
  const location = useLocation();
  const state = location.state as ResultsState | null;

  if (!state) {
    return (
      <section className="results">
        <h1>Results</h1>
        <div className="card results-empty">
          <p>No completed run to show yet.</p>
        </div>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </section>
    );
  }

  const { result, snippet } = state;

  return (
    <section className="results">
      <h1>Results</h1>
      <div className="results-grid">
        <div className="card results-stat">
          <strong>{Math.round(result.wpm)}</strong>
          <span>wpm</span>
        </div>
        <div className="card results-stat">
          <strong>{Math.round(result.accuracy)}%</strong>
          <span>accuracy</span>
        </div>
        <div className="card results-stat">
          <strong>{Math.round(result.consistency)}%</strong>
          <span>consistency</span>
        </div>
        <div className="card results-stat">
          <strong>{Math.round(result.rawWpm)}</strong>
          <span>raw wpm</span>
        </div>
      </div>
      <div className="card results-source">
        <a href={snippet.sourceUrl} target="_blank" rel="noreferrer">
          {snippet.repoOwner}/{snippet.repoName} — {snippet.filePath}
        </a>
      </div>
      <Link to="/" className="btn btn-primary">
        Try another
      </Link>
    </section>
  );
}
