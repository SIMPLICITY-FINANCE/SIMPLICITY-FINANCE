# Inngest: Dev Server vs Cloud Mode

## Overview

Inngest can run in two modes:
1. **Dev Mode** - Events execute locally via `inngest-cli dev` server
2. **Cloud Mode** - Events execute on Inngest Cloud infrastructure

**For local development, you MUST use Dev Mode** to avoid requests getting stuck in "queued" state.

---

## Quick Setup for Local Dev

### 1. Set Environment Variable

Add to your `.env.local`:

```bash
# Force Inngest to use Dev Mode (required for local development)
INNGEST_DEV=1
```

### 2. Start Dev Server

In a separate terminal:

```bash
npx inngest-cli dev -u http://localhost:3000/api/inngest
```

Or use the npm script:

```bash
npm run inngest:dev
```

### 3. Start Next.js Dev Server

```bash
npm run dev
```

### 4. Verify Configuration

Check your terminal for the Inngest configuration log:

```
============================================================
[inngest] Configuration:
  mode: dev
  baseUrl: http://localhost:8288
  id: simplicity-finance
  ⚠️  Dev mode enabled - events will execute locally
  💡 Start dev server: npx inngest-cli dev -u http://localhost:3000/api/inngest
============================================================
```

---

## How It Works

### Dev Mode (Local Development)

```
User submits URL
    ↓
Next.js sends event to Inngest SDK
    ↓
Inngest SDK forwards to Dev Server (localhost:8288)
    ↓
Dev Server calls back to Next.js (/api/inngest)
    ↓
Function executes locally in your Next.js process
    ↓
You see logs in your terminal
```

**Advantages:**
- ✅ Immediate execution (no cloud delay)
- ✅ Full debugging with console.log
- ✅ Hot reload on code changes
- ✅ No API keys required
- ✅ Works offline

### Cloud Mode (Production)

```
User submits URL
    ↓
Next.js sends event to Inngest Cloud
    ↓
Inngest Cloud queues event
    ↓
Inngest Cloud calls your deployed endpoint
    ↓
Function executes on Inngest infrastructure
    ↓
Logs visible in Inngest Cloud dashboard
```

**Advantages:**
- ✅ Scalable execution
- ✅ Automatic retries
- ✅ Persistent queue
- ✅ Production monitoring

---

## Common Issues & Solutions

### Issue 1: Requests Stuck in "Queued" State

**Symptoms:**
- Admin ingest page shows `status: queued`
- `started_at` is null
- No stage updates
- No terminal logs

**Cause:** Running in Cloud Mode on localhost

**Solution:**

1. Check the Debug Panel in `/admin/ingest`
2. If it shows "Using Cloud (should be Dev)", add to `.env.local`:
   ```bash
   INNGEST_DEV=1
   ```
3. Restart Next.js dev server
4. Start Inngest dev server if not running

### Issue 2: "Dev Server Offline" Warning

**Symptoms:**
- Debug panel shows red "Dev Server Offline"
- Requests don't execute

**Cause:** Inngest dev server not running

**Solution:**

```bash
npx inngest-cli dev -u http://localhost:3000/api/inngest
```

### Issue 3: Events Go to Cloud Instead of Local

**Symptoms:**
- Events appear in Inngest Cloud dashboard
- Don't execute locally

**Cause:** Missing `INNGEST_DEV=1` or `NODE_ENV=production`

**Solution:**

1. Add `INNGEST_DEV=1` to `.env.local`
2. Ensure `NODE_ENV` is NOT set to `production` in local dev
3. Restart dev server

---

## Environment Variables

### Local Development

```bash
# .env.local

# Force Dev Mode (REQUIRED for local dev)
INNGEST_DEV=1

# Optional: Custom dev server URL (default: http://localhost:8288)
# INNGEST_DEV_SERVER_URL=http://localhost:8288

# DO NOT SET THESE IN LOCAL DEV:
# INNGEST_EVENT_KEY=...
# INNGEST_SIGNING_KEY=...
```

### Production (Vercel/Netlify)

```bash
# Production environment variables

# Inngest Cloud credentials (required)
INNGEST_EVENT_KEY=your-event-key
INNGEST_SIGNING_KEY=your-signing-key

# DO NOT SET INNGEST_DEV in production
```

---

## Debugging Checklist

When requests aren't executing:

1. **Check Inngest Mode**
   - Go to `/admin/ingest`
   - Look at Debug Panel → Inngest Configuration
   - Should show: `mode: dev` and green "Dev Server Connected"

2. **Verify Dev Server is Running**
   - Terminal should show: `Inngest Dev Server running on http://localhost:8288`
   - Visit http://localhost:8288 in browser - should see Inngest UI

3. **Check Next.js Logs**
   - Look for Inngest configuration log at startup
   - Should show `mode: dev`

4. **Test Event Flow**
   - Submit a test URL
   - Check terminal for `🚀 PROCESS_EPISODE_START` log
   - Should appear within 1-2 seconds

5. **Use Resend Button**
   - For stuck queued requests, click "Resend" button
   - This re-sends the event to Inngest
   - Should start executing immediately if dev server is running

---

## Admin UI Features

### Debug Panel

Located at top of `/admin/ingest` page:

**Inngest Configuration Section:**
- Shows current mode (dev/cloud)
- Shows base URL
- Connection status indicator:
  - 🟢 Green: Dev server connected
  - 🔴 Red: Dev server offline
  - 🟠 Orange: Using cloud on localhost (misconfigured)

**Most Recent Request Section:**
- Status, stage, updated timestamp
- Request ID and URL
- Error messages (if failed)
- Link to Inngest dashboard

**Warnings:**
- "Stuck in Queued" - Shows if request hasn't started
- Provides specific fix based on detected issue

### Resend Button

For requests stuck in `queued` state:

1. Click "Resend" button on the request row
2. Creates new Inngest event
3. Resets request state to fresh queue
4. Should execute immediately if dev server is running

---

## Production Deployment

### 1. Set Environment Variables

In your deployment platform (Vercel/Netlify):

```bash
INNGEST_EVENT_KEY=your-event-key
INNGEST_SIGNING_KEY=your-signing-key
```

**Do NOT set:**
- `INNGEST_DEV=1` (this forces dev mode)

### 2. Register Endpoint with Inngest Cloud

1. Go to https://app.inngest.com
2. Add your production URL: `https://yourdomain.com/api/inngest`
3. Inngest will verify the endpoint

### 3. Test Production Flow

1. Submit a test URL in production
2. Check Inngest Cloud dashboard for execution
3. Verify logs appear in Inngest Cloud (not local terminal)

---

## FAQ

**Q: Why are my requests stuck in "queued"?**

A: You're likely in Cloud Mode on localhost. Add `INNGEST_DEV=1` to `.env.local` and restart.

**Q: Can I use Cloud Mode in local dev?**

A: Yes, but you'll need to manually "Send to Dev Server" from Inngest Cloud UI for each event. Not recommended.

**Q: How do I know which mode I'm in?**

A: Check the Debug Panel at `/admin/ingest` or look for the Inngest configuration log in your terminal at startup.

**Q: What if I want to test Cloud Mode locally?**

A: Set up proper `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`, remove `INNGEST_DEV=1`, and use the Inngest Cloud dashboard to forward events to your local server.

**Q: Do I need to restart after changing INNGEST_DEV?**

A: Yes, the Inngest client is initialized at startup. Restart your Next.js dev server.

---

## Summary

**Local Dev (Recommended):**
```bash
# .env.local
INNGEST_DEV=1

# Terminal 1
npm run dev

# Terminal 2
npm run inngest:dev
```

**Production:**
```bash
# Environment variables
INNGEST_EVENT_KEY=your-key
INNGEST_SIGNING_KEY=your-key

# Deploy
# Inngest Cloud handles execution
```

**The key rule: Always use Dev Mode (`INNGEST_DEV=1`) for local development!**
