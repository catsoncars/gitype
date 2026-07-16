import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '../generated/prisma/client';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User | undefined => {
  const req = ctx.switchToHttp().getRequest<Request & { user?: User }>();
  return req.user;
});
