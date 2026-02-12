# INNGEST FOLDER RULES
# Read this before editing any file in /inngest/

## WHAT THIS FOLDER DOES
Background job processing. All long-running tasks live here.
These functions run on Inngest's servers, NOT on Vercel.

## CRITICAL RULES

1. **Docker must be running** for yt-dlp to work locally
   - Check: `docker ps` 
   - Fix: Start Docker Desktop

2. **After any code change**, restart Inngest dev server
   - Kill: Ctrl+C in the Inngest terminal
   - Restart: `npx inngest-cli dev` 

3. **Never change step names** without migrating existing runs
   - Step names are used as idempotency keys
   - Renaming a step breaks in-progress runs

4. **Timeouts are set per step** - increase if a step is timing out
   - Default: 5 minutes
   - Download step: 10 minutes
   - Transcription: 15 minutes

5. **All steps must be idempotent** - safe to retry
   - Check if output exists before creating
   - Use step.run() for all async work

## KEY FILES
- `functions/processEpisode.ts` - Main ingestion pipeline
- `functions/generateDailyReport.ts` - Daily report cron
- `lib/ytdlp.ts` - YouTube audio download (uses Docker)
- `lib/transcribe.ts` - Deepgram transcription

## COMMON ERRORS
See: `/docs/MASTER-TROUBLESHOOTING-GUIDE.md` 
