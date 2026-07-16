import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { UserProfileDto } from '@gitype/shared';
import type { User } from '../generated/prisma/client';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  redirectToGithub(@Res() res: Response) {
    res.redirect(this.authService.getAuthorizeUrl());
  }

  @Get('github/callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const token = await this.authService.handleCallback(code);
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User): UserProfileDto {
    return { id: user.id, username: user.username, avatarUrl: user.avatarUrl };
  }
}
