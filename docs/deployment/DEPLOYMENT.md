# Deployment Guide

This guide covers deploying SIMPLICITY-FINANCE to production environments.

---

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ database
- API keys for external services

---

## Required Environment Variables

### Database
```bash
DATABASE_URL=postgresql://user:password@host:5432/database_name
```
- Production PostgreSQL connection string
- Must be accessible from deployment environment
- Recommended: Use connection pooling (e.g., Supabase, Neon, Railway)

### Authentication (Placeholder - to be implemented in Milestone 3)
```bash
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com
```
- Generate secret: `openssl rand -base64 32`
- Required for session management

### External APIs
```bash
DEEPGRAM_API_KEY=your-deepgram-api-key
YOUTUBE_API_KEY=your-youtube-api-key
OPENAI_API_KEY=your-openai-api-key
```
- Deepgram: Audio transcription
- YouTube: Video metadata
- OpenAI: Summary generation

### Optional
```bash
NODE_ENV=production
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
```

---

## Deployment Steps

### 1. Database Setup

**Run migrations:**
```bash
npm run db:push
```

**Seed demo data (optional for staging):**
```bash
npm run db:seed:demo
```

**Production note:** Do NOT seed demo data in production. Use real data ingestion.

---

### 2. Build Application

```bash
npm run build
```

This creates an optimized production build in `.next/`.

---

### 3. Environment Configuration

**Vercel (Recommended):**
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

**Manual deployment:**
1. Set all environment variables
2. Run `npm run build`
3. Run `npm run start`

---

## Production Safety Checklist

### Before First Deploy

- [ ] All required environment variables set
- [ ] Database migrations applied
- [ ] Health check endpoint accessible (`/api/health`)
- [ ] `/dev/*` routes return 404 in production
- [ ] Admin auth configured (Milestone 3)
- [ ] API rate limits configured
- [ ] Error monitoring enabled

### After Deploy

- [ ] Health check returns 200 OK
- [ ] Dashboard loads without errors
- [ ] Search functionality works
- [ ] Episode detail pages render
- [ ] Admin pages require authentication
- [ ] No console errors in browser
- [ ] Database connections stable

---

## Health Check

**Endpoint:** `GET /api/health`

**Response (healthy):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T11:30:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

**Response (unhealthy):**
```json
{
  "status": "error",
  "timestamp": "2026-02-01T11:30:00.000Z",
  "database": "disconnected",
  "error": "Connection refused"
}
```

**Status codes:**
- `200 OK` - System healthy
- `503 Service Unavailable` - Database or critical service down

---

## Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SIMPLICITY-FINANCE/SIMPLICITY-FINANCE)

### Manual Setup

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Link project:**
   ```bash
   vercel link
   ```

3. **Set environment variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add DEEPGRAM_API_KEY
   vercel env add YOUTUBE_API_KEY
   vercel env add OPENAI_API_KEY
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

---

## Database Migrations

**Production migration workflow:**

1. Test migration locally:
   ```bash
   npm run db:push
   ```

2. Backup production database:
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

3. Apply migration to production:
   ```bash
   DATABASE_URL=<prod-url> npm run db:push
   ```

4. Verify migration:
   ```bash
   curl https://your-domain.com/api/health
   ```

**Rollback (if needed):**
```bash
psql $DATABASE_URL < backup.sql
```

---

## Monitoring

### Health Checks

Set up external monitoring to ping `/api/health` every 5 minutes:
- UptimeRobot
- Pingdom
- Vercel built-in monitoring

### Error Tracking

Recommended tools:
- Sentry (error tracking)
- LogRocket (session replay)
- Vercel Analytics (performance)

### Database Monitoring

Monitor:
- Connection pool usage
- Query performance
- Storage usage
- Active connections

---

## Troubleshooting

### Build Fails

**Error:** "Cannot find module"
- **Fix:** Run `npm ci` to install exact dependencies

**Error:** "Database connection failed"
- **Fix:** Verify `DATABASE_URL` is set and accessible

### Runtime Errors

**Error:** "NEXTAUTH_SECRET is not set"
- **Fix:** Add `NEXTAUTH_SECRET` environment variable

**Error:** "Failed to fetch episodes"
- **Fix:** Verify API keys are set correctly

### Performance Issues

**Slow page loads:**
- Check database query performance
- Enable Next.js caching
- Use CDN for static assets

**High memory usage:**
- Reduce PostgreSQL connection pool size
- Enable Next.js memory optimization

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Enable HTTPS** - Vercel provides this automatically
3. **Set secure headers** - Configure in `next.config.js`
4. **Rate limit APIs** - Prevent abuse (Milestone 5)
5. **Validate inputs** - Use Zod schemas
6. **Audit admin actions** - Log all admin operations

---

## Scaling Considerations

### Database
- Use connection pooling (PgBouncer)
- Add read replicas for heavy read workloads
- Index frequently queried columns

### Application
- Vercel auto-scales serverless functions
- Use Edge runtime for static pages
- Enable ISR (Incremental Static Regeneration)

### Storage
- Move large files to object storage (S3, R2)
- Use CDN for media delivery
- Implement caching strategy

---

## Support

- **Documentation:** `/docs` directory
- **Issues:** GitHub Issues
- **Health Status:** `/api/health`

---

**Last Updated:** 2026-02-01  
**Version:** 1.0.0
