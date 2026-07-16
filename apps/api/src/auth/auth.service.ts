import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '../generated/prisma/client';

interface GithubTokenResponse {
  access_token?: string;
  error?: string;
}

interface GithubProfile {
  id: number;
  login: string;
  avatar_url: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  getAuthorizeUrl(): string {
    const params = new URLSearchParams({
      client_id: requireEnv('GITHUB_OAUTH_CLIENT_ID'),
      redirect_uri: `${apiUrl()}/auth/github/callback`,
      scope: 'read:user',
    });
    return `https://github.com/login/oauth/authorize?${params}`;
  }

  async handleCallback(code: string): Promise<string> {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: requireEnv('GITHUB_OAUTH_CLIENT_ID'),
        client_secret: requireEnv('GITHUB_OAUTH_CLIENT_SECRET'),
        code,
      }),
    });
    const tokenData = (await tokenRes.json()) as GithubTokenResponse;
    if (!tokenData.access_token) {
      throw new UnauthorizedException('GitHub OAuth exchange failed');
    }

    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'gitype-app',
      },
    });
    if (!profileRes.ok) {
      throw new UnauthorizedException('Failed to fetch GitHub profile');
    }
    const profile = (await profileRes.json()) as GithubProfile;

    const user = await this.prisma.user.upsert({
      where: { githubId: profile.id },
      create: { githubId: profile.id, username: profile.login, avatarUrl: profile.avatar_url },
      update: { username: profile.login, avatarUrl: profile.avatar_url },
    });

    return this.jwtService.signAsync({ sub: user.id });
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      return await this.prisma.user.findUnique({ where: { id: payload.sub } });
    } catch {
      return null;
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function apiUrl(): string {
  return process.env.API_URL ?? 'http://localhost:3000';
}
