# SIMPLICITY FINANCE

Finance podcast summarization platform focused on trustworthy, evidence-grounded outputs.

## Overview

SIMPLICITY FINANCE ingests long-form finance podcasts, generates structured summaries with evidence citations, and provides search, discovery, and reporting tools for financial content.

## Current Status

**Branch:** `feat/robot-v0`  
**Phase:** Production Readiness (Post Phase 8)

### Features Delivered
- ✅ **Admin Dashboard** - Approvals workflow with audit logging
- ✅ **Public Feed** - Dashboard with approved episodes
- ✅ **Episode Detail** - Summaries with evidence chips linked to timestamps
- ✅ **Search** - Keyword search across episodes and bullets
- ✅ **Reports** - Weekly/monthly aggregations
- ✅ **Saved/Notebook** - Saved episodes vs. saved bullets distinction
- ✅ **Upload** - Submit YouTube/audio URLs with live status tracking
- ✅ **Discover** - Browse and follow shows and people
- ✅ **Admin Ingest** - Manage upload requests with retry functionality

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- API Keys: YouTube, Deepgram, OpenAI

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd SIMPLICITY-FINANCE
   npm install
   ```

2. **Start PostgreSQL**
   ```bash
   docker compose up -d
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run migrations and seed demo data**
   ```bash
   npm run db:push
   npm run db:seed:demo
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Next.js
   npm run dev

   # Terminal 2: Inngest
   npx inngest-cli@latest dev
   ```

6. **Access the app**
   - App: http://localhost:3000
   - Inngest UI: http://localhost:8288

## Project Structure

```
SIMPLICITY-FINANCE/
├── app/                    # Next.js App Router
│   ├── (app)/             # Main application routes
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── lib/               # Utilities and actions
├── db/                    # Database schema and migrations
├── docs/                  # Documentation
│   ├── planning/          # Execution roadmap and specs
│   ├── deployment/        # Deployment guides
│   └── screenshots/       # Figma references
├── inngest/               # Workflow orchestration
├── prompts/               # LLM prompts (versioned)
├── schemas/               # Zod validation schemas
└── scripts/               # Operational scripts
```

## Core Workflows

### Upload → Processing → Feed
1. User submits YouTube/audio URL at `/upload`
2. Inngest workflow processes: metadata → transcription → summary → QC
3. Admin approves summary at `/admin/approvals`
4. Episode appears in public feed at `/dashboard`

### Discovery → Follow → Saved
1. User browses shows/people at `/discover`
2. Follows interesting content
3. Followed items appear at `/saved`

## Key Commands

```bash
# Development
npm run dev                 # Start Next.js dev server
npm run dev:clean          # Clean build and start dev server

# Database
npm run db:push            # Apply schema changes
npm run db:seed:demo       # Seed demo data (idempotent)
npm run db:studio          # Open Drizzle Studio

# Scripts
npm run robot              # Run pipeline smoke test
```

## Documentation

- **Execution Roadmap:** `docs/planning/EXECUTE_V2.md`
- **Deployment Guide:** `docs/deployment/DEPLOYMENT.md`
- **Design Spec:** `docs/planning/FIGMA_STYLE_SPEC.md`
- **Inngest Setup:** `inngest/README.md`

## Next Steps

See `docs/planning/EXECUTE_V2.md` for the complete production readiness roadmap.

**Current Priority:** Milestone 1 - Regression Prevention (Smoke Tests + CI)

## Contributing

See `CONTRIBUTING.md` for development workflow and PR guidelines.

## License

See `LICENSE` file.
