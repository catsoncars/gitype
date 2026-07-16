import { Module } from '@nestjs/common';
import { GithubClientService } from './github-client.service';
import { IngestionService } from './ingestion.service';

@Module({
  providers: [GithubClientService, IngestionService],
  exports: [IngestionService],
})
export class GithubModule {}
