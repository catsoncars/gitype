import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { SnippetDto, SubmitSessionDto } from '@gitype/shared';
import { fetchRandomSnippet, submitSession } from '../lib/api';
import { TypingSession } from '../features/typing/TypingSession';
import type { TypingResult } from '../features/typing/scoring';

export function TypingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const language = searchParams.get('language') ?? 'javascript';
  const difficulty = searchParams.get('difficulty') ?? 'MEDIUM';

  const [snippet, setSnippet] = useState<SnippetDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSnippet(null);
    setError(null);
    fetchRandomSnippet({ language, difficulty })
      .then(setSnippet)
      .catch((err: Error) => setError(err.message));
  }, [language, difficulty]);

  const handleComplete = useCallback(
    async (result: TypingResult) => {
      if (snippet) {
        const dto: SubmitSessionDto = {
          snippetId: snippet.id,
          language: snippet.language,
          startedAt: new Date(result.startedAt).toISOString(),
          completedAt: new Date(result.completedAt).toISOString(),
          durationMs: result.durationMs,
          wpm: result.wpm,
          rawWpm: result.rawWpm,
          cpm: result.cpm,
          accuracy: result.accuracy,
          consistency: result.consistency,
          totalChars: result.totalChars,
          correctChars: result.correctChars,
          incorrectChars: result.incorrectChars,
          errorLocations: result.errorLocations,
          keyStats: result.keyStats,
        };
        try {
          await submitSession(dto);
        } catch (err) {
          console.error('Failed to save session', err);
        }
      }
      navigate('/results', { state: { result, snippet } });
    },
    [navigate, snippet],
  );

  if (error) {
    return (
      <section className="page-status">
        <h1>Typing</h1>
        <div className="card page-status-card">
          <p>Couldn't load a snippet: {error}</p>
        </div>
      </section>
    );
  }

  if (!snippet) {
    return (
      <section className="page-status">
        <h1>Typing</h1>
        <div className="card page-status-card">
          <p>Loading a snippet…</p>
        </div>
      </section>
    );
  }

  return <TypingSession key={snippet.id} snippet={snippet} onComplete={handleComplete} />;
}
