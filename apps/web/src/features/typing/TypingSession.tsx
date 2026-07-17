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

  // Tab defaults to shifting focus in a textarea — intercept it. If the
  // snippet indents with a literal tab (e.g. gofmt'd Go), type that one
  // character; if it indents with spaces (the common case), fill in the
  // whole run of spaces at once, like an editor's indent key would.
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab') return;
    e.preventDefault();

    const next = snippet.content[typed.length];
    if (next === '\t') {
      handleChange(typed + '\t');
      return;
    }
    if (next === ' ') {
      let end = typed.length;
      while (end < snippet.content.length && snippet.content[end] === ' ') end++;
      handleChange(snippet.content.slice(0, end));
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
