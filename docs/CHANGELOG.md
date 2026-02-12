# CHANGELOG
# Most recent entries at the top.

## [2026-02-12] - Profile Page Redesign

### Changed
- **Profile page** — redesigned to match Figma: profile header (avatar, name, email, joined date, bio, edit button), statistics grid (summaries read, minutes reading, podcasts following, summaries saved, day streak), following preview (2-col grid, max 4 shows with new episode counts), and recent reading history (last 5 saved episodes with progress bars)
- **Following list** — moved from `/profile` to `/profile/following` sub-page with back button to profile

### Files Created
- `app/(app)/profile/following/page.tsx`

### Files Modified
- `app/(app)/profile/page.tsx` — full rewrite with Figma-matching layout

## [2026-02-12] - Follow System + Feed Filters + Profile Page

### Added
- **Follow/Unfollow API** — `POST/DELETE/GET /api/shows/[channelId]/follow` using raw SQL + DEMO_USER_ID
- **Followed Shows API** — `GET /api/shows/followed` returns all followed shows with thumbnails and episode counts
- **FollowShowButton component** — `default` (pill with text) and `compact` (icon-only circle) variants
- **Feed filter dropdown** — 3 modes: Full Feed, Followed Only, Customised (with category pills)
- **Category pills** — markets, macro, technology, geopolitics, business — appear when Customised is selected
- **Feed API filtering** — `/api/feed?filter=followed|custom&category=markets` filters episodes by followed shows or category
- **Dashboard re-fetches** on filter/category change via CustomEvent (no page reload)
- **Empty states** — contextual messages when no followed shows or no category results
- **Profile/Following page** — replaces placeholder, shows all followed shows with unfollow buttons
- **Follow button on show cards** — compact follow button in ShowsCarousel on Discover page
- **`category` column on `shows` table** — seeded for all 9 existing shows

### Schema Changes
- `shows.category` column added (text, nullable)

### Files Created
- `app/api/shows/[channelId]/follow/route.ts`
- `app/api/shows/followed/route.ts`
- `app/components/FollowShowButton.tsx`
- `scripts/add-category-column.ts`

### Files Modified
- `db/schema.ts` — added `category` column to shows
- `app/api/feed/route.ts` — accepts `?filter=` and `?category=` params
- `app/(app)/dashboard/page.tsx` — listens for filter/category events, shows empty states
- `app/components/layout/FeedDropdown.tsx` — added category pills for Customised mode
- `app/(app)/profile/page.tsx` — replaced placeholder with Following page
- `app/(app)/discover/ShowsCarousel.tsx` — added compact follow button to show cards

## [2026-02-12] - Discover Search Feature

### Added
- Search API route (`/api/discover/search`) — searches shows by name, episodes by title + summary bullet text, people by name
- `DiscoverSearch` client component — expandable search icon in header, 300ms debounced, grouped dropdown results
- Dropdown shows Shows, Episodes, and People sections with thumbnails and metadata
- Escape key and outside click to close, correct navigation links for all result types

### Files Created
- `app/api/discover/search/route.ts`
- `app/(app)/discover/DiscoverSearch.tsx`

## [2026-02-12] - Deduplicate Carousels + Back Buttons

### Fixed
- Client-side dedup in ShowsCarousel, PeopleCarousel, RecentEpisodesStrip using Map keyed on id
- Eliminates duplicate key warnings regardless of what the SQL query returns

### Added
- Back button on episode detail page (`/episode/[id]`) → links to /discover
- Standardized back buttons on show detail and person detail pages → link to /discover
- All back buttons use consistent className with ArrowLeft icon from lucide-react

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
