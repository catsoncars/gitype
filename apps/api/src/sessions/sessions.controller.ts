import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import type { SessionResultDto } from '@gitype/shared';
import type { User } from '../generated/prisma/client';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SessionsService } from './sessions.service';
import { SubmitSessionDto } from './dto/submit-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  submit(@Body() dto: SubmitSessionDto, @CurrentUser() user?: User): Promise<SessionResultDto> {
    return this.sessionsService.submit(dto, user?.id);
  }
}
