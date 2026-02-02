# Developer Onboarding Guide

**Welcome to SIMPLICITY FINANCE!** This guide will help you get the application running locally for the first time.

---

## 📋 Prerequisites

Before you begin, ensure you have:

### Required Software
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/downloads))
- **yt-dlp** (for downloading YouTube audio)
  - macOS: `brew install yt-dlp`
  - Linux: `sudo apt install yt-dlp` or `pip install yt-dlp`
  - Windows: Download from [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases)
- **Code Editor** (VS Code recommended)

### Required API Keys

You'll need accounts and API keys for:

1. **YouTube Data API v3**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Enable YouTube Data API v3
   - Create API key

2. **Deepgram API** (audio transcription)
   - Sign up at: https://console.deepgram.com/
   - Get API key from dashboard

3. **OpenAI API** (summary generation)
   - Sign up at: https://platform.openai.com/
   - Create API key at: https://platform.openai.com/api-keys

4. **Google OAuth Credentials** (authentication)
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Save Client ID and Client Secret

---

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/SIMPLICITY-FINANCE/SIMPLICITY-FINANCE.git
cd SIMPLICITY-FINANCE
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:** Should complete without errors. If you see warnings about peer dependencies, that's normal.

---

### Step 3: Start PostgreSQL Database

```bash
docker compose up -d
```

**What this does:** Starts a PostgreSQL database in a Docker container.

**Verify it's running:**
```bash
docker ps
```

You should see a container named `simplicity-finance-db` running on port `5432`.

---

### Step 4: Configure Environment Variables

```bash
cp .env.example .env.local
```

Now edit `.env.local` with your API keys:

```bash
# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# Deepgram API (for audio transcription)
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# OpenAI API (for summary and QC)
OPENAI_API_KEY=your_openai_api_key_here

# Database (local Postgres via Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplicity_finance_dev

# NextAuth.js (Authentication)
# Generate secret: openssl rand -base64 32
AUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Inngest (for workflow orchestration)
INNGEST_EVENT_KEY=local
INNGEST_SIGNING_KEY=your_signing_key_here
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### Step 5: Apply Database Schema

```bash
npm run db:push
```

**What this does:** Creates all database tables based on the schema in `db/schema.ts`.

**Expected output:**
```
[✓] Pulling schema from database...
[✓] Changes applied
```

---

### Step 6: Seed Demo Data (Optional but Recommended)

```bash
npm run db:seed:demo
```

**What this does:** Populates the database with:
- Demo user (email: `demo@example.com`)
- Sample shows
- Sample episodes with summaries

**Expected output:**
```
✓ Demo user created
✓ Shows seeded
✓ Episodes seeded
```

---

### Step 7: Start Development Servers

You need **TWO terminal windows**:

**Terminal 1 - Next.js:**
```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

**Terminal 2 - Inngest (background jobs):**
```bash
npx inngest-cli@latest dev
```

**Expected output:**
```
Inngest dev server running at http://localhost:8288
```

---

### Step 8: Access the Application

Open your browser:

- **Main App:** http://localhost:3000
- **Inngest UI:** http://localhost:8288

**First visit:**
1. You'll see the dashboard (may be empty if you didn't seed data)
2. Click "Sign In" in the top right
3. Sign in with Google OAuth
4. You'll be redirected back to the dashboard

---

## ✅ Verify Everything Works

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-02T...",
  "database": "connected",
  "version": "1.0.0"
}
```

### 2. Run Smoke Tests

```bash
npm run test:smoke
```

**Expected:** All 9 tests should pass.

### 3. Run Deployment Verification

```bash
npm run verify:deploy
```

**Expected:** All checks should pass (11/11).

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot connect to database"

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:**
```bash
# Check if Docker is running
docker ps

# If no containers, start PostgreSQL
docker compose up -d

# Verify it's running
docker ps | grep postgres
```

---

### Issue: "Google OAuth redirect mismatch"

**Symptoms:**
```
Error: redirect_uri_mismatch
```

**Fix:**
1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client ID
3. Add **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
4. Save and wait 5 minutes for changes to propagate

---

### Issue: "Inngest functions not registering"

**Symptoms:**
- Inngest UI shows no functions
- Upload doesn't trigger processing

**Fix:**
```bash
# Make sure both servers are running
# Terminal 1: npm run dev
# Terminal 2: npx inngest-cli@latest dev

# Restart both if needed
# The Next.js dev server must be running for Inngest to discover functions
```

---

### Issue: "Module not found" errors

**Symptoms:**
```
Error: Cannot find module 'next'
```

**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "Port 3000 already in use"

**Fix:**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

---

## 🎓 Next Steps

### Explore the Codebase

**Key directories to understand:**
- `app/(app)/` - Main application pages (dashboard, search, etc.)
- `app/api/` - API routes (health check, admin endpoints)
- `inngest/functions/` - Background job definitions
- `db/schema.ts` - Database schema
- `prompts/` - LLM prompts for summarization

### Make Your First Change

1. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes** (e.g., edit a component)

3. **Test locally:**
   ```bash
   npm run build
   npm run test:smoke
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push -u origin feat/your-feature-name
   ```

5. **Create PR** on GitHub

### Become an Admin User

By default, new users have role `user`. To access admin features:

```bash
# Connect to database
docker exec -it simplicity-finance-db psql -U postgres -d simplicity_finance_dev

# Promote your user to admin
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

# Exit
\q
```

Now visit http://localhost:3000 and you'll see "ADMIN" in the profile menu.

---

## 📚 Additional Resources

### Documentation
- **[README.md](../README.md)** - Project overview
- **[PIPELINE.md](PIPELINE.md)** - Episode processing workflow
- **[API.md](API.md)** - API reference
- **[RELEASE_RUNBOOK.md](RELEASE_RUNBOOK.md)** - Deployment guide

### Tools
- **Drizzle Studio** (Database GUI): `npm run db:studio`
- **Inngest UI** (Workflow monitoring): http://localhost:8288

### Getting Help
- Check existing issues: https://github.com/SIMPLICITY-FINANCE/SIMPLICITY-FINANCE/issues
- Create new issue if needed
- Review documentation in `docs/` folder

---

## 🎉 You're Ready!

You should now have:
- ✅ Local development environment running
- ✅ Database seeded with demo data
- ✅ Google OAuth authentication working
- ✅ Inngest background jobs running

**Happy coding!** 🚀
