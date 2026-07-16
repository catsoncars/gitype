import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { extractBearerToken } from './jwt-auth.guard';

/** Attaches req.user when a valid token is present, but never blocks the request — anonymous play stays anonymous. */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(req);
    if (token) {
      const user = await this.authService.verifyToken(token);
      if (user) {
        (req as Request & { user: typeof user }).user = user;
      }
    }
    return true;
  }
}
