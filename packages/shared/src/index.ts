// The API contract shared by the NestJS backend and the React frontend.
// Keep this framework-free: no Prisma imports, no React imports — just
// the shapes that travel over the wire, so both sides can't disagree.

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SnippetDto {
  id: string;
  language: string;
  content: string;
  charCount: number;
  difficulty: Difficulty;
  repoOwner: string;
  repoName: string;
  filePath: string;
  commitSha: string;
  sourceUrl: string;
}

/** A single mistyped position, captured during a run. */
export interface ErrorLocation {
  index: number; // character position in the snippet
  expected: string;
  typed: string;
}

/** Per-key tally for a run. */
export interface KeyStat {
  key: string;
  hits: number;
  misses: number;
}

/** What the client POSTs when a run finishes. */
export interface SubmitSessionDto {
  snippetId: string;
  language: string;
  startedAt: string; // ISO 8601
  completedAt: string; // ISO 8601
  durationMs: number;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number; // 0–100
  consistency: number; // 0–100
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  errorLocations: ErrorLocation[];
  keyStats: KeyStat[];
}

/** The saved run the API returns back. */
export interface SessionResultDto extends SubmitSessionDto {
  id: string;
  createdAt: string;
}

/** Aggregate view for a dashboard, per language. */
export interface LanguageStats {
  language: string;
  runs: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
}

/** Difficult keys rolled up across many sessions. */
export interface KeyDifficulty {
  key: string;
  totalHits: number;
  totalMisses: number;
  errorRate: number; // misses / (hits + misses)
}

/** The signed-in user's public profile, as returned by GET /auth/me. */
export interface UserProfileDto {
  id: string;
  username: string;
  avatarUrl: string | null;
}
