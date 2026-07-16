import { Controller, Get, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { KeyDifficulty, LanguageStats } from '@gitype/shared';
import type { User } from '../generated/prisma/client';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('languages')
  @UseGuards(OptionalAuthGuard)
  getLanguageStats(
    @Query('scope') scope: string | undefined,
    @CurrentUser() user?: User,
  ): Promise<LanguageStats[]> {
    return this.statsService.getLanguageStats(resolveUserId(scope, user));
  }

  @Get('keys')
  @UseGuards(OptionalAuthGuard)
  getKeyDifficulty(
    @Query('scope') scope: string | undefined,
    @Query('language') language: string | undefined,
    @CurrentUser() user?: User,
  ): Promise<KeyDifficulty[]> {
    return this.statsService.getKeyDifficulty(resolveUserId(scope, user), language);
  }
}

function resolveUserId(scope: string | undefined, user: User | undefined): string | undefined {
  if (scope !== 'mine') return undefined;
  if (!user) throw new UnauthorizedException('Sign in to view your personal stats');
  return user.id;
}
