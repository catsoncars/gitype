import './TypingSnippet.css';

interface TypingSnippetProps {
  target: string;
  typed: string;
}

export function TypingSnippet({ target, typed }: TypingSnippetProps) {
  return (
    <pre className="typing-snippet">
      {target.split('').map((char, i) => {
        let className = 'pending';
        if (i < typed.length) {
          className = typed[i] === char ? 'correct' : 'incorrect';
        } else if (i === typed.length) {
          className = 'current';
        }
        return (
          <span key={i} className={className}>
            {char}
          </span>
        );
      })}
    </pre>
  );
}
