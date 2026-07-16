import { Controller, Get, Query } from '@nestjs/common';
import type { KeyDifficulty, LanguageStats } from '@gitype/shared';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('languages')
  getLanguageStats(): Promise<LanguageStats[]> {
    return this.statsService.getLanguageStats();
  }

  @Get('keys')
  getKeyDifficulty(@Query('language') language?: string): Promise<KeyDifficulty[]> {
    return this.statsService.getKeyDifficulty(language);
  }
}
