import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GithubModule } from './github/github.module';
import { SnippetsModule } from './snippets/snippets.module';
import { SessionsModule } from './sessions/sessions.module';
import { StatsModule } from './stats/stats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, GithubModule, SnippetsModule, SessionsModule, StatsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
