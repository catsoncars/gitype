import { Injectable, NotFoundException } from '@nestjs/common';
import type { SessionResultDto } from '@gitype/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../generated/prisma/client';
import { SubmitSessionDto } from './dto/submit-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: SubmitSessionDto, userId?: string): Promise<SessionResultDto> {
    const snippet = await this.prisma.snippet.findUnique({
      where: { id: dto.snippetId },
    });
    if (!snippet) {
      throw new NotFoundException(`Snippet ${dto.snippetId} not found`);
    }

    const session = await this.prisma.session.create({
      data: {
        snippetId: dto.snippetId,
        userId,
        language: dto.language,
        startedAt: new Date(dto.startedAt),
        completedAt: new Date(dto.completedAt),
        durationMs: dto.durationMs,
        wpm: dto.wpm,
        rawWpm: dto.rawWpm,
        cpm: dto.cpm,
        accuracy: dto.accuracy,
        consistency: dto.consistency,
        totalChars: dto.totalChars,
        correctChars: dto.correctChars,
        incorrectChars: dto.incorrectChars,
        errorLocations: dto.errorLocations as unknown as Prisma.InputJsonValue,
        keyStats: {
          create: dto.keyStats.map((k) => ({
            key: k.key,
            hits: k.hits,
            misses: k.misses,
          })),
        },
      },
      include: { keyStats: true },
    });

    return {
      id: session.id,
      snippetId: session.snippetId,
      language: session.language,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt.toISOString(),
      durationMs: session.durationMs,
      wpm: session.wpm,
      rawWpm: session.rawWpm,
      cpm: session.cpm,
      accuracy: session.accuracy,
      consistency: session.consistency,
      totalChars: session.totalChars,
      correctChars: session.correctChars,
      incorrectChars: session.incorrectChars,
      errorLocations:
        session.errorLocations as unknown as SessionResultDto['errorLocations'],
      keyStats: session.keyStats.map((k) => ({
        key: k.key,
        hits: k.hits,
        misses: k.misses,
      })),
      createdAt: session.createdAt.toISOString(),
    };
  }
}
