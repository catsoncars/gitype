import { useEffect, useRef } from 'react';
import type { SnippetDto } from '@gitype/shared';
import { useTypingEngine } from './useTypingEngine';
import { TypingSnippet } from './TypingSnippet';
import type { TypingResult } from './scoring';
import './TypingSession.css';

interface TypingSessionProps {
  snippet: SnippetDto;
  onComplete: (result: TypingResult) => void;
}

export function TypingSession({ snippet, onComplete }: TypingSessionProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { typed, handleChange, stats } = useTypingEngine(snippet.content, onComplete);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Tab defaults to shifting focus in a textarea — intercept it and append a
  // literal tab character instead, since tab-indented source (e.g. gofmt'd Go)
  // needs to be typeable like any other character.
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (typed.length < snippet.content.length) {
        handleChange(typed + '\t');
      }
    }
  }

  return (
    <div className="typing-session" onClick={() => inputRef.current?.focus()}>
      <div className="typing-stats">
        <span className="stat-pill">{Math.round(stats.wpm)} wpm</span>
        <span className="stat-pill">{Math.round(stats.accuracy)}% accuracy</span>
      </div>
      <div className="card typing-card">
        <TypingSnippet target={snippet.content} typed={typed} />
      </div>
      <textarea
        ref={inputRef}
        className="typing-input"
        value={typed}
        maxLength={snippet.content.length}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}
