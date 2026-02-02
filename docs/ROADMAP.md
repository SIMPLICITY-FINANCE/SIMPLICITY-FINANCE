# SIMPLICITY FINANCE - Product Roadmap

**Current Version:** v1.0.0 (Production Baseline)  
**Last Updated:** February 2, 2026

---

## Vision

Build the most trustworthy finance podcast summarization platform with evidence-grounded outputs, making financial content accessible and actionable for investors and enthusiasts.

---

## Completed Milestones

### v1.0.0 - Production Baseline (Completed: February 2026)

**Core Features Delivered:**
- ✅ Episode processing pipeline (ingest → transcribe → summarize → QC)
- ✅ Admin approval workflow
- ✅ Google OAuth authentication with role-based access control
- ✅ Public feed with search and discovery
- ✅ Scheduled daily ingestion (YouTube channels, playlists, RSS feeds)
- ✅ Health check endpoint for monitoring
- ✅ Environment separation guardrails (local vs production)
- ✅ Comprehensive documentation (onboarding, deployment, API)

**Production Status:**
- Deployed on Vercel: https://simplicity-finance.vercel.app
- Database on Supabase PostgreSQL
- Background jobs via Inngest
- All smoke tests passing

---

## Current Focus (v1.1 - Q1 2026)

### 1. Production Stabilization & Observability

**Goal:** Establish operational visibility and error tracking to catch issues proactively.

**Key Deliverables:**
- Structured logging (Winston or Pino)
- Error tracking integration (Sentry)
- Expanded health checks with detailed diagnostics
- Daily ops review process
- Basic alerting (email/Slack on critical errors)

**Success Metrics:**
- Zero critical errors go unnoticed for >1 hour
- Mean time to detect (MTTD) issues: <30 minutes

**Timeline:** 2 weeks

---

### 2. Data Pipeline Hardening

**Goal:** Make episode processing more resilient with retry logic and structured error outputs.

**Key Deliverables:**
- Inngest retry policies configured
- Idempotency verification tests
- Structured error storage in database
- QC audit trail for all quality check decisions
- Pipeline failure recovery scripts

**Success Metrics:**
- Pipeline success rate: >95%
- Failed episodes auto-retry successfully: >80%
- Zero duplicate episodes from retries

**Timeline:** 2 weeks

---

### 3. Daily Batch Report Generation

**Goal:** Generate one aggregated report from ~40 daily episode summaries.

**Key Deliverables:**
- Scheduled job generates daily batch report (3 AM UTC)
- Report artifacts stored in database
- Reports viewable in `/reports` page
- Idempotent report generation (re-running updates existing)
- Admin "Regenerate" button for manual triggers

**Success Metrics:**
- Daily report generated successfully: >95% of days
- Report generation time: <5 minutes
- User engagement: >10% of users view batch reports weekly

**Timeline:** 1-2 weeks

---

### 4. Chatbot MVP (RAG over Transcripts)

**Goal:** Build a minimal viable chatbot that answers questions about episode content using retrieval-augmented generation.

**Key Deliverables:**
- Embedding strategy defined (summary bullets → vectors)
- Supabase pgvector configured for vector storage
- Retrieval function implemented (cosine similarity search)
- `/chat` UI route with simple chat interface
- Auth gating (logged-in users only)
- Conversation history stored in database

**Success Metrics:**
- Chatbot responds in <3 seconds
- Retrieval accuracy (relevant context): >80%
- User satisfaction (thumbs up/down): >70% positive

**Timeline:** 2-3 weeks

---

### 5. Right Rail Enhancements

**Goal:** Wire right rail widgets to real data and add refresh functionality.

**Key Deliverables:**
- "Up Next" shows real episodes (recent approved + followed shows)
- "Suggestions" shows real shows/people
- Refresh button triggers revalidation
- Quick actions have stub pages or external links
- User preference management

**Success Metrics:**
- "Up Next" shows real data for 100% of users
- Refresh functionality works without errors
- User follows increase by >20% after suggestions wiring

**Timeline:** 1-2 weeks

---

## Future Roadmap (v1.2+ - Q2 2026 and Beyond)

### Advanced Search & Discovery

**Features:**
- Semantic search over episode content
- Advanced filters (date range, show, person, topic)
- Search result ranking improvements
- "Similar episodes" recommendations

**Timeline:** Q2 2026

---

### Premium Features

**Features:**
- Priority episode processing (skip queue)
- Advanced analytics (listening trends, topic tracking)
- Custom report generation
- API access for developers
- Export functionality (PDF, Markdown)

**Timeline:** Q2-Q3 2026

---

### User Profile & Settings

**Features:**
- Profile customization (avatar, bio)
- Notification preferences
- Email digests (daily/weekly summaries)
- Privacy settings
- Account management

**Timeline:** Q2 2026

---

### Mobile Experience

**Features:**
- Responsive design improvements
- Progressive Web App (PWA)
- Mobile-optimized player
- Offline support for saved episodes

**Timeline:** Q3 2026

---

### Content Expansion

**Features:**
- Support for more podcast sources (Spotify, Apple Podcasts)
- Support for non-finance content (tech, business, etc.)
- Multi-language support
- Automatic show discovery and suggestions

**Timeline:** Q3-Q4 2026

---

### Community Features

**Features:**
- User comments on episodes/bullets
- Shared notebooks (collaborative notes)
- Follow other users
- Public/private episode collections
- Social sharing

**Timeline:** Q4 2026

---

## Technical Debt & Infrastructure

### Short-Term (v1.1)
- Migrate file storage from local filesystem to Supabase Storage
- Add Redis caching layer
- Implement rate limiting middleware
- Add database indexes for performance

### Medium-Term (v1.2)
- Migrate to Next.js 16 stable (from canary)
- Update middleware to `proxy.ts` (deprecation warning)
- Add database read replicas (if needed)
- Implement CDN for static assets

### Long-Term (v2.0)
- Microservices architecture (if scale requires)
- Multi-region deployment
- Real-time collaboration features
- Advanced ML models for summarization

---

## Success Metrics (Company-Wide)

### User Engagement
- **Target:** 1,000 active users by Q2 2026
- **Target:** 50% weekly active user (WAU) retention
- **Target:** Average 10 episodes viewed per user per week

### Content Quality
- **Target:** >90% QC pass rate
- **Target:** <5% episode rejection rate by admins
- **Target:** >80% user satisfaction with summaries

### Operational Excellence
- **Target:** 99.9% uptime
- **Target:** <1 hour mean time to recovery (MTTR)
- **Target:** <30 minutes mean time to detect (MTTD)

### Business Metrics
- **Target:** 100 approved episodes by Q2 2026
- **Target:** 20 shows with automatic ingestion enabled
- **Target:** 10,000 total episode views by Q2 2026

---

## How to Contribute

**Want to help build the roadmap?**

1. **Review current priorities** in this document
2. **Check GitHub issues** for open tasks
3. **Read the execution plan** in `docs/EXECUTION_PLAN_V1_1.md`
4. **Pick a task** and create a PR
5. **Follow the development workflow** in `docs/ONBOARDING.md`

**Have a feature idea?**
- Open a GitHub issue with the `enhancement` label
- Describe the problem and proposed solution
- Include user stories and success metrics

---

## References

- **Detailed v1.1 Plan:** See `docs/EXECUTION_PLAN_V1_1.md`
- **Architecture:** See `docs/ARCHITECTURE.md`
- **API Reference:** See `docs/API.md`
- **Pipeline Details:** See `docs/PIPELINE.md`
- **Onboarding:** See `docs/ONBOARDING.md`

---

**Document Version:** 1.0  
**Maintained By:** Product Team  
**Last Review:** February 2, 2026
