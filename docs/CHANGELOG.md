# CHANGELOG
# Most recent entries at the top.

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
