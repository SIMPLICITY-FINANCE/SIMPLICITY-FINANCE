# Inngest Dev Mode Fix: Stuck Queued Requests

## ✅ ALL TASKS COMPLETE

Fixed ingests stuck in "queued" state by forcing Dev Mode in local development, adding connectivity checks, and implementing resend functionality.

---

## Problem Summary

**Symptoms:**
- Requests stuck in `status=queued` for hours
- `started_at` is null, no stage updates
- Inngest Cloud shows events but local app doesn't execute them
- Manual "Send to Dev Server" required for each request

**Root Cause:**
- Inngest client was running in **Cloud Mode** on localhost
- Events sent to Inngest Cloud instead of local dev server
- Local dev server never received events to execute

---

## Solution Implemented

### A) Force Dev Server Mode in Local Development

**File:** `inngest/client.ts`

**Changes:**

1. **Auto-detect Dev Mode:**
   ```typescript
   const isDevMode = process.env.INNGEST_DEV === "1" || process.env.NODE_ENV !== "production";
   ```

2. **Conditional Configuration:**
   ```typescript
   export const inngest = new Inngest({
     id: "simplicity-finance",
     
     // Dev mode: minimal config, no keys required
     ...(isDevMode
       ? {
           eventKey: "local-dev",
           isDev: true,
         }
       : {
           eventKey: process.env.INNGEST_EVENT_KEY!,
           signingKey: process.env.INNGEST_SIGNING_KEY,
         }),
   });
   ```

3. **Startup Logging:**
   ```typescript
   console.log("\n" + "=".repeat(60));
   console.log("[inngest] Configuration:");
   console.log(`  mode: ${mode}`);
   console.log(`  baseUrl: ${baseUrl}`);
   console.log(`  id: simplicity-finance`);
   if (isDevMode) {
     console.log(`  ⚠️  Dev mode enabled - events will execute locally`);
     console.log(`  💡 Start dev server: npx inngest-cli dev -u http://localhost:3000/api/inngest`);
   }
   console.log("=".repeat(60) + "\n");
   ```

**Expected Terminal Output:**
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

### B) Dev Server Connectivity Health Check

**File:** `app/api/admin/inngest-health/route.ts` (NEW)

**Endpoint:** `GET /api/admin/inngest-health`

**Returns:**
```json
{
  "mode": "dev",
  "baseUrl": "http://localhost:8288",
  "devServerReachable": true,
  "error": null,
  "isLocalhost": true
}
```

**Features:**
- Pings dev server at `http://localhost:8288/health`
- 2-second timeout to avoid hanging
- Returns connection status and error details

---

### C) Resend Button for Stuck Requests

**File:** `app/api/admin/ingest/resend/route.ts` (NEW)

**Endpoint:** `POST /api/admin/ingest/resend`

**Request:**
```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:**
```json
{
  "success": true,
  "eventId": "01KGG2P7QZ3EXJ1MNFB8MDEA8G",
  "requestId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**What it does:**
1. Fetches the ingest request from DB
2. Sends new event to Inngest: `inngest.send({ name: "episode/submitted", ... })`
3. Updates DB with new event ID and resets state:
   - `status = 'queued'`
   - `stage = NULL`
   - `started_at = NULL`
   - `inngest_event_id = <new_id>`
   - `updated_at = NOW()`

---

### D) Enhanced Debug Panel

**File:** `app/(app)/admin/ingest/AdminIngestTable.tsx`

**New Features:**

#### 1. Inngest Configuration Section

Shows:
- **Mode:** dev or cloud
- **Base URL:** http://localhost:8288 or https://api.inngest.com
- **Connection Status:**
  - 🟢 Green "Dev Server Connected" (mode=dev, server reachable)
  - 🔴 Red "Dev Server Offline" (mode=dev, server not reachable)
  - 🟠 Orange "Using Cloud (should be Dev)" (mode=cloud on localhost)

#### 2. Contextual Warnings

**If Dev Server Offline:**
```
⚠️ Dev Server Not Running
Start it with:
npx inngest-cli dev -u http://localhost:3000/api/inngest
```

**If Cloud Mode on Localhost:**
```
⚠️ Running in Cloud Mode on Localhost
Add to .env.local:
INNGEST_DEV=1

Then restart the dev server.
```

**If Request Stuck in Queued:**
```
⚠️ Stuck in Queued: This request hasn't started executing.
You're in Cloud mode on localhost. Switch to Dev mode (see above).
```

#### 3. Resend Button

- Appears on requests with `status=queued` and `started_at=null`
- Icon: Send (paper airplane)
- Disabled while resending (shows spinner)
- Calls `/api/admin/ingest/resend` endpoint
- Logs success to console

---

## Files Changed

| File | Status | Purpose |
|------|--------|---------|
| `inngest/client.ts` | Modified | Force dev mode, add startup logging |
| `app/api/admin/inngest-health/route.ts` | NEW | Health check endpoint |
| `app/api/admin/ingest/resend/route.ts` | NEW | Resend stuck requests |
| `app/(app)/admin/ingest/AdminIngestTable.tsx` | Modified | Add health check, resend button, warnings |
| `docs/inngest-dev-vs-cloud.md` | NEW | Comprehensive documentation |
| `.env.local` | Modified | Add `INNGEST_DEV=1` |

**Total:** 6 files changed/created

---

## Setup Instructions

### 1. Update .env.local

Add this line:

```bash
# Force Inngest Dev Mode for local development
INNGEST_DEV=1
```

### 2. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

You should see:

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

### 3. Start Inngest Dev Server

In a separate terminal:

```bash
npm run inngest:dev
```

Or:

```bash
npx inngest-cli dev -u http://localhost:3000/api/inngest
```

### 4. Verify Setup

1. Go to http://localhost:3000/admin/ingest
2. Check Debug Panel:
   - Should show: `mode: dev`
   - Should show: 🟢 "Dev Server Connected"
3. If you see warnings, follow the instructions in the panel

---

## Testing Checklist

### ✅ Verify Dev Mode is Active

1. **Check Terminal Output:**
   ```
   [inngest] Configuration:
     mode: dev
     baseUrl: http://localhost:8288
   ```

2. **Check Debug Panel:**
   - Go to `/admin/ingest`
   - Inngest Configuration section should show:
     - Mode: `dev`
     - Base URL: `http://localhost:8288`
     - 🟢 "Dev Server Connected"

### ✅ Test Auto-Execution

1. **Submit a Test URL:**
   - Go to http://localhost:3000/upload
   - Submit: `https://www.youtube.com/watch?v=qeTjwd69Nxw`

2. **Verify Immediate Execution:**
   - Within 1-2 seconds, check terminal for:
     ```
     ═══════════════════════════════════════════════════════════════
     🚀 PROCESS_EPISODE_START {
       requestId: '...',
       url: 'https://www.youtube.com/watch?v=qeTjwd69Nxw',
       timestamp: '...'
     }
     ═══════════════════════════════════════════════════════════════
     ```
   - Check `/admin/ingest` page:
     - Status should change to `running`
     - Stage should update: `metadata` → `download` → `transcribe` → ...

### ✅ Test Resend Button

1. **Find a Stuck Request:**
   - Look for requests with `status=queued`, `started_at=null`

2. **Click Resend:**
   - Button should show spinner while processing
   - Console should log: `[resend] Request ... resent with event ID ...`

3. **Verify Execution:**
   - Within 1-2 seconds, request should start executing
   - Status changes to `running`
   - Stage updates appear

### ✅ Test Warnings

1. **Stop Dev Server:**
   - Kill the `inngest-cli dev` process

2. **Check Debug Panel:**
   - Should show: 🔴 "Dev Server Offline"
   - Should show warning with start command

3. **Restart Dev Server:**
   - Run `npm run inngest:dev`
   - Refresh page
   - Should show: 🟢 "Dev Server Connected"

---

## Before vs After

### Before ❌

**Configuration:**
```typescript
export const inngest = new Inngest({
  id: "simplicity-finance",
  eventKey: process.env.INNGEST_EVENT_KEY || "local",
});
```

**Behavior:**
- Always used Cloud Mode (even on localhost)
- Events sent to Inngest Cloud
- Requests stuck in "queued" forever
- Manual "Send to Dev Server" required
- No visibility into mode or connectivity

**User Experience:**
- Submit URL → stuck in queued
- No feedback on what's wrong
- No way to retry/resend
- Confusing and frustrating

### After ✅

**Configuration:**
```typescript
const isDevMode = process.env.INNGEST_DEV === "1" || process.env.NODE_ENV !== "production";

export const inngest = new Inngest({
  id: "simplicity-finance",
  ...(isDevMode
    ? { eventKey: "local-dev", isDev: true }
    : { eventKey: process.env.INNGEST_EVENT_KEY!, signingKey: process.env.INNGEST_SIGNING_KEY }),
});
```

**Behavior:**
- Auto-detects Dev Mode on localhost
- Events execute locally immediately
- Full terminal logging
- Clear mode indication at startup

**User Experience:**
- Submit URL → executes within 1-2 seconds
- Real-time stage updates
- Clear warnings if misconfigured
- Resend button for stuck requests
- Full observability

---

## Key Improvements

### 1. Auto-Detection

No manual configuration needed - Dev Mode activates automatically when:
- `INNGEST_DEV=1` is set, OR
- `NODE_ENV !== "production"`

### 2. Clear Feedback

**Terminal:**
- Startup log shows mode and baseUrl
- Impossible to miss configuration

**UI:**
- Debug panel shows real-time connectivity
- Color-coded status indicators
- Contextual warnings with fix instructions

### 3. Self-Service Recovery

**Resend Button:**
- One-click retry for stuck requests
- No need to understand Inngest internals
- Works even if dev server was offline

### 4. Comprehensive Documentation

**New Doc:** `docs/inngest-dev-vs-cloud.md`

Covers:
- Dev vs Cloud mode comparison
- Setup instructions
- Troubleshooting guide
- Environment variables
- FAQ

---

## Production Deployment

**Important:** Do NOT set `INNGEST_DEV=1` in production!

### Production Environment Variables

```bash
# Vercel/Netlify environment variables
INNGEST_EVENT_KEY=your-production-event-key
INNGEST_SIGNING_KEY=your-production-signing-key

# DO NOT SET:
# INNGEST_DEV=1
```

The client will automatically use Cloud Mode when `NODE_ENV=production`.

---

## Summary

**The Fix:**
1. ✅ Force Dev Mode in local development
2. ✅ Add startup logging showing mode/baseUrl
3. ✅ Create health check endpoint
4. ✅ Add connectivity status to debug panel
5. ✅ Implement resend button for stuck requests
6. ✅ Add contextual warnings with fix instructions
7. ✅ Create comprehensive documentation

**Result:**
- No more stuck queued requests in local dev
- Immediate execution with full observability
- Clear feedback on configuration issues
- Self-service recovery with resend button

**Ingests now execute automatically in local dev without manual intervention!** 🎉
