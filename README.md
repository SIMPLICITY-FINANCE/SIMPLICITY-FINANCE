# SIMPLICITY FINANCE

**Finance podcast summarization platform focused on trustworthy, evidence-grounded outputs.**

SIMPLICITY FINANCE ingests long-form finance podcasts, generates structured summaries with evidence citations, and provides search, discovery, and reporting tools for financial content.

---

## 🎯 What It Does

**For Listeners:**
- Browse approved episode summaries with evidence-backed bullet points
- Search across episodes and specific claims
- Follow shows and people to track new content
- Save episodes and individual insights to your notebook
- View weekly/monthly aggregated reports

**For Admins:**
- Upload YouTube videos or audio URLs for processing
- Review and approve AI-generated summaries
- Manage shows and configure automatic ingestion
- Monitor processing pipeline and debug failures

---

## 🏗️ System Architecture

```
┌─────────────┐
│   Upload    │ User submits YouTube/audio URL
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│              Inngest Pipeline                    │
│  1. Fetch metadata (YouTube API)                │
│  2. Transcribe audio (Deepgram)                 │
│  3. Generate summary (OpenAI GPT-4)             │
│  4. Quality check (OpenAI)                      │
│  5. Store in database + files                   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
            ┌──────────────┐
            │ Admin Review │ Approve/reject summary
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ Public Feed  │ Dashboard, search, discover
            └──────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS
- **Backend:** Next.js API Routes, Server Actions
- **Database:** PostgreSQL (Supabase in production, Docker locally)
- **ORM:** Drizzle ORM with migrations
- **Auth:** NextAuth.js v5 with Google OAuth
- **Background Jobs:** Inngest for workflow orchestration
- **AI/ML:** OpenAI GPT-4, Deepgram transcription
- **Deployment:** Vercel (production), Docker Compose (local)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **Docker** & Docker Compose
- **API Keys:**
  - YouTube Data API v3
  - Deepgram API
  - OpenAI API
  - Google OAuth credentials

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/SIMPLICITY-FINANCE/SIMPLICITY-FINANCE.git
cd SIMPLICITY-FINANCE

# 2. Install dependencies
npm install

# 3. Start PostgreSQL
docker compose up -d

# 4. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 5. Apply database schema
npm run db:push

# 6. Seed demo data (optional)
npm run db:seed:demo

# 7. Start development servers
# Terminal 1: Next.js
npm run dev

# Terminal 2: Inngest (background jobs)
npx inngest-cli@latest dev
```

**Access the app:**
- App: http://localhost:3000
- Inngest UI: http://localhost:8288

**First-time setup?** See [docs/ONBOARDING.md](docs/ONBOARDING.md) for detailed instructions.

### AI Assistant Rules
This project uses Windsurf AI with custom rules.
Rules file: `.windsurf/rules.md` 
All AI sessions should start by reading that file.

---

## 📦 Project Structure

```
SIMPLICITY-FINANCE/
├── app/                      # Next.js App Router
│   ├── (app)/               # Main application routes (authenticated)
│   ├── api/                 # API routes (health, admin, auth)
│   ├── components/          # React components
│   └── lib/                 # Utilities, actions, database client
├── db/                      # Database schema and migrations
│   ├── schema.ts            # Drizzle schema definitions
│   └── migrations/          # SQL migration files
├── docs/                    # Documentation
│   ├── RELEASE_RUNBOOK.md   # Deployment guide
│   ├── ONBOARDING.md        # New contributor guide
│   ├── API.md               # API reference
│   ├── PIPELINE.md          # Episode processing workflow
│   └── deployment/          # Deployment-specific docs
├── inngest/                 # Workflow orchestration
│   └── functions/           # Background job definitions
├── prompts/                 # LLM prompts (versioned)
├── schemas/                 # Zod validation schemas
└── scripts/                 # Operational scripts
```

---

## 🔑 Key Commands

### Development
```bash
npm run dev              # Start Next.js dev server
npm run dev:clean        # Clean build and start dev server
npx inngest-cli dev      # Start Inngest dev server
```

### Database
```bash
npm run db:push          # Apply schema changes to database
npm run db:generate      # Generate migration files
npm run db:studio        # Open Drizzle Studio (DB GUI)
npm run db:seed:demo     # Seed demo data (idempotent)
```

### Testing & Verification
```bash
npm run test:smoke       # Run Playwright smoke tests
npm run verify:deploy    # Verify deployment readiness
```

### Scripts
```bash
npm run robot            # Run pipeline smoke test
```

---

## 🌐 Deployment

**Production:** Deployed on Vercel with Supabase PostgreSQL

### Environment Variables Required

See `.env.example` for full list. Key variables:

```bash
DATABASE_URL=postgresql://...           # Supabase connection string
NEXTAUTH_SECRET=...                     # Generate: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DEEPGRAM_API_KEY=...
YOUTUBE_API_KEY=...
OPENAI_API_KEY=...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

### Deployment Steps

1. **Configure Vercel environment variables**
2. **Set up Google OAuth** (create OAuth credentials in Google Cloud Console)
3. **Push to main** → Vercel auto-deploys
4. **Run migrations** against production database
5. **Verify deployment** with health check

**For detailed deployment procedures, see the documentation below.**

---

## 📚 Documentation

**Start here if you're new:**

### Core Documentation (Read These First)
1. **[docs/ONBOARDING.md](docs/ONBOARDING.md)** - First-time contributor setup guide
   - Prerequisites, local development setup, common issues
2. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture overview
   - High-level design, component breakdown, data flow
3. **[docs/ROADMAP.md](docs/ROADMAP.md)** - Product roadmap and priorities
   - Current focus (v1.1), future plans, success metrics
4. **[docs/API.md](docs/API.md)** - Complete API reference
   - Server actions, routes, Inngest functions

### Additional Resources
- **[docs/PIPELINE.md](docs/PIPELINE.md)** - Episode processing workflow details
- **[docs/EXECUTION_PLAN_V1_1.md](docs/EXECUTION_PLAN_V1_1.md)** - Detailed v1.1 execution plan
- **[docs/deployment/](docs/deployment/)** - Deployment guides (AUTH_SETUP.md, DEPLOYMENT.md)
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development workflow and PR guidelines

---

## ✅ Production Status

**Current Version:** v1.0.0 (Production Baseline)  
**Deployment:** ✅ Live at https://simplicity-finance.vercel.app  
**Database:** ✅ Supabase PostgreSQL (pooled connection)  
**Background Jobs:** ✅ Inngest (scheduled ingestion + episode processing)  
**Status:** 🟢 Operational

### What's Working
- ✅ Vercel deployment builds and runs successfully
- ✅ Google OAuth authentication with role-based access control
- ✅ Admin approval workflow for episode summaries
- ✅ Episode processing pipeline (upload → transcribe → summarize → QC)
- ✅ Public feed with search and discovery
- ✅ Scheduled episode ingestion (daily at 2 AM UTC)
- ✅ Health check endpoint (`/api/health`)
- ✅ Environment separation guardrails (local vs production)

### Known Non-Blocking Items
- ⚠️ Middleware deprecation: `middleware.ts` → `proxy.ts` (Next.js 16 migration path)
- ⚠️ npm audit: 4 moderate vulnerabilities (dev dependencies, non-blocking)

### Next Steps
See **[docs/EXECUTION_PLAN_V1_1.md](docs/EXECUTION_PLAN_V1_1.md)** for the v1.1+ roadmap covering:
- Production observability and error tracking
- Data pipeline hardening with retry logic
- Daily batch report generation
- Chatbot MVP (RAG over transcripts)
- Right rail data wiring

---

## 🗺️ Roadmap

### Completed (v1.0.0)
- ✅ Core episode processing pipeline
- ✅ Admin approval workflow
- ✅ Authentication with Google OAuth
- ✅ Search and discovery features
- ✅ Scheduled ingestion
- ✅ Production deployment
- ✅ Environment separation guardrails

### In Progress (v1.1+)
See **[docs/EXECUTION_PLAN_V1_1.md](docs/EXECUTION_PLAN_V1_1.md)** for detailed roadmap:
- 🔄 Production observability and error tracking
- 🔄 Data pipeline hardening (retry logic, idempotency)
- 🔄 Daily batch report generation
- 🔄 AI chatbot for episode Q&A (RAG)
- 🔄 Right rail data wiring (real episodes, suggestions)

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and PR guidelines.

**Quick summary:**
1. Create feature branch from `main`
2. Make changes and test locally (`npm run build`, `npm run test:smoke`)
3. Push branch and create PR
4. Wait for Vercel Preview build to pass
5. Squash and merge to `main`

---

## 📄 License

See [LICENSE](LICENSE) file.

---

## 🆘 Support

- **Issues:** https://github.com/SIMPLICITY-FINANCE/SIMPLICITY-FINANCE/issues
- **Documentation:** [docs/](docs/)
- **Health Check:** https://simplicity-finance.vercel.app/api/health

---

**Built with ❤️ for finance podcast enthusiasts**
