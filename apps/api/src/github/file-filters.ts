// Maps a file extension to the canonical lowercase language slug stored on
// `Snippet.language`. Deliberately static (not GitHub's linguist detection)
// so the value is always exactly what we expect, never an alias/casing variant.
const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.py': 'python',
  '.rs': 'rust',
  '.go': 'go',
  '.java': 'java',
  '.rb': 'ruby',
  '.php': 'php',
  '.c': 'c',
  '.h': 'c',
  '.cpp': 'cpp',
  '.hpp': 'cpp',
  '.cs': 'csharp',
  '.swift': 'swift',
  '.kt': 'kotlin',
};

// Paths that are never worth ingesting, checked before spending an API call
// on the file's content.
const EXCLUDED_PATH_PATTERNS: RegExp[] = [
  /node_modules\//,
  /(^|\/)dist\//,
  /(^|\/)build\//,
  /(^|\/)vendor\//,
  /\.min\.[jt]s$/,
  /(^|\/)package-lock\.json$/,
  /(^|\/)pnpm-lock\.yaml$/,
  /(^|\/)yarn\.lock$/,
  /(^|\/)__snapshots__\//,
  /(^|\/)migrations?\//,
  /\.g\.[jt]s$/,
];

// Above this, a file is never going to yield an in-bounds snippet — skip the
// blob fetch entirely rather than paying for it and then rejecting.
export const MAX_BLOB_SIZE_BYTES = 50_000;

export function languageForPath(path: string): string | null {
  const dot = path.lastIndexOf('.');
  if (dot === -1) return null;
  return EXTENSION_TO_LANGUAGE[path.slice(dot).toLowerCase()] ?? null;
}

export function isExcludedPath(path: string): boolean {
  return EXCLUDED_PATH_PATTERNS.some((pattern) => pattern.test(path));
}
