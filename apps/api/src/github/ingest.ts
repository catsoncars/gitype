import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { IngestionService } from './ingestion.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  const ingestion = app.get(IngestionService);
  await ingestion.run();
  await app.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
