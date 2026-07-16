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
export interface ErrorLocation {
    index: number;
    expected: string;
    typed: string;
}
export interface KeyStat {
    key: string;
    hits: number;
    misses: number;
}
export interface SubmitSessionDto {
    snippetId: string;
    language: string;
    startedAt: string;
    completedAt: string;
    durationMs: number;
    wpm: number;
    rawWpm: number;
    cpm: number;
    accuracy: number;
    consistency: number;
    totalChars: number;
    correctChars: number;
    incorrectChars: number;
    errorLocations: ErrorLocation[];
    keyStats: KeyStat[];
}
export interface SessionResultDto extends SubmitSessionDto {
    id: string;
    createdAt: string;
}
export interface LanguageStats {
    language: string;
    runs: number;
    avgWpm: number;
    avgAccuracy: number;
    bestWpm: number;
}
export interface KeyDifficulty {
    key: string;
    totalHits: number;
    totalMisses: number;
    errorRate: number;
}
