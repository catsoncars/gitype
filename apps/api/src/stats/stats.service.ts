import { Injectable } from '@nestjs/common';
import type { KeyDifficulty, LanguageStats } from '@gitype/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLanguageStats(userId?: string): Promise<LanguageStats[]> {
    const grouped = await this.prisma.session.groupBy({
      by: ['language'],
      where: userId ? { userId } : undefined,
      _count: { _all: true },
      _avg: { wpm: true, accuracy: true },
      _max: { wpm: true },
    });

    return grouped
      .map((g) => ({
        language: g.language,
        runs: g._count._all,
        avgWpm: g._avg.wpm ?? 0,
        avgAccuracy: g._avg.accuracy ?? 0,
        bestWpm: g._max.wpm ?? 0,
      }))
      .sort((a, b) => b.runs - a.runs);
  }

  async getKeyDifficulty(userId?: string, language?: string): Promise<KeyDifficulty[]> {
    const sessionFilter = { ...(userId ? { userId } : {}), ...(language ? { language } : {}) };
    const grouped = await this.prisma.sessionKeyStat.groupBy({
      by: ['key'],
      where: Object.keys(sessionFilter).length ? { session: sessionFilter } : undefined,
      _sum: { hits: true, misses: true },
    });

    return grouped
      .map((g) => {
        const totalHits = g._sum.hits ?? 0;
        const totalMisses = g._sum.misses ?? 0;
        const total = totalHits + totalMisses;
        return {
          key: g.key,
          totalHits,
          totalMisses,
          errorRate: total === 0 ? 0 : totalMisses / total,
        };
      })
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 20);
  }
}
