# Authentication Setup Guide

SIMPLICITY FINANCE uses NextAuth.js v5 with Google OAuth for authentication.

---

## Overview

**Authentication Provider:** NextAuth.js v5  
**OAuth Provider:** Google  
**Session Storage:** JWT (stateless)  
**Admin Gating:** Database role-based (`users.role`)

---

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Simplicity Finance
   - Support email: your-email@example.com
   - Authorized domains: your-domain.com
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Simplicity Finance Web
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)

### 2. Set Environment Variables

Add to `.env.local` (development) or deployment environment (production):

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000  # or https://your-domain.com
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## How It Works

### Authentication Flow

1. User visits protected route (e.g., `/admin`)
2. Middleware checks for valid session
3. If no session, redirect to `/auth/signin`
4. User clicks "Sign in with Google"
5. Google OAuth flow completes
6. NextAuth creates user in database (if new)
7. Session created with user role from database
8. User redirected to original destination

### User Creation

On first sign-in:
- User record created in `users` table
- Default role: `user`
- Email and name stored from Google profile

### Admin Access

Admin routes (`/admin/*`) require:
1. Valid NextAuth session
2. User role = `admin` in database

To make a user admin:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## File Structure

```
auth.ts                              # NextAuth configuration
auth.config.ts                       # Auth config with Google provider
app/api/auth/[...nextauth]/route.ts  # NextAuth API routes
app/auth/signin/page.tsx             # Sign-in page
app/lib/auth.ts                      # Helper functions (getCurrentUser, requireAdmin)
middleware.ts                        # Route protection
```

---

## Key Functions

### `getCurrentUser()`

Returns current user from session:

```typescript
import { getCurrentUser } from '@/app/lib/auth';

const user = await getCurrentUser();
if (user) {
  console.log(user.email, user.role);
}
```

### `requireAdmin()`

Protects admin routes:

```typescript
import { requireAdmin } from '@/app/lib/auth';

export default async function AdminPage() {
  const user = await requireAdmin(); // Redirects if not admin
  return <div>Welcome, {user.name}</div>;
}
```

### `auth()`

Get session in server components:

```typescript
import { auth } from '@/auth';

const session = await auth();
if (session?.user) {
  console.log('Logged in:', session.user.email);
}
```

---

## Development vs Production

### Development

- `/dev/login` route available for quick testing
- Sets cookie to simulate authentication
- Bypasses Google OAuth
- **Blocked in production** via middleware

### Production

- `/dev/login` returns 404
- Only Google OAuth available
- Secure session cookies
- HTTPS required

---

## Testing Authentication

### Local Development

1. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
2. Start dev server: `npm run dev`
3. Visit: http://localhost:3000/auth/signin
4. Sign in with Google
5. Check database: `SELECT * FROM users;`

### Make User Admin

```bash
# Connect to database
psql $DATABASE_URL

# Promote user to admin
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Test Admin Access

1. Visit: http://localhost:3000/admin
2. Should redirect to sign-in if not logged in
3. Should redirect to `/unauthorized` if not admin
4. Should show admin dashboard if admin

---

## Troubleshooting

### "NEXTAUTH_SECRET is not set"

**Fix:** Add `NEXTAUTH_SECRET` to environment variables:
```bash
openssl rand -base64 32
```

### "Redirect URI mismatch"

**Fix:** Add exact redirect URI to Google OAuth settings:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.com/api/auth/callback/google`

### "User not found in database"

**Fix:** User should be auto-created on first sign-in. Check:
1. Database connection working
2. `users` table exists
3. Check server logs for errors

### "Access denied" after sign-in

**Fix:** Check user role in database:
```sql
SELECT email, role FROM users WHERE email = 'your-email@example.com';
```

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use HTTPS in production** - Required for secure cookies
3. **Rotate NEXTAUTH_SECRET** - Change periodically
4. **Limit OAuth scopes** - Only request email and profile
5. **Audit admin actions** - Log all admin operations
6. **Monitor failed logins** - Track authentication attempts

---

## Migration from Dev Auth

If migrating from `/dev/login` cookie auth:

1. Clear all cookies: `document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"));`
2. Sign in with Google OAuth
3. Verify user created in database
4. Update role to admin if needed

---

## API Routes

### Sign In
```
POST /api/auth/signin/google
```

### Sign Out
```
POST /api/auth/signout
```

### Session
```
GET /api/auth/session
```

### CSRF Token
```
GET /api/auth/csrf
```

---

**Last Updated:** 2026-02-01  
**NextAuth Version:** 5.0.0-beta.30
