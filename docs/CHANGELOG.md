# CHANGELOG
# Most recent entries at the top.

## [2026-02-15] - Predictions Tab Redesign - Categories, 2-Column Grid, Separate YES/NO Bars

### Added
- **Category filtering** — 6 categories: Geo-Politics, Economy, Technology, Markets, Trending, Breaking
- **3x2 category grid** — Icons + labels + market counts, active category highlighted in green
- **2-column market grid** — Compact cards showing 8 markets per category
- **Separate YES/NO bars** — Each market shows individual green YES bar and red NO bar with percentages
- **Smart categorization** — Markets auto-classified by keywords in question text
- **Breaking category** — Top 40% by 24h volume marked as "breaking"

### API Changes (app/api/panel/predictions/route.ts)
- Added `classifyMarket()` function with keyword matching for 5 categories
- Geo-politics: war, election, government, military, sanctions, etc.
- Economy: Fed, inflation, GDP, unemployment, recession, rates, etc.
- Technology: AI, crypto, Bitcoin, tech companies, blockchain, etc.
- Markets: stocks, earnings, IPO, bonds, commodities, etc.
- Trending: default fallback category
- Breaking: dynamically assigned based on 24h volume threshold (top 40%)
- Increased limit from 15 to 40 markets to populate all categories
- Each market now includes `category` field in response

### Component Changes (app/components/panel-tabs/PredictionsTab.tsx)
- Complete redesign matching Figma specifications
- Category filter grid at top (3 columns × 2 rows)
- Each category button shows: icon, label, market count
- Active category highlighted with green background (bg-green-500)
- Default category: Economy (most relevant for financial app)
- Markets displayed in 2-column grid (grid-cols-2)
- Shows up to 8 markets per category
- Each card has separate YES and NO bars (not combined)
- YES bar: green with percentage on right
- NO bar: red with percentage on right
- Empty state: "No {category} markets" with link to Trending
- Icons: Globe, BarChart2, Zap, TrendingUp, Flame, Radio (lucide-react)

### UX Improvements
- Click any category to filter markets instantly
- Category badges show count of available markets
- Compact 2-column layout fits more markets in viewport
- Separate bars make YES/NO probabilities clearer
- Hover states on category buttons and market cards
- Direct links to Polymarket for each market

### Technical Notes
- TypeScript: 0 compilation errors
- Category classification runs server-side for performance
- Breaking threshold: 60% of max 24h volume
- Markets sorted by volume within each category
- Filters applied client-side for instant switching

## [2026-02-15] - Fix Markets, Calendar, Predictions Tabs (Crypto Tickers, Free APIs, YES/NO UI)

### Fixed
- **Markets Tab** — Corrected crypto ticker format for Polygon API (BTC → X:BTCUSD, ETH → X:ETHUSD)
- **Calendar Tab** — Replaced premium economic calendar with free Finnhub earnings + hardcoded FOMC dates
- **Predictions Tab** — Switched to Gamma API with YES/NO probability bars instead of single percentage

### Markets Tab Changes
- Updated `app/api/panel/markets/route.ts` to use correct Polygon ticker format
- Stocks use direct ticker (SPY, QQQ, DIA, GLD, TLT)
- Crypto uses X: prefix (X:BTCUSD, X:ETHUSD)
- Added ETH to tracked instruments (7 total: SPY, QQQ, DIA, BTC, ETH, GLD, TLT)
- API now returns label and type fields, removed hardcoded TICKER_LABELS from component
- Updated `MarketsTab.tsx` to use label from API response

### Calendar Tab Changes
- Replaced premium Finnhub economic calendar endpoint (requires $50/month plan)
- Now uses free Finnhub earnings calendar + hardcoded 2026 FOMC meeting dates
- Earnings events show company symbol badges (blue pill)
- FOMC events marked as high impact (red dot)
- Updated `app/api/panel/calendar/route.ts` to fetch earnings and merge with Fed dates
- Updated `CalendarTab.tsx` to display symbol badges for earnings type events

### Predictions Tab Changes
- Switched from CLOB API to Gamma API (https://gamma-api.polymarket.com/markets)
- New YES/NO bar UI showing both probabilities side-by-side
- Green bar for YES probability, red bar for NO probability
- Percentages shown in bars (if ≥20% width) and below bars
- Updated `app/api/panel/predictions/route.ts` to parse outcomePrices JSON array
- Completely rewrote `PredictionsTab.tsx` with split YES/NO bar design
- Shows 24h volume in addition to total volume
- Direct links to market pages via m.url field

### Expected Results After Fix
- **Markets**: BTC shows ~$95,000+, ETH shows ~$2,500+, stocks show correct prices
- **Calendar**: Shows upcoming earnings reports + 2026 FOMC meeting dates (no premium API error)
- **Predictions**: Shows current 2024/2025 markets with YES/NO split bars (not old test markets)

### Technical Notes
- Cleared Next.js cache required after these changes (`rm -rf .next`)
- All three tabs now use free-tier or public APIs (no premium subscriptions needed)
- Calendar FOMC dates hardcoded for 2026, will need annual update
- Predictions Gamma API returns active markets sorted by 24h volume

## [2026-02-15] - Build Earnings, Calendar, Predictions, Tweets Panel Tabs

### Added
- **Earnings Tab** — Finnhub earnings calendar for AAPL, TSLA, NVDA, META, AMZN, SPY, QQQ, DIA
- **Calendar Tab** — Finnhub economic calendar, grouped by day with impact indicators
- **Predictions Tab** — Polymarket prediction markets with probability bars (no API key needed)
- **Tweets Tab** — RSS feeds from Reuters, Bloomberg, FT, CNBC, WSJ styled as tweet cards

### API Routes Created
- `app/api/panel/earnings/route.ts` — fetches upcoming earnings (next 90 days), filters to tracked tickers
- `app/api/panel/calendar/route.ts` — fetches economic events (next 2 weeks), sorted by date
- `app/api/panel/predictions/route.ts` — fetches Polymarket markets by volume, extracts YES token probability
- `app/api/panel/tweets/route.ts` — parses RSS XML from 5 financial news sources, interleaves results

### Components Updated
- `app/components/panel-tabs/EarningsTab.tsx` — shows earnings with ticker badges, dates, EPS estimates, beat/miss indicators
- `app/components/panel-tabs/CalendarTab.tsx` — groups events by day (Today/Tomorrow/date), impact dots (high/med/low), actual vs forecast
- `app/components/panel-tabs/PredictionsTab.tsx` — shows markets with probability circles, volume, progress bars, links to Polymarket
- `app/components/panel-tabs/TweetsTab.tsx` — shows news cards with source avatars, time ago, clickable links

### Features
- All tabs use `PanelSkeleton` for loading states
- All tabs show graceful error states with helpful messages
- Earnings: color-coded ticker badges, pre-market/after-close timing, beat/miss with trend icons
- Calendar: date grouping (Today/Tomorrow/weekday), impact indicators (red/amber/green), actual vs forecast comparison
- Predictions: probability-based coloring (green ≥70%, amber ≥40%, red <40%), volume formatting, progress bars
- Tweets: source-specific colors (Reuters orange, Bloomberg black, FT pink, CNBC blue, WSJ blue), time ago formatting

### Data Sources
- Earnings & Calendar: Finnhub API (requires `FINNHUB_API_KEY` env var)
- Predictions: Polymarket public API (no key needed)
- Tweets: RSS feeds (Reuters, Bloomberg, FT, CNBC, WSJ) - no auth needed

### Technical Notes
- All tabs fetch on mount via useEffect
- Earnings: filters to 8 tracked tickers, sorts by date, shows up to 15 results
- Calendar: filters to next 2 weeks, shows up to 20 events
- Predictions: top 15 markets by 24h volume, filters to markets with YES token probability
- Tweets: fetches 3 items per source, interleaves by publish date, shows up to 20 total
- RSS parsing: simple regex-based XML extraction with CDATA support
- All tabs cache API responses (earnings/calendar: 1h, predictions: 5min, tweets: 5min)

## [2026-02-15] - Panel Tabs at Bottom + Real Up Next & Random Suggestions

### Changed
- **Tab bar moved to bottom** — 6 live data tabs now fixed at bottom of panel (above Help & Support)
- **Up Next shows real episodes** — fetches 5 most recently published episodes from database
- **Suggestions show random hosts** — fetches 6 random hosts from shows table, randomized on each load
- **Removed hardcoded data** — replaced static demo data with live API calls

### Panel Layout (Final)
```
┌─────────────────────────┐
│ Up Next / Tab content   │ ← changes based on active tab
│                         │
│ Suggestions (if no tab) │
│                         │
├─────────────────────────┤
│ [NEWS][MARKETS][EARN]   │ ← tab bar FIXED at bottom
│ [CAL][PRED][TWEETS]     │
├─────────────────────────┤
│ Help & Support          │
└─────────────────────────┘
```

### API Routes Created
- `app/api/panel/up-next/route.ts` — fetches 5 latest published episodes with show info
- `app/api/panel/suggestions/route.ts` — fetches 6 random hosts (ORDER BY RANDOM())

### Components Created
- `app/components/panel-sections/UpNextSection.tsx` — client component with loading skeleton, links to episodes
- `app/components/panel-sections/SuggestionsSection.tsx` — client component with carousel navigation, styled initials fallback

### Files Modified
- `app/components/layout/RightRailClient.tsx` — moved tab bar to bottom, replaced hardcoded Up Next/Suggestions with new components

### Behavior
- Up Next: shows real episode thumbnails, titles, show names, dates
- Suggestions: random hosts on each load, carousel navigation (4 visible at a time)
- Tab bar: fixed at bottom, clicking tab replaces Up Next/Suggestions with live data
- Help & Support: always at bottom below tab bar

### Technical Notes
- Both sections fetch on mount via useEffect
- Up Next has loading skeleton (3 placeholder items)
- Suggestions use styled color-coded initials if no host image
- Tab bar stays fixed at bottom in both modes (default and tab active)

## [2026-02-15] - Restructure Panel - Tabs at Top Replace Up Next on Click

### Changed
- **Tab bar moved to top** — 6 live data tabs now appear at top of right panel (above Up Next)
- **Two-mode panel** — Default shows Up Next + Suggestions, clicking tab hides them and shows live data
- **Toggle behavior** — clicking active tab deactivates it and returns to Up Next/Suggestions
- **Tab state lifted** — moved from LiveDataPanel to RightRailClient for full panel control
- **LiveDataPanel removed** — tab logic now integrated directly into right panel component

### Panel Layout

**Mode 1 (Default - no tab active):**
```
Tab bar (small, inactive)
Up Next section
Suggestions section
Help & Support
```

**Mode 2 (Tab clicked):**
```
Tab bar (active tab highlighted)
Live data content (news/markets/etc.)
Help & Support
```

### Behavior
- Clicking a tab → hides Up Next/Suggestions, shows tab content
- Clicking same tab again → returns to Up Next/Suggestions
- Clicking different tab → switches directly to new tab content
- Help & Support always visible at bottom in both modes

### Files Modified
- `app/components/layout/RightRailClient.tsx` — added tab state, conditional rendering, moved tab bar to top
- Removed `LiveDataPanel` component usage (tab components imported directly)

### Technical Notes
- Tab state: `null` = default mode, `'news'|'markets'|etc.` = tab mode
- Toggle logic: `prev === id ? null : id` (click active tab to deactivate)
- Tab content remounts on click via `key` prop (triggers fresh data fetch)
- Instant switching, no animations

## [2026-02-15] - Live Data Panel with News and Markets Tabs

### Added
- **Live Data Panel** — new tabbed section in right panel below Suggestions
- **6 tabs** — NEWS, MARKETS, EARNINGS, CALENDAR, PREDICTIONS, TWEETS (3x2 grid layout)
- **News tab (Finnhub)** — displays top 10 financial news headlines with source, timestamp, and external links
- **Markets tab (Polygon)** — shows 6 key tickers (SPY, QQQ, DIA, BTC, GLD, TLT) with prices and % change
- **Placeholder tabs** — Earnings, Calendar, Predictions, Tweets show "Coming Soon" state
- **Smart refresh** — data fetches only when tab is clicked (no auto-refresh), uses key prop to remount components
- **Loading states** — animated skeleton while fetching data
- **Error states** — clear error messages if API keys are missing or requests fail

### API Routes Created
- `app/api/panel/news/route.ts` — Finnhub news API integration (5min cache)
- `app/api/panel/markets/route.ts` — Polygon market data API (previous day close)

### Components Created
- `app/components/LiveDataPanel.tsx` — main panel with tab state management
- `app/components/panel-tabs/PanelSkeleton.tsx` — shared loading skeleton
- `app/components/panel-tabs/NewsTab.tsx` — news feed with time-ago formatting
- `app/components/panel-tabs/MarketsTab.tsx` — market tickers with trend indicators
- `app/components/panel-tabs/EarningsTab.tsx` — placeholder
- `app/components/panel-tabs/CalendarTab.tsx` — placeholder
- `app/components/panel-tabs/PredictionsTab.tsx` — placeholder
- `app/components/panel-tabs/TweetsTab.tsx` — placeholder

### Files Modified
- `app/components/layout/RightRailClient.tsx` — integrated LiveDataPanel below Suggestions
- `.env.example` — added FINNHUB_API_KEY and POLYGON_API_KEY

### Technical Notes
- Tab switching is instant (no page reload)
- Each tab remounts on click via key prop, triggering fresh data fetch
- Uses semantic tokens throughout (bg-muted, text-foreground, etc.)
- Server-side caching: 5 minutes (300s revalidate)
- Finnhub: free tier available
- Polygon: paid API (free tier limited)

## [2026-02-15] - People Carousel Shows Real Headshots Only

### Changed
- **Host names updated** — Coin Bureau now shows "Guy Turner", Eurodollar University shows "Jeff Snider", All-In Podcast shows "All-In Pod"
- **Removed show thumbnail fallback** — people carousel and profile pages no longer use show logos as person photos
- **Styled initial fallback** — when no headshot is available, displays color-coded initial (e.g., "B" for Benjamin, "G" for Guy) with unique HSL color per person
- **Cleared wrong host images** — removed show thumbnails that were incorrectly copied as host images

### Database Changes
- Cleared all `host_image_url` values (were show thumbnails, not real headshots)
- Updated host names to reflect actual hosts (Guy Turner, Jeff Snider, etc.)
- All hosts now use NULL for `host_image_url` until real headshots are added via admin

### Files Modified
- `app/(app)/discover/PeopleCarousel.tsx` — removed `show_thumbnail` fallback, added color-coded initial
- `app/(app)/discover/page.tsx` — removed `show_thumbnail` from people query
- `app/(app)/discover/people/[slug]/page.tsx` — removed thumbnail fallback, added color-coded initial

### Files Created
- `scripts/fix-host-data.ts` — clears wrong images and updates host names
- `scripts/check-current-hosts.ts` — utility to check current host data

## [2026-02-15] - Fix Person Profile Page and People Carousel Images

### Fixed
- **Person profile page error** — removed non-existent `shows.slug` column from query, now uses `channel_id` for show links
- **People carousel images** — added `channel_thumbnail` as fallback when `host_image_url` is not set
- **Duplicate subtitles** — hide show name in people carousel when it matches the host name (e.g., "All-In Podcast" host of "All-In Podcast")
- **Image fallback logic** — person profile page now falls back to show thumbnail if host image is missing

### Files Modified
- `app/(app)/discover/people/[slug]/page.tsx` — fixed SQL query, added thumbnail fallback, added Mic2 icon
- `app/(app)/discover/page.tsx` — added `channel_thumbnail` to people query
- `app/(app)/discover/PeopleCarousel.tsx` — added image fallback logic, hide duplicate subtitles

### Files Created
- `scripts/update-host-images.ts` — utility to copy channel thumbnails to host_image_url

## [2026-02-15] - Build People Section from Show Hosts

### Added
- **Host fields to shows table** — `host_name`, `host_slug`, `host_image_url` columns added
- **Host data seeding** — all 9 existing shows seeded with appropriate host information
- **People carousel from hosts** — People section now reads from shows table instead of separate people table
- **Person profile pages** — `/discover/people/[slug]` shows host profile with name, photo, and link to their show
- **Host management in admin** — edit host name and image URL for each show in admin panel
- **Host API route** — `PATCH /api/admin/shows/[showId]/host` for updating host information

### Schema Changes
- Added `host_name`, `host_slug`, `host_image_url` columns to `shows` table

### Files Created
- `scripts/add-host-fields.ts` — adds host columns to shows table
- `scripts/check-shows.ts` — utility to check existing shows
- `scripts/seed-hosts.ts` — seeds host data for existing shows
- `app/(app)/discover/people/[slug]/page.tsx` — person profile page
- `app/api/admin/shows/[showId]/host/route.ts` — host update API

### Files Modified
- `db/schema.ts` — added host fields to shows table
- `app/(app)/discover/page.tsx` — updated people query to read from shows
- `app/(app)/discover/PeopleCarousel.tsx` — updated for new data shape
- `app/(app)/admin/shows/page.tsx` — added host fields to query
- `app/(app)/admin/shows/ShowRow.tsx` — added host management UI

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
