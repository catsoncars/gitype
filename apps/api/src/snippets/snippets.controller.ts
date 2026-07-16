import { Controller, Get, Query } from '@nestjs/common';
import type { SnippetDto } from '@gitype/shared';
import { SnippetsService } from './snippets.service';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Get('random')
  getRandom(
    @Query('language') language?: string,
    @Query('difficulty') difficulty?: string,
  ): Promise<SnippetDto> {
    return this.snippetsService.getRandom({ language, difficulty });
  }
}
