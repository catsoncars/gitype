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

export async function fetchLanguageStats(): Promise<LanguageStats[]> {
  const res = await fetch(`${API_URL}/stats/languages`);
  if (!res.ok) {
    throw new Error(`Failed to fetch language stats (${res.status})`);
  }
  return res.json();
}

export async function fetchKeyDifficulty(language?: string): Promise<KeyDifficulty[]> {
  const search = language ? `?${new URLSearchParams({ language })}` : '';
  const res = await fetch(`${API_URL}/stats/keys${search}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch key difficulty (${res.status})`);
  }
  return res.json();
}
