# Simplicity Finance

Finance podcast summarization platform focused on trustworthy, evidence-grounded outputs.

## What this repo will become
- Ingest long-form finance episodes (captions-first + licensed RSS/partner URLs)
- Produce structured summaries with citations to transcript timestamps
- Generate daily/weekly/monthly reports (summaries-of-summaries)
- Provide search (Postgres FTS + pgvector) and a Notebook (saved bullets)

## Core UX rules
- **Saved** = Episodes + Reports only
- **Notebook** = Bullets only

## Repo structure (high level)
- `/app` — Next.js routes (App Router)
- `/components` — UI components
- `/server` — server-only services, providers, DB (do not import from UI)
- `/inngest` — workflow orchestration
- `/schemas` — Zod schemas (contracts)
- `/prompts` — versioned prompts
- `/scripts` — integration/ops scripts

## Workflow
- No direct commits to `main`
- All work happens on branches and merges via PR
- Keep PRs small (one feature per PR)

## Local development
(Coming soon)
