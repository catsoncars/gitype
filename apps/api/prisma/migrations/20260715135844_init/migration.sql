-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "charCount" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "repoOwner" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "snippetId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "wpm" DOUBLE PRECISION NOT NULL,
    "rawWpm" DOUBLE PRECISION NOT NULL,
    "cpm" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "consistency" DOUBLE PRECISION NOT NULL,
    "totalChars" INTEGER NOT NULL,
    "correctChars" INTEGER NOT NULL,
    "incorrectChars" INTEGER NOT NULL,
    "errorLocations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionKeyStat" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "hits" INTEGER NOT NULL,
    "misses" INTEGER NOT NULL,

    CONSTRAINT "SessionKeyStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE INDEX "Snippet_language_difficulty_idx" ON "Snippet"("language", "difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "Snippet_repoOwner_repoName_filePath_commitSha_key" ON "Snippet"("repoOwner", "repoName", "filePath", "commitSha");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_snippetId_idx" ON "Session"("snippetId");

-- CreateIndex
CREATE INDEX "Session_language_idx" ON "Session"("language");

-- CreateIndex
CREATE INDEX "Session_createdAt_idx" ON "Session"("createdAt");

-- CreateIndex
CREATE INDEX "SessionKeyStat_key_idx" ON "SessionKeyStat"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SessionKeyStat_sessionId_key_key" ON "SessionKeyStat"("sessionId", "key");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "Snippet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionKeyStat" ADD CONSTRAINT "SessionKeyStat_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
