# API ROUTES RULES
# Read this before editing any file in /app/api/

## WHAT THIS FOLDER DOES
Next.js API routes. Handles webhooks, data fetching, and mutations.

## CRITICAL RULES

1. **Inngest endpoint** (`/api/inngest`) - DO NOT TOUCH
   - This is the webhook Inngest calls to execute functions
   - Breaking this stops all background processing

2. **All routes must handle errors gracefully**
   - Return { error: string } with appropriate status code
   - Never return raw error objects (security risk)

3. **Authentication check** on all non-public routes
   - Check session before returning data
   - 401 if not authenticated

4. **Rate limiting** on expensive endpoints
   - /api/admin/* routes should verify admin status

## ROUTE INVENTORY
- POST /api/inngest - Inngest webhook (DO NOT TOUCH)
- GET /api/notifications - Get user notifications
- POST /api/notifications/[id]/read - Mark notification read
- POST /api/notifications/mark-all-read - Mark all read
- POST /api/admin/reports/preview - Preview episodes for report
- POST /api/admin/ingest/submit - Submit YouTube URL
