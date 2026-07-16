import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.verifyToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }

    (req as Request & { user: typeof user }).user = user;
    return true;
  }
}

export function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}
