import type {
  KeyDifficulty,
  LanguageStats,
  SessionResultDto,
  SnippetDto,
  SubmitSessionDto,
  UserProfileDto,
} from '@gitype/shared';
import { getToken } from './authToken';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface RandomSnippetParams {
  language: string;
  difficulty: string;
}

export async function fetchRandomSnippet(params: RandomSnippetParams): Promise<SnippetDto> {
  const search = new URLSearchParams({ language: params.language, difficulty: params.difficulty });
  const res = await fetch(`${API_URL}/snippets/random?${search}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch snippet (${res.status})`);
  }
  return res.json();
}

export async function submitSession(dto: SubmitSessionDto): Promise<SessionResultDto> {
  const token = getToken();
  const res = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit session (${res.status})`);
  }
  return res.json();
}

export function getGithubLoginUrl(): string {
  return `${API_URL}/auth/github`;
}

export async function fetchMe(): Promise<UserProfileDto> {
  const token = getToken();
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error('Not authenticated');
  }
  return res.json();
}

export type StatsScope = 'global' | 'mine';

export async function fetchLanguageStats(scope: StatsScope = 'global'): Promise<LanguageStats[]> {
  const token = getToken();
  const search = scope === 'mine' ? `?${new URLSearchParams({ scope })}` : '';
  const res = await fetch(`${API_URL}/stats/languages${search}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch language stats (${res.status})`);
  }
  return res.json();
}

export async function fetchKeyDifficulty(
  scope: StatsScope = 'global',
  language?: string,
): Promise<KeyDifficulty[]> {
  const token = getToken();
  const params = { ...(scope === 'mine' ? { scope } : {}), ...(language ? { language } : {}) };
  const search = Object.keys(params).length ? `?${new URLSearchParams(params)}` : '';
  const res = await fetch(`${API_URL}/stats/keys${search}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch key difficulty (${res.status})`);
  }
  return res.json();
}

export async function fetchRecentLanguages(): Promise<string[]> {
  const res = await fetch(`${API_URL}/stats/recent-languages`);
  if (!res.ok) {
    throw new Error(`Failed to fetch recent languages (${res.status})`);
  }
  return res.json();
}
