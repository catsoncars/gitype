# Gitype — setup

The repo skeleton, the Prisma data model, and the shared types are already
here. These steps generate the two app scaffolds (NestJS + Vite) with their
correct, version-matched boilerplate, then wire everything together.

## Prerequisites

- Node 20+
- pnpm 9+ &nbsp;(`npm i -g pnpm`)
- PostgreSQL 15+ running locally, or Docker

## 1. Install the CLIs

```bash
pnpm add -g @nestjs/cli
```

## 2. Scaffold the backend (NestJS)

From the repo root:

```bash
cd apps
nest new api --skip-git --package-manager pnpm
cd ..
```

`nest new` drops a full project into `apps/api`. It won't overwrite the
`prisma/` folder that's already there.

## 3. Scaffold the frontend (Vite + React + TS)

```bash
pnpm create vite apps/web --template react-ts
```

## 4. Wire the shared types

In both `apps/api/tsconfig.json` and `apps/web/tsconfig.json`, extend the base
config and keep the path alias so both can `import { SnippetDto } from "@gitype/shared"`:

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // apps/api uses CommonJS/NodeNext; apps/web uses the Vite/bundler
    // resolution its scaffold already set — leave those app-specific
    // settings as generated, they just add "paths" from the base.
  }
}
```

For Vite, also add the alias to `apps/web/vite.config.ts`:

```ts
resolve: {
  alias: { "@gitype/shared": path.resolve(__dirname, "../../packages/shared/src") }
}
```

## 5. Add Prisma + Octokit to the backend

```bash
cd apps/api
pnpm add @prisma/client @octokit/rest dotenv @prisma/adapter-pg pg
pnpm add -D prisma @types/pg
```

Create `apps/api/.env` with your database URL:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/codetype?schema=public"
GITHUB_TOKEN="ghp_your_token_here"   # a fine-grained PAT, read-only public repo access
```

> The token stays server-side only — it never reaches the browser. That's the
> whole point of routing GitHub through the backend.

Prisma 7 moved the connection URL out of `schema.prisma` and into a
`prisma.config.ts` (already set up in this repo), and `PrismaClient` now needs
an explicit driver adapter instead of reading `DATABASE_URL` on its own — see
`apps/api/src/prisma/prisma.service.ts`. `main.ts` loads `dotenv/config` first
so `process.env.DATABASE_URL` is populated before Nest boots.

Then run the first migration:

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
cd ../..
```

`prisma generate` writes the client to `apps/api/src/generated/prisma`
(gitignored) — import it from `../generated/prisma/client`, not from
`@prisma/client` directly.

## 6. Run it

Add a `dev` script to each app so the root `pnpm dev` can start both:

- `apps/api/package.json` → `"dev": "nest start --watch"`
- `apps/web/package.json` already has `"dev": "vite"`

Then from the root:

```bash
pnpm install
pnpm dev
```

## What's next

The natural build order from here:

1. **GitHub module** in the API — fetch a file via Octokit, filter it
   (skip generated files, secrets, overlong functions), store a `Snippet`.
2. **Typing engine** on the frontend — render a snippet, capture keystrokes,
   compute WPM / accuracy / consistency live.
3. **Session submission** — POST the finished run, persist it, show results.
4. **Analytics** — per-language stats and difficult-keys, read off `Session`
   and `SessionKeyStat`.
5. **GitHub OAuth** (phase two) — accounts, cross-device history, leaderboards.
