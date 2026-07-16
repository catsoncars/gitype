import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubClientService } from './github-client.service';
import { extractSnippet, scoreDifficulty } from './snippet-extractor.service';
import {
  isExcludedPath,
  languageForPath,
  MAX_BLOB_SIZE_BYTES,
} from './file-filters';
import seedRepos from './seed-repos.json';

interface SeedRepo {
  owner: string;
  name: string;
  language: string;
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubClientService,
  ) {}

  async run(): Promise<void> {
    for (const repo of seedRepos as SeedRepo[]) {
      await this.ingestRepo(repo.owner, repo.name);
    }
  }

  private async ingestRepo(owner: string, name: string): Promise<void> {
    this.logger.log(`Ingesting ${owner}/${name}`);
    const commitSha = await this.github.getDefaultBranchCommitSha(owner, name);
    const tree = await this.github.getTree(owner, name, commitSha);

    let stored = 0;
    for (const entry of tree) {
      if (isExcludedPath(entry.path)) continue;
      if (entry.size && entry.size > MAX_BLOB_SIZE_BYTES) continue;

      const language = languageForPath(entry.path);
      if (!language) continue;

      const content = await this.github.getBlobContent(owner, name, entry.sha);
      const snippet = extractSnippet(content, language);
      if (!snippet) continue;

      await this.prisma.snippet.upsert({
        where: {
          repoOwner_repoName_filePath_commitSha: {
            repoOwner: owner,
            repoName: name,
            filePath: entry.path,
            commitSha,
          },
        },
        create: {
          language,
          content: snippet,
          charCount: snippet.length,
          difficulty: scoreDifficulty(snippet),
          repoOwner: owner,
          repoName: name,
          filePath: entry.path,
          commitSha,
          sourceUrl: `https://github.com/${owner}/${name}/blob/${commitSha}/${entry.path}`,
        },
        update: {},
      });
      stored++;
    }
    this.logger.log(`Stored ${stored} snippets from ${owner}/${name}`);
  }
}
