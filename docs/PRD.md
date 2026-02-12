# SIMPLICITY FINANCE - PRODUCT REQUIREMENTS DOCUMENT
# Last Updated: 2026-02-12

## WHAT THIS APP DOES
Simplicity Finance ingests financial podcast episodes from YouTube,
transcribes them with AI, generates structured summaries, and surfaces
insights through reports and a discovery interface.

## CORE FEATURES

### 1. Episode Ingestion Pipeline
- User submits YouTube URL via admin panel
- Inngest processes in background (8 steps)
- Steps: mark-running → fetch-metadata → download-audio → transcribe →
         generate-summary → qc-checks → persist-to-db → create-notification
- Status: ✅ Working

### 2. Discover Page
- Shows horizontal carousels: Shows + People
- Real data from database
- Navigation arrows, hover effects
- Status: ✅ Working

### 3. Reports System
- Daily reports (6am UTC cron)
- Weekly reports (Monday 6am)
- Monthly reports (1st of month)
- Quarterly reports (first Monday of quarter)
- Status: ✅ Implemented

### 4. Notification System
- Bell icon with unread count
- Dropdown showing episode + report notifications
- Mark as read / mark all read
- Status: ✅ Implemented

### 5. Admin Panel
- Submit YouTube URLs
- Manual report generation
- Preview episodes in date range
- Status: ✅ Working

## DATABASE TABLES
- episodes
- transcript_segments_raw
- episode_summary
- summary_bullets
- qc_runs
- daily_reports / weekly_reports / monthly_reports / quarterly_reports
- ingest_requests
- notifications
- shows
- people
- episode_people

## KNOWN LIMITATIONS
- yt-dlp requires Docker on macOS (standalone binary outdated)
- ALLOW_PROD_DB_WRITE=1 required for Supabase writes in dev
- Reports require episodes in the relevant time period to generate

## NOT YET BUILT
- User authentication (currently single-user)
- Search functionality
- Mobile app
