# Gitype

A typing test, but the snippets are real code pulled from public GitHub repos instead of made-up sentences.

Pick a language and a difficulty, get handed an actual function or block from some open source project, and type it out. Tracks WPM, accuracy, and consistency as you go, and keeps a history so you can see which languages (and which keys) are giving you trouble.

Most typing tests use plain English, which doesn't really translate to the muscle memory you need for `{`, `=>`, four-space indents, and everything else that shows up in real code. This is an attempt at something closer to what you actually type all day.

## Stack

- **API** - NestJS, Prisma, Postgres. Fetches and filters snippets from GitHub through Octokit, handles auth and session scoring.
- **Web** - React + Vite, plain CSS (no UI kit).
- **`packages/shared`** - types shared between the two so the API and frontend don't drift apart.

It's a pnpm workspace monorepo.

## Running it locally

Full setup (Postgres, a GitHub token, the OAuth app) is in [QUICKSTART.md](QUICKSTART.md). Once that's done:

```bash
pnpm install
pnpm dev
```

API runs on `:3000`, web on `:5173`.
