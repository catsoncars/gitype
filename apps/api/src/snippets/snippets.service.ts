import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Difficulty, SnippetDto } from '@gitype/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../generated/prisma/client';

const VALID_DIFFICULTIES = new Set(['EASY', 'MEDIUM', 'HARD']);

const SNIPPET_DTO_SELECT = {
  id: true,
  language: true,
  content: true,
  charCount: true,
  difficulty: true,
  repoOwner: true,
  repoName: true,
  filePath: true,
  commitSha: true,
  sourceUrl: true,
} as const;

export interface RandomSnippetFilters {
  language?: string;
  difficulty?: string;
}

@Injectable()
export class SnippetsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRandom(filters: RandomSnippetFilters): Promise<SnippetDto> {
    if (filters.difficulty && !VALID_DIFFICULTIES.has(filters.difficulty)) {
      throw new BadRequestException(`Unknown difficulty: ${filters.difficulty}`);
    }

    const where: Prisma.SnippetWhereInput = { disabled: false };
    if (filters.language) where.language = filters.language;
    if (filters.difficulty) where.difficulty = filters.difficulty as Difficulty;

    const count = await this.prisma.snippet.count({ where });
    if (count === 0) {
      throw new NotFoundException('No snippets match the given filters');
    }

    const skip = Math.floor(Math.random() * count);
    const snippet = await this.prisma.snippet.findFirst({
      where,
      orderBy: { id: 'asc' },
      skip,
      select: SNIPPET_DTO_SELECT,
    });
    if (!snippet) {
      throw new NotFoundException('No snippets match the given filters');
    }

    return snippet;
  }
}
