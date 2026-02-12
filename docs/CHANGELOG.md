# CHANGELOG
# Most recent entries at the top.

## [2026-02-12] - Discover Page Improvements

### Fixed
- Deduplicated shows query — replaced FULL OUTER JOIN with simple GROUP BY on shows table
- Improved people empty state with informative message about how people get added

### Added
- "New This Week" section showing episodes added in the last 7 days (RecentEpisodesStrip.tsx)
- "NEW" badge on show cards with episodes within the last 7 days
- Relative date ("Today", "2d ago", "1w ago") on show cards showing last episode date
- Page header now shows live counts (e.g. "8 shows · Financial podcasts and expert commentary")

### Changed
- Reduced carousel gap from gap-3 to gap-2 to fit more cards on screen
- Reduced show card padding from px-2.5 py-2 to p-2

## [2026-02-12] - Admin Back Buttons

### Added
- Consistent back buttons on all admin pages using ArrowLeft icon from lucide-react
- Added to: approvals, ingest, reports, reports/generate, ops, shows, shows/new, shows/[id]/edit
- Standardized className: `inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6`
- Each page links to its logical parent (/admin, /admin/reports, /admin/shows)

## [2026-02-12] - Reports Pipeline Fix + Admin UI Redesign

### Fixed
- Null summary guard in all 4 report generators (daily, weekly, monthly, quarterly) — prevents "null value in column 'summary' violates not-null constraint" errors
- Summary value is now validated and trimmed before DB insert; throws descriptive error if AI returns empty

### Changed
- Redesigned admin report generation page (app/(app)/admin/reports/generate/page.tsx):
  - Contextual date options per report type (Yesterday/Today for daily, Last Week/This Week for weekly, etc.)
  - 3-step layout: Report Type → Date Range → Generate
  - Progress bar with animated feedback
  - Lucide icons for status indicators
  - Semantic color tokens (bg-card, border-border, text-foreground, text-muted-foreground)
  - Removed redundant nav bar and preview section for cleaner UX

## [2026-02-12]

### Added
- AI rules system (.windsurf/rules.md)
- Documentation structure (docs/PRD.md, docs/CHANGELOG.md)
- Folder-specific rules (inngest/RULES.md, app/api/RULES.md, db/RULES.md)
- Shared database connection module (app/lib/db.ts)

### Removed
- Root-level session summary files (7 files)
- Empty placeholder folders (components/, server/, types/)
- Debug/test pages (app/debug/, app/test-auth/)
- Debug/test API routes (test-db, test-user, saved/debug, saved-episodes)
- Dead code (scheduledIngest.ts, FollowButton.tsx, add-admin-indexes.js)
- Duplicate env file (env.local.example)
- helloWorld stub from Inngest functions
- Debug timing logs from auth.ts and admin/page.tsx

### Changed
- .env.example: renamed AUTH_SECRET → NEXTAUTH_SECRET, added FAL_KEY and ALLOW_PROD_DB_WRITE
- Moved misplaced files: lib/feed-helpers.ts → app/lib/, lib/savedNotesStore.ts → app/lib/, hooks/useSavedNotes.ts → app/hooks/, app/lib/actions.ts → app/lib/actions/saved.ts
- Report pages: replaced hardcoded gray/white colors with semantic tokens (bg-background, bg-card, text-foreground, text-muted-foreground, border-border)
- 50 files: replaced inline postgres connections with shared app/lib/db.ts import

---

## [2026-02-10]

### Added
- Weekly, monthly, quarterly report generation
- Admin manual report generation interface
- Real-time notification system (bell icon + dropdown)
- NotificationDropdown component with portal rendering

### Fixed
- Episode download now uses Docker yt-dlp (version 2026.02.04)
- Database write safety check (added ALLOW_PROD_DB_WRITE=1)
- Notification dropdown cutoff (added DropdownMenuPortal)

### Changed
- Discover page redesigned: tabs → single page with carousels
- Report page redesigned: added weekly/monthly/quarterly tabs

---

## TEMPLATE FOR NEW ENTRIES:

## [YYYY-MM-DD]

### Added
- [Feature name] - [one line description]

### Fixed
- [Bug] - [what was wrong and how fixed]

### Changed
- [Component] - [what changed and why]

### Removed
- [Feature] - [why removed]
