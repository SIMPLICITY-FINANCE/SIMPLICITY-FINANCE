# Local Auth Development (Google OAuth)

## Generate `NEXTAUTH_SECRET`

### Step 1: Generate the secret

```bash
npm run gen:nextauth-secret
```

This will output a line like:
```
NEXTAUTH_SECRET=abc123...
```

### Step 2: Add to `.env.local`

Copy the entire line and paste it into your `.env.local` file at the repo root.

## Required `.env.local` variables

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...              # from npm run gen:nextauth-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DATABASE_URL=postgresql://...
```

**IMPORTANT:** Do not quote the values.

## Restart required

After changing any environment variables:

1. **Fully stop the dev server** (Ctrl+C)
2. **Clear Next.js cache:** `rm -rf .next`
3. **Restart:** `npm run dev`

Turbopack caches environment variables at boot, so a simple restart may not be enough if the cache is stale.

## Verify it worked

Visit: `http://localhost:3000/api/auth/health`

Expected response:
```json
{
  "ok": true,
  "missing": [],
  "envPresence": {
    "NEXTAUTH_URL": true,
    "NEXTAUTH_SECRET": true,
    "GOOGLE_CLIENT_ID": true,
    "GOOGLE_CLIENT_SECRET": true
  },
  "nodeEnv": "development"
}
```

## Google OAuth settings

In Google Cloud Console (OAuth Client):

- Authorized JavaScript origins:
  - `http://localhost:3000`
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`

## Verification Checklist

### Test 1: Missing env vars (app should NOT crash)

1. Rename `.env.local` to `.env.local.backup`
2. Clear cache: `rm -rf .next`
3. Restart: `npm run dev`
4. Visit `http://localhost:3000` - **dashboard should still load**
5. Visit `http://localhost:3000/api/auth/health` - **should return:**
   ```json
   {
     "ok": false,
     "missing": ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
     "envPresence": {
       "NEXTAUTH_URL": false,
       "NEXTAUTH_SECRET": false,
       "GOOGLE_CLIENT_ID": false,
       "GOOGLE_CLIENT_SECRET": false
     },
     "nodeEnv": "development"
   }
   ```
6. Visit `http://localhost:3000/api/auth/signin/google` - **should return:**
   ```json
   {
     "error": "AuthMisconfigured",
     "missing": ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
     "message": "Set env vars and restart dev server."
   }
   ```

### Test 2: With env vars (auth should work)

1. Restore `.env.local.backup` to `.env.local`
2. Clear cache: `rm -rf .next`
3. Restart: `npm run dev`
4. Visit `http://localhost:3000/api/auth/health` - **should return:**
   ```json
   {
     "ok": true,
     "missing": [],
     "envPresence": {
       "NEXTAUTH_URL": true,
       "NEXTAUTH_SECRET": true,
       "GOOGLE_CLIENT_ID": true,
       "GOOGLE_CLIENT_SECRET": true
     },
     "nodeEnv": "development"
   }
   ```
5. Visit `http://localhost:3000/api/auth/signin/google` - **should redirect to Google OAuth consent screen**

### Terminal logs to check

When dev server starts, you should see:
```
[auth] Environment variable status:
  NEXTAUTH_URL: SET
  NEXTAUTH_SECRET: SET
  GOOGLE_CLIENT_ID: SET
  GOOGLE_CLIENT_SECRET: SET
  DATABASE_URL: SET
```

When you visit `/api/auth/health`:
```
[auth-health] envPresence { NEXTAUTH_URL: 'SET', NEXTAUTH_SECRET: 'SET', ... }
```

## Quick checks

- `GET /api/auth/health`
- `GET /api/auth/signin/google`
