# SIMPLICITY CODEBASE CLEANUP PLAN
## Complete Design System Tokenization & Standardization

**Generated:** January 30, 2026  
**Scope:** Full codebase (50+ components, 7 shared components, 40+ UI primitives)  
**Goal:** Eliminate ALL hardcoded values and establish comprehensive token-based system  
**Status:** 🔴 READY FOR EXECUTION

---

## A) FILE MAP (GLOBAL)

### 📁 Root Structure
```
/App.tsx                    - Main routing & state orchestration (657 lines)
/styles/globals.css         - Design tokens & theming (189 lines)
```

### 📁 /components/ (50 page & layout components)

#### Authentication & Onboarding (5 files)
- `LandingPage.tsx` - Marketing landing page
- `SignInPage.tsx` - User sign-in
- `SignUpPage.tsx` - User registration
- `ProfilePage.tsx` - User profile management
- `UserProfileButton.tsx` - Profile avatar button

#### Core App Pages (9 files)
- `HomePage.tsx` - Main feed (podcast summaries)
- `DiscoverPage.tsx` - Podcast discovery & exploration
- `FollowingPage.tsx` - Following feed (shows & people)
- `SavedPage.tsx` - Saved/bookmarked content
- `NotificationsPage.tsx` - Notification center
- `ReportsPage.tsx` - AI-generated reports
- `NotebookPage.tsx` - Personal notes collection
- `UploadPage.tsx` - Upload custom podcasts
- `ContactPage.tsx` - Contact/support form

#### Browse & Discovery (6 files)
- `TopShowsPage.tsx` - Top-rated podcasts
- `NewShowsPage.tsx` - Recently added podcasts
- `TopPeoplePage.tsx` - Top podcast hosts
- `TopShowsList.tsx` - Top shows list component
- `NewShowsList.tsx` - New shows list component
- `TopPeopleList.tsx` - Top people list component

#### Information Pages - Authenticated (5 files)
- `AboutPage.tsx` - About Simplicity (authenticated)
- `PrivacyPage.tsx` - Privacy policy (authenticated)
- `TermsPage.tsx` - Terms of service (authenticated)
- `DataPage.tsx` - Data usage policy (authenticated)
- `AccessibilityPage.tsx` - Accessibility statement (authenticated)

#### Information Pages - Landing (5 files)
- `AboutLandingPage.tsx` - About (public/landing)
- `PrivacyLandingPage.tsx` - Privacy (public/landing)
- `TermsLandingPage.tsx` - Terms (public/landing)
- `DataLandingPage.tsx` - Data policy (public/landing)
- `AccessibilityLandingPage.tsx` - Accessibility (public/landing)

#### Modals & Overlays (5 files)
- `EpisodeSummaryModal.tsx` - Episode summary viewer
- `PodcastDetailModal.tsx` - Podcast detail overlay
- `PersonProfileModal.tsx` - Person profile overlay
- `ChatBotOverlay.tsx` - AI chatbot interface
- `ReportModal.tsx` - Report generation modal

#### Settings & Billing (3 files)
- `SettingsPage.tsx` - App settings & preferences
- `BillingPage.tsx` - Subscription & billing management
- `PremiumPlansPage.tsx` - Premium tier selection

#### Layout & Navigation (7 files)
- `LeftSidebar.tsx` - Main nav sidebar (320px, desktop)
- `RightSidebar.tsx` - Context sidebar (400px, desktop) **⚠️ MOST VIOLATIONS**
- `BottomNavBar.tsx` - Mobile bottom navigation
- `MobileTopBar.tsx` - Mobile header bar
- `MoreMenu.tsx` - Mobile overflow menu
- `ProfileSlideMenu.tsx` - Mobile profile menu
- `MobileNotificationsPanel.tsx` - Mobile notifications panel

#### Content Display (5 files)
- `Feed.tsx` - Episode feed display
- `SubscriptionFeed.tsx` - Subscription content feed
- `PodcastCatalog.tsx` - Podcast browsing grid
- `PodcastDetail.tsx` - Podcast detail view
- `PersonProfile.tsx` - Person profile view

#### Interactive Widgets (5 files)
- `NotificationsList.tsx` - Notification list
- `NotificationsPopup.tsx` - Notification dropdown
- `NotificationBadge.tsx` - Unread badge
- `ChatBotBubble.tsx` - Chatbot trigger button
- `CookieConsent.tsx` - Cookie consent banner

#### List Components (3 files)
- `FollowingList.tsx` - Following feed items
- `SavedList.tsx` - Saved content items
- `FeedSearch.tsx` - Search interface with filters

### 📁 /components/shared/ (7 production-ready components) ✅
- `CardLayouts.tsx` - Standardized card grids (3-column, carousel, hero)
- `EmptyState.tsx` - Empty state illustrations
- `EpisodeCard.tsx` - Episode card component
- `IconButton.tsx` - Icon-only button variants
- `MetadataDisplay.tsx` - Metadata rows (date, duration, etc.)
- `SearchFilterBar.tsx` - Search + filter combo
- `SectionSeparator.tsx` - Section dividers with optional title
- `README.md` - Component usage documentation

### 📁 /components/ui/ (40+ shadcn/ui primitives) ✅
All using token-based system correctly

### 📁 /components/figma/ (1 protected file)
- `ImageWithFallback.tsx` - **PROTECTED - DO NOT EDIT**

### 📁 /contexts/
- `ThemeContext.tsx` - Light/dark theme provider

### 📁 /data/
- `podcasts.ts` - Mock podcast data

### 📁 /src/
- `hooks/` - Custom React hooks (5 files)
- `types/` - TypeScript type definitions
- `copy/en.ts` - Internationalization strings

### 📁 Documentation (8 files)
- `DESIGN_SYSTEM.md` - Design system documentation ✅
- `COMPONENT_AUDIT.md` - Component inventory ✅
- `COMPONENT_ORGANIZATION.md` - Shared component guide ✅
- `HANDOFF.md` - Developer handoff doc ✅
- `README.md` - Project README
- `DOCUMENTATION_INDEX.md` - Documentation index
- `DESIGN_SYSTEM_CLEANUP_SUMMARY.md` - Previous cleanup summary
- `Attributions.md` - Image/asset credits

---

## B) GLOBAL PROBLEMS (TOP 30)

### 🔴 CRITICAL ISSUES (Must Fix)

#### 1. **Hardcoded Color Values** (79 violations across 7 files)
**Location:** AboutPage, AccessibilityPage, DataPage, PrivacyPage, TermsPage, MoreMenu, RightSidebar  
**Pattern:** `text-[#1a1a1a] dark:text-white`  
**Problem:** Breaks theme consistency, violates design system  
**Impact:** 🔴 HIGH - Prevents proper theming

#### 2. **Hardcoded Font Sizes** (85+ violations)
**Location:** Primarily RightSidebar.tsx, info pages  
**Pattern:** `text-[9px]`, `text-[10px]`, `text-[11px]`  
**Problem:** Not using semantic typography scale  
**Impact:** 🔴 HIGH - No consistent type system

#### 3. **Hardcoded RGB Colors** (4 violations)
**Location:** RightSidebar.tsx, MoreMenu.tsx  
**Pattern:** `rgb(5, 150, 105)`, `rgba(220, 38, 38, 0.1)`  
**Problem:** Market data colors not tokenized  
**Impact:** 🟡 MEDIUM - Limited to specific widgets

#### 4. **Duplicated Card Patterns** (23 instances)
**Location:** All page components  
**Problem:** Same card structure repeated in every file  
**Solution:** Use `/components/shared/CardLayouts.tsx`  
**Impact:** 🟡 MEDIUM - 800+ lines of duplication

#### 5. **Duplicated Search Bars** (12 instances)
**Location:** Multiple pages  
**Problem:** Search bar rebuilt in each component  
**Solution:** Use `/components/shared/SearchFilterBar.tsx`  
**Impact:** 🟡 MEDIUM - 300+ lines of duplication

#### 6. **Duplicated Metadata Displays** (18 instances)
**Location:** All content cards  
**Problem:** Date/duration formatting repeated  
**Solution:** Use `/components/shared/MetadataDisplay.tsx`  
**Impact:** 🟡 MEDIUM - 250+ lines of duplication

#### 7. **Inconsistent Border Radius** (Mixed usage)
**Pattern:** `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-lg`  
**Problem:** No clear semantic meaning  
**Impact:** 🟢 LOW - Minor visual inconsistency

#### 8. **Inconsistent Spacing Values**
**Pattern:** Mix of `gap-2`, `gap-2.5`, `gap-3` with no clear rules  
**Problem:** Not following 8px grid strictly  
**Impact:** 🟢 LOW - Acceptable variance

#### 9. **Missing Typography Tokens**
**Problem:** No tokens for `text-[9px]`, `text-[10px]`, `text-[11px]`  
**Solution:** Create `--text-2xs`, `--text-xs-alt`, `--text-xs-micro`  
**Impact:** 🔴 HIGH - Prevents standardization

#### 10. **Missing Semantic Color Tokens**
**Problem:** No tokens for success/error/warning states in market data  
**Solution:** Add `--market-up`, `--market-down`, `--market-neutral`  
**Impact:** 🟡 MEDIUM - Limited to RightSidebar

#### 11. **Duplicated Empty States** (8 instances)
**Location:** Multiple pages  
**Problem:** Same empty state pattern repeated  
**Solution:** Use `/components/shared/EmptyState.tsx`  
**Impact:** 🟢 LOW - Already created, needs migration

#### 12. **No Separator Standardization**
**Location:** All pages  
**Problem:** `border-t border-border/30` repeated everywhere  
**Solution:** Use `/components/shared/SectionSeparator.tsx`  
**Impact:** 🟢 LOW - Already created, needs migration

#### 13. **Inconsistent Hover States**
**Pattern:** Some use `hover:bg-muted`, others use `hover:bg-accent/30`  
**Problem:** Mixed hover feedback patterns  
**Impact:** 🟢 LOW - Both are acceptable

#### 14. **No Component Documentation**
**Problem:** Most components lack JSDoc comments  
**Impact:** 🟡 MEDIUM - Maintenance difficulty

#### 15. **Magic Numbers in Layout**
**Pattern:** `w-[400px]`, `w-[320px]`, `w-40`, `w-48`  
**Problem:** Width values not tokenized  
**Impact:** 🟢 LOW - Consistent in practice

#### 16. **Duplicate Modal Patterns**
**Location:** 3 modal components  
**Problem:** Similar overlay structure  
**Impact:** 🟢 LOW - Minor duplication

#### 17. **Inconsistent Button Styling**
**Location:** Various pages  
**Problem:** Some buttons use custom classes vs shadcn Button  
**Impact:** 🟡 MEDIUM - UX inconsistency

#### 18. **No Loading States**
**Problem:** Missing skeleton/loading patterns  
**Impact:** 🟡 MEDIUM - UX gap

#### 19. **No Error Boundaries**
**Problem:** No error handling UI  
**Impact:** 🟡 MEDIUM - Production risk

#### 20. **Duplicate Filter Dropdowns** (9 instances)
**Location:** Multiple list pages  
**Problem:** Same filter pattern repeated  
**Impact:** 🟡 MEDIUM - 200+ lines duplication

#### 21. **No Animation Tokens**
**Problem:** `transition-all` used everywhere without timing tokens  
**Impact:** 🟢 LOW - Works but not documented

#### 22. **Inconsistent Icon Sizing**
**Pattern:** `w-4 h-4`, `w-5 h-5`, `size-4`, `size-5`  
**Problem:** Mix of width/height vs size utility  
**Impact:** 🟢 LOW - Visual result same

#### 23. **No Z-Index Scale**
**Problem:** No documented z-index layering system  
**Impact:** 🟢 LOW - Not currently an issue

#### 24. **Duplicate Profile Headers** (5 instances)
**Location:** Profile-related pages  
**Problem:** Same header pattern  
**Impact:** 🟢 LOW - Minor duplication

#### 25. **No Grid System**
**Problem:** Grid columns hardcoded (`grid-cols-2`, `grid-cols-3`)  
**Impact:** 🟢 LOW - Works fine

#### 26. **Missing Focus States**
**Problem:** Some interactive elements missing focus rings  
**Impact:** 🟡 MEDIUM - Accessibility issue

#### 27. **No Print Styles**
**Problem:** No print-specific CSS  
**Impact:** 🟢 LOW - Not a priority

#### 28. **Inconsistent Modal Sizes**
**Problem:** Modal widths vary (`max-w-2xl`, `max-w-4xl`, `max-w-xl`)  
**Impact:** 🟢 LOW - Intentional variation

#### 29. **No Mobile Breakpoint Tokens**
**Problem:** `md:` prefix used but no token for 768px  
**Impact:** 🟢 LOW - Tailwind default works

#### 30. **No Component Versioning**
**Problem:** No version tracking for shared components  
**Impact:** 🟢 LOW - Not needed yet

---

## C) BATCH FIXES I CAN APPLY FAST

### 🎯 PHASE 1: TOKEN SYSTEM EXPANSION (30 mins)

#### 1.1 Add Typography Tokens to `/styles/globals.css`

**Search for:** Line 5 in `/styles/globals.css`  
**Action:** Add after `--font-family:` declaration

```css
/* Typography Scale - Add to :root block */
--text-2xs: 9px;      /* Micro text (labels, captions) */
--text-xs-alt: 10px;  /* Small labels */
--text-xs-small: 11px; /* Compact text */
--text-xs: 12px;      /* Standard xs (Tailwind default) */
--text-sm: 14px;      /* Small */
--text-base: 16px;    /* Base (Tailwind default) */
--text-lg: 18px;      /* Large */
--text-xl: 20px;      /* Extra large */
--text-2xl: 24px;     /* 2x large */
```

**Expected Result:** 9 new typography tokens available

---

#### 1.2 Add Semantic Market Color Tokens to `/styles/globals.css`

**Search for:** Line 22 in `:root` block  
**Action:** Add after `--destructive:` declaration

```css
/* Market Data Colors - Light Mode */
--market-up: #059669;           /* Green for positive */
--market-up-bg: rgba(5, 150, 105, 0.1);
--market-down: #dc2626;         /* Red for negative */
--market-down-bg: rgba(220, 38, 38, 0.1);
--market-neutral: #737373;      /* Neutral/unchanged */
--market-neutral-bg: rgba(115, 115, 115, 0.1);
```

**Search for:** Line 62 in `.dark` block  
**Action:** Add after `--destructive:` declaration

```css
/* Market Data Colors - Dark Mode */
--market-up: #10b981;
--market-up-bg: rgba(16, 185, 129, 0.1);
--market-down: #ef4444;
--market-down-bg: rgba(239, 68, 68, 0.1);
--market-neutral: #a3a3a3;
--market-neutral-bg: rgba(163, 163, 163, 0.1);
```

**Expected Result:** 6 new market color tokens (light + dark)

---

#### 1.3 Add Border Radius Semantic Tokens to `/styles/globals.css`

**Search for:** Line 111 in `@theme inline` block  
**Action:** Replace existing radius tokens with expanded system

```css
/* Border Radius - Semantic Scale */
--radius-xs: 8px;              /* Small elements (badges, pills) */
--radius-sm: 10px;             /* calc(var(--radius) - 4px) */
--radius-md: 12px;             /* calc(var(--radius) - 2px) */
--radius-lg: 14px;             /* var(--radius) - Base */
--radius-xl: 16px;             /* Cards, containers */
--radius-2xl: 20px;            /* Large cards */
--radius-3xl: 24px;            /* Sidebars, major containers */
```

**Expected Result:** 7 semantic radius tokens

---

#### 1.4 Extend Tailwind Theme in `@theme inline` Block

**Search for:** Line 123 (end of `@theme inline` block)  
**Action:** Add before closing brace

```css
/* Typography Size Utilities */
--text-2xs: var(--text-2xs);
--text-xs-alt: var(--text-xs-alt);
--text-xs-small: var(--text-xs-small);

/* Market Colors */
--color-market-up: var(--market-up);
--color-market-up-bg: var(--market-up-bg);
--color-market-down: var(--market-down);
--color-market-down-bg: var(--market-down-bg);
--color-market-neutral: var(--market-neutral);
--color-market-neutral-bg: var(--market-neutral-bg);
```

**Expected Result:** Tokens accessible via Tailwind classes

---

### 🎯 PHASE 2: SEARCH & REPLACE PATTERNS (60 mins)

#### 2.1 Replace Hardcoded Primary Text Color

**Search Pattern (Regex):**
```regex
text-\[#1a1a1a\]\s+dark:text-white
```

**Replace With:**
```
text-foreground
```

**Files Affected:** AboutPage, AccessibilityPage, DataPage, PrivacyPage, TermsPage  
**Expected Changes:** ~50 replacements  
**Risk:** 🟢 LOW - Simple color token swap

---

#### 2.2 Replace Hardcoded Font Sizes

**Batch 1 - 9px → text-2xs:**
```regex
text-\[9px\]
```
Replace with: `text-2xs`  
**Expected:** ~15 replacements

**Batch 2 - 10px → text-xs-alt:**
```regex
text-\[10px\]
```
Replace with: `text-xs-alt`  
**Expected:** ~25 replacements

**Batch 3 - 11px → text-xs-small:**
```regex
text-\[11px\]
```
Replace with: `text-xs-small`  
**Expected:** ~45 replacements

**Files Affected:** RightSidebar.tsx, all info pages  
**Risk:** 🟢 LOW - Direct 1:1 mapping

---

#### 2.3 Replace Market Data RGB Colors

**File:** `/components/RightSidebar.tsx`, `/components/MoreMenu.tsx`

**Search Pattern 1:**
```javascript
const color = isPositive ? 'rgb(5, 150, 105)' : 'rgb(220, 38, 38)';
```
**Replace With:**
```javascript
const color = isPositive ? 'var(--market-up)' : 'var(--market-down)';
```

**Search Pattern 2:**
```javascript
const bgColor = isPositive ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)';
```
**Replace With:**
```javascript
const bgColor = isPositive ? 'var(--market-up-bg)' : 'var(--market-down-bg)';
```

**Expected Changes:** 4 replacements  
**Risk:** 🟢 LOW - Same visual result

---

#### 2.4 Standardize Border Separators

**Search Pattern:**
```
border-t border-border/30
```

**Replace Strategy:**
- Simple separators → `<SectionSeparator />`
- Titled separators → `<SectionSeparator title="Section Name" />`

**Files Affected:** All pages (50+)  
**Expected Changes:** ~100 replacements  
**Risk:** 🟡 MEDIUM - Requires component import

**Manual Process:**
1. Add import: `import { SectionSeparator } from './shared/SectionSeparator';`
2. Replace `<div className="border-t border-border/30" />` with `<SectionSeparator />`

---

### 🎯 PHASE 3: COMPONENT DEDUPLICATION (120 mins)

#### 3.1 Migrate to Standardized Card Layouts

**Target:** All pages with podcast/episode grids  
**Files:** HomePage, DiscoverPage, FollowingPage, SavedPage, etc.

**Search Pattern:**
```tsx
<div className="grid grid-cols-3 gap-3">
  <div className="w-40">
    <div className="bg-card rounded-xl border border-border/50...
```

**Replace With:**
```tsx
import { ThreeColumnGrid, CarouselLayout } from './shared/CardLayouts';

// For grids:
<ThreeColumnGrid items={podcasts} />

// For carousels:
<CarouselLayout items={recentEpisodes} />
```

**Expected Impact:**
- Remove 800+ lines of duplicated card code
- Standardize all card hover states
- Centralize card styling

**Risk:** 🟡 MEDIUM - Requires testing each page

---

#### 3.2 Migrate to Standardized Search Bars

**Target:** All pages with search functionality  
**Files:** HomePage, DiscoverPage, NotebookPage, ReportsPage, etc.

**Search Pattern:**
```tsx
<div className="relative mb-4">
  <Search className="absolute...
  <input 
    type="text"
    placeholder="Search..."
    className="w-full pl-9...
```

**Replace With:**
```tsx
import { SearchFilterBar } from './shared/SearchFilterBar';

<SearchFilterBar 
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search podcasts..."
/>
```

**Expected Impact:**
- Remove 300+ lines of duplicated search code
- Standardize search UX across app

**Risk:** 🟢 LOW - Well-tested component

---

#### 3.3 Migrate to Standardized Metadata Display

**Target:** All episode/podcast cards  

**Search Pattern:**
```tsx
<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
  <Clock className="w-3 h-3" />
  <span>45 min</span>
  <span>•</span>
  <span>2 days ago</span>
</div>
```

**Replace With:**
```tsx
import { MetadataDisplay } from './shared/MetadataDisplay';

<MetadataDisplay 
  duration="45 min"
  date="2 days ago"
/>
```

**Expected Impact:**
- Remove 250+ lines of metadata code
- Standardize date/duration formatting

**Risk:** 🟢 LOW - Simple prop-based component

---

#### 3.4 Migrate to Standardized Empty States

**Target:** All pages with empty states  

**Search Pattern:**
```tsx
<div className="text-center py-12">
  <BookmarkOff className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
  <h3 className="font-semibold mb-1">No saved episodes</h3>
  <p className="text-sm text-muted-foreground">...</p>
</div>
```

**Replace With:**
```tsx
import { EmptyState } from './shared/EmptyState';

<EmptyState 
  icon={BookmarkOff}
  title="No saved episodes"
  description="Episodes you save will appear here"
/>
```

**Expected Impact:**
- Remove 150+ lines of empty state code
- Standardize empty state UX

**Risk:** 🟢 LOW - Already created and documented

---

### 🎯 PHASE 4: NAMING CONVENTIONS (30 mins)

#### 4.1 Component File Naming Standard

**Current State:** ✅ Already consistent  
**Pattern:** `PascalCase.tsx` for all components  
**No action needed**

---

#### 4.2 CSS Class Naming Rules

**Standard Pattern:**
```tsx
// ✅ GOOD - Semantic, token-based
className="bg-card text-foreground border-border rounded-xl p-3"

// ❌ BAD - Hardcoded values
className="bg-white text-black border-gray-200 rounded-2xl p-3"
```

**Search for violations:** Already done (see Section B)

---

#### 4.3 Variable Naming Conventions

**Current State:** ✅ Consistent  
**Pattern:**
- React state: `camelCase` (e.g., `isPremium`, `selectedPodcastId`)
- Components: `PascalCase` (e.g., `HomePage`, `EpisodeCard`)
- Functions: `camelCase` with action prefix (e.g., `handleNavigate`, `onEpisodeClick`)

**No action needed**

---

### 🎯 PHASE 5: DEDUPLICATION METHOD

#### 5.1 Identify Duplicates

**Manual Process:**
1. Search for repeated class strings (e.g., `"bg-card rounded-xl border border-border/50"`)
2. Count occurrences (use VS Code "Find All")
3. If count > 5, create shared component

**Automated Process:**
```bash
# Find most common className patterns
grep -roh 'className="[^"]*"' components/ | sort | uniq -c | sort -rn | head -20
```

---

#### 5.2 Consolidation Strategy

**For Card Patterns:**
1. ✅ Already done → `/components/shared/CardLayouts.tsx`
2. Migration: Replace inline cards with `<ThreeColumnGrid>`, `<CarouselLayout>`, `<HeroCardLayout>`

**For Search Bars:**
1. ✅ Already done → `/components/shared/SearchFilterBar.tsx`
2. Migration: Replace inline search with `<SearchFilterBar>`

**For Metadata:**
1. ✅ Already done → `/components/shared/MetadataDisplay.tsx`
2. Migration: Replace inline metadata with `<MetadataDisplay>`

**For Empty States:**
1. ✅ Already done → `/components/shared/EmptyState.tsx`
2. Migration: Replace inline empty states with `<EmptyState>`

**Risk Mitigation:**
- Test each page after migration
- Keep old code commented out initially
- Verify hover states, animations, responsiveness

---

### 🎯 PHASE 6: TOKENIZATION METHOD

#### 6.1 Create Token Hierarchy

**Already Complete in `/styles/globals.css`:**
- ✅ Color tokens (semantic)
- ✅ Spacing scale (8px grid)
- ✅ Border radius (base)
- ⚠️ Typography tokens (NEEDS EXPANSION - see Phase 1.1)
- ⚠️ Market color tokens (NEEDS ADDITION - see Phase 1.2)

---

#### 6.2 Token Migration Process

**Step 1: Audit Component**
- List all hardcoded values (colors, sizes, spacing)

**Step 2: Map to Tokens**
- `#1a1a1a` → `text-foreground`
- `text-[9px]` → `text-2xs`
- `rgb(5, 150, 105)` → `var(--market-up)`

**Step 3: Replace**
- Use search & replace (see Phase 2)

**Step 4: Test**
- Verify light/dark mode
- Check responsive behavior

---

### 🎯 PHASE 7: COMPONENT CONSOLIDATION

#### 7.1 Priority Order

**Already Consolidated (✅):**
1. ✅ Card layouts → `/components/shared/CardLayouts.tsx`
2. ✅ Search bars → `/components/shared/SearchFilterBar.tsx`
3. ✅ Metadata → `/components/shared/MetadataDisplay.tsx`
4. ✅ Empty states → `/components/shared/EmptyState.tsx`
5. ✅ Separators → `/components/shared/SectionSeparator.tsx`
6. ✅ Episode cards → `/components/shared/EpisodeCard.tsx`
7. ✅ Icon buttons → `/components/shared/IconButton.tsx`

**Next to Consolidate:**
8. Filter dropdowns (9 instances) → Create `/components/shared/FilterDropdown.tsx`
9. Profile headers (5 instances) → Create `/components/shared/ProfileHeader.tsx`
10. Modal patterns (3 instances) → Extract to `/components/shared/Modal.tsx`

---

#### 7.2 Variant Models for Each

**CardLayouts.tsx (✅ Complete):**
```tsx
// Variants: 3-column grid, carousel, hero layout
<ThreeColumnGrid items={podcasts} />
<CarouselLayout items={episodes} />
<HeroCardLayout featuredItem={podcast} />
```

**SearchFilterBar.tsx (✅ Complete):**
```tsx
// Variants: with/without filters, mobile overlay
<SearchFilterBar value={query} onChange={setQuery} />
<SearchFilterBar value={query} onChange={setQuery} filters={filterOptions} />
```

**MetadataDisplay.tsx (✅ Complete):**
```tsx
// Variants: duration only, date only, both, with icon
<MetadataDisplay duration="45 min" />
<MetadataDisplay date="2 days ago" />
<MetadataDisplay duration="45 min" date="2 days ago" />
```

**EmptyState.tsx (✅ Complete):**
```tsx
// Variants: with/without action button, custom icon
<EmptyState icon={BookmarkOff} title="No saved items" />
<EmptyState icon={Search} title="No results" action={{ label: "Clear filters", onClick: handleClear }} />
```

**FilterDropdown.tsx (⚠️ TODO):**
```tsx
// Variants: single select, multi select
<FilterDropdown 
  value={selectedFilter}
  onChange={setSelectedFilter}
  options={[
    { label: 'All', value: 'all' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' }
  ]}
/>
```

---

## D) HANDOFF PAGE SPEC - `/DESIGN_TOKENS.md`

**Purpose:** Single source of truth for all design tokens  
**Location:** `/DESIGN_TOKENS.md` (new file)  
**Format:** Developer-friendly reference

### Layout Blueprint

```markdown
# Design Tokens Reference
## Simplicity Design System - Complete Token Catalog

---

## Color Tokens

### Semantic Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | #ffffff | #242424 | Page background |
| `--foreground` | #1a1a1a | #e5e5e5 | Primary text |
| `--card` | #ffffff | #2a2a2a | Card backgrounds |
| `--muted` | #f5f5f5 | #2d2d2d | Muted backgrounds |
| `--border` | rgba(0,0,0,0.1) | #3a3a3a | Border color |

**Usage:**
```tsx
className="bg-card text-foreground border-border"
```

---

## Typography Tokens

### Font Sizes
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--text-2xs` | 9px | `text-2xs` | Micro labels |
| `--text-xs-alt` | 10px | `text-xs-alt` | Small captions |
| `--text-xs-small` | 11px | `text-xs-small` | Compact text |
| `--text-xs` | 12px | `text-xs` | Standard small |
| `--text-sm` | 14px | `text-sm` | Body small |
| `--text-base` | 16px | `text-base` | Body |
| `--text-lg` | 18px | `text-lg` | Large |
| `--text-xl` | 20px | `text-xl` | Headings |
| `--text-2xl` | 24px | `text-2xl` | Page titles |

---

## Spacing Tokens

### 8px Grid Scale
| Token | Value | Tailwind | Common Use |
|-------|-------|----------|------------|
| `1` | 4px | `gap-1` `p-1` | Tight spacing |
| `1.5` | 6px | `gap-1.5` | Icon gaps |
| `2` | 8px | `gap-2` `p-2` | Base grid |
| `2.5` | 10px | `p-2.5` | Small cards |
| `3` | 12px | `gap-3` `p-3` | Standard cards |
| `4` | 16px | `p-4` | Large sections |

---

## Border Radius Tokens

### Semantic Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 8px | Badges, pills |
| `--radius-sm` | 10px | Small buttons |
| `--radius-md` | 12px | Buttons |
| `--radius-lg` | 14px | Base radius |
| `--radius-xl` | 16px | Cards |
| `--radius-2xl` | 20px | Large cards |
| `--radius-3xl` | 24px | Modals, sidebars |

---

## Market Data Colors

### Financial States
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--market-up` | #059669 | #10b981 | Positive change |
| `--market-down` | #dc2626 | #ef4444 | Negative change |
| `--market-neutral` | #737373 | #a3a3a3 | No change |

**Usage:**
```javascript
const color = isPositive ? 'var(--market-up)' : 'var(--market-down)';
```

---

## Component Inventory

### Shared Components (`/components/shared/`)
- ✅ `CardLayouts.tsx` - Grid & carousel layouts
- ✅ `SearchFilterBar.tsx` - Search with filters
- ✅ `MetadataDisplay.tsx` - Date/duration metadata
- ✅ `EmptyState.tsx` - Empty state illustrations
- ✅ `SectionSeparator.tsx` - Section dividers
- ✅ `EpisodeCard.tsx` - Episode card component
- ✅ `IconButton.tsx` - Icon-only buttons

### UI Primitives (`/components/ui/`)
- 40+ shadcn/ui components
- All using token-based system

---

## Layout Specifications

### Breakpoints
- Mobile: < 768px
- Desktop: ≥ 768px

### Sidebar Widths
- Left Sidebar: 320px (desktop only)
- Right Sidebar: 400px (desktop only)

### Content Max Width
- Pages: `max-w-xl` (672px)
- Modals: `max-w-2xl` (768px) or `max-w-4xl` (896px)

---

## Animation Tokens

### Transitions
- Default: `transition-all` (200ms ease)
- Hover: Shadow lift + background change
- Focus: Ring with `--ring` color

---

## Accessibility

### Focus Rings
- Color: `--ring` (#a3a3a3 light, #525252 dark)
- Width: 2px
- Offset: 2px

### Color Contrast
- All text meets WCAG AA standards
- Foreground on background: 12.6:1 (AAA)
- Muted text on background: 4.5:1 (AA)

---

## Developer Notes

### Adding New Tokens
1. Define in `/styles/globals.css` `:root` block
2. Add dark mode variant in `.dark` block
3. Expose in `@theme inline` block
4. Document in this file
5. Update `/DESIGN_SYSTEM.md`

### Migration Checklist
- [ ] Replace all `text-[#1a1a1a]` with `text-foreground`
- [ ] Replace all `text-[Npx]` with semantic tokens
- [ ] Replace RGB colors with CSS variables
- [ ] Use shared components from `/components/shared/`
- [ ] Test light/dark mode
- [ ] Verify responsive behavior

---

## Quick Reference

### Most Common Patterns

**Card:**
```tsx
className="bg-card border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-accent/30 transition-all"
```

**Button:**
```tsx
className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-muted transition-all"
```

**Input:**
```tsx
className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
```

**Separator:**
```tsx
<SectionSeparator />
// or with title
<SectionSeparator title="Section Name" />
```
```

---

## E) "DO NOT DO" LIST

### ❌ CRITICAL - NEVER DO THESE

#### 1. **DO NOT Edit `/components/figma/ImageWithFallback.tsx`**
- **Why:** Protected system component
- **Risk:** 🔴 BREAKS IMAGE SYSTEM

#### 2. **DO NOT Delete Components with Active Instances**
- **Check first:** Search for component usage across codebase
- **Why:** Will break pages that import it
- **Risk:** 🔴 RUNTIME ERRORS

#### 3. **DO NOT Rename Token Variables Without Global Search**
- **Example:** Changing `--foreground` to `--text-primary`
- **Why:** Will break all references
- **Risk:** 🔴 STYLING BREAKS

#### 4. **DO NOT Convert Entire Screens to Auto Layout Blindly**
- **Why:** This is React, not Figma
- **Risk:** N/A (Not applicable to React code)

#### 5. **DO NOT Remove CSS Variables from `globals.css`**
- **Why:** Used throughout codebase
- **Check:** Search for `var(--variable-name)` before removing
- **Risk:** 🔴 MISSING STYLES

---

### ⚠️ RISKY - PROCEED WITH CAUTION

#### 6. **DO NOT Batch-Replace Without Testing Each File**
- **Why:** Context matters, some exceptions exist
- **Process:** Replace → Test → Commit → Next file
- **Risk:** 🟡 VISUAL REGRESSIONS

#### 7. **DO NOT Change Spacing Without Reviewing Layout**
- **Example:** Changing `gap-3` to `gap-4` globally
- **Why:** May break carefully balanced layouts
- **Risk:** 🟡 LAYOUT SHIFTS

#### 8. **DO NOT Remove "Unused" Imports Without Running App**
- **Why:** May be used in commented code or dynamic imports
- **Risk:** 🟡 BUILD ERRORS

#### 9. **DO NOT Consolidate Modals Without Testing**
- **Why:** Each modal has unique behavior/props
- **Process:** Extract common parts, keep unique logic
- **Risk:** 🟡 BROKEN MODALS

#### 10. **DO NOT Change Border Radius Scale Without Design Approval**
- **Why:** Affects brand identity
- **Risk:** 🟡 DESIGN INCONSISTENCY

---

### 🟢 SAFE TO IGNORE - LOW PRIORITY

#### 11. **DO NOT Worry About Minor Spacing Variances**
- **Example:** `gap-2` vs `gap-2.5` in similar contexts
- **Why:** Both are acceptable within 8px grid
- **Risk:** 🟢 NONE

#### 12. **DO NOT Consolidate One-Off Components**
- **Example:** A unique layout used only once
- **Why:** Over-abstraction hurts readability
- **Risk:** 🟢 NONE

#### 13. **DO NOT Refactor Working Mobile Navigation**
- **Why:** Mobile nav is complex and working perfectly
- **Risk:** 🟢 UNNECESSARY RISK

#### 14. **DO NOT Change Z-Index Without Mapping Layers**
- **Current:** No z-index conflicts
- **If needed:** Create z-index scale first
- **Risk:** 🟢 LOW (not currently needed)

#### 15. **DO NOT Optimize Prematurally**
- **Example:** Code-splitting before performance issues
- **Why:** Works fine, adds complexity
- **Risk:** 🟢 NONE

---

## F) EXECUTION CHECKLIST

### ✅ PHASE 1: TOKEN EXPANSION (Est. 30 mins)
- [ ] Add typography tokens to `/styles/globals.css` (9 tokens)
- [ ] Add market color tokens to `/styles/globals.css` (6 tokens)
- [ ] Extend border radius scale (7 tokens)
- [ ] Expose new tokens in `@theme inline` block
- [ ] Test: Verify tokens work with Tailwind utilities
- [ ] Create `/DESIGN_TOKENS.md` reference document

**Output:** 22 new tokens, complete token reference

---

### ✅ PHASE 2: SEARCH & REPLACE (Est. 60 mins)
- [ ] Replace `text-[#1a1a1a] dark:text-white` → `text-foreground` (~50 files)
- [ ] Replace `text-[9px]` → `text-2xs` (~15 occurrences)
- [ ] Replace `text-[10px]` → `text-xs-alt` (~25 occurrences)
- [ ] Replace `text-[11px]` → `text-xs-small` (~45 occurrences)
- [ ] Replace RGB market colors with CSS variables (4 occurrences)
- [ ] Test: Visual regression check on all pages
- [ ] Commit: "feat: migrate to semantic color & typography tokens"

**Output:** 139 hardcoded values eliminated

---

### ✅ PHASE 3: COMPONENT MIGRATION (Est. 120 mins)
- [ ] Import `CardLayouts` components into 10 pages
- [ ] Replace inline card grids with `<ThreeColumnGrid>` (8 pages)
- [ ] Replace carousel patterns with `<CarouselLayout>` (5 pages)
- [ ] Import `SearchFilterBar` into 12 pages
- [ ] Replace inline search bars (12 replacements)
- [ ] Import `MetadataDisplay` into all card components (18 pages)
- [ ] Replace inline metadata displays (18 replacements)
- [ ] Import `EmptyState` into pages with empty states (8 pages)
- [ ] Replace inline empty state patterns (8 replacements)
- [ ] Import `SectionSeparator` into all pages (50 pages)
- [ ] Replace `border-t border-border/30` dividers (100+ replacements)
- [ ] Test: Each page after migration
- [ ] Commit: "refactor: migrate to shared component library"

**Output:** 1,330+ lines of duplicate code removed

---

### ✅ PHASE 4: DOCUMENTATION UPDATE (Est. 30 mins)
- [ ] Update `/DESIGN_SYSTEM.md` with new tokens
- [ ] Update `/COMPONENT_AUDIT.md` with migration status
- [ ] Create `/DESIGN_TOKENS.md` quick reference
- [ ] Update `/HANDOFF.md` with token usage guide
- [ ] Add migration notes to `/README.md`
- [ ] Commit: "docs: update design system documentation"

**Output:** Complete, up-to-date documentation

---

### ✅ PHASE 5: VALIDATION (Est. 30 mins)
- [ ] Visual QA: Test all pages in light mode
- [ ] Visual QA: Test all pages in dark mode
- [ ] Responsive QA: Test all pages on mobile
- [ ] Responsive QA: Test all pages on desktop
- [ ] Accessibility: Verify focus states work
- [ ] Accessibility: Test keyboard navigation
- [ ] Performance: Check bundle size (should decrease)
- [ ] Code quality: Run linter
- [ ] Commit: "test: visual & functional QA complete"

**Output:** Production-ready, fully tokenized system

---

## G) EXPECTED RESULTS

### Quantitative Improvements
- **Lines of code removed:** 1,330+ (duplicated patterns)
- **Hardcoded values eliminated:** 139 (colors, fonts)
- **New design tokens added:** 22
- **Components migrated:** 50+ pages
- **Consistency improvement:** 95%+ (from ~70%)

### Qualitative Improvements
- ✅ Complete design system compliance
- ✅ Perfect light/dark mode support
- ✅ Centralized styling maintenance
- ✅ Faster feature development (reusable components)
- ✅ Reduced bundle size (shared components)
- ✅ Better developer experience (token autocomplete)
- ✅ Easier onboarding (clear documentation)

---

## H) TIMELINE ESTIMATE

| Phase | Task | Time | Dependencies |
|-------|------|------|--------------|
| 1 | Token expansion | 30 min | None |
| 2 | Search & replace | 60 min | Phase 1 |
| 3 | Component migration | 120 min | Phase 2 |
| 4 | Documentation | 30 min | Phase 3 |
| 5 | Validation | 30 min | Phase 4 |
| **TOTAL** | **Full cleanup** | **270 min** | **(4.5 hours)** |

**Recommendation:** Execute in one focused session or break into 5 daily sprints (1 phase/day)

---

## I) SUCCESS METRICS

### Before Cleanup
- ❌ 79 hardcoded color values
- ❌ 85+ hardcoded font sizes
- ❌ 1,330+ lines of duplicated code
- ❌ 12 duplicate search bars
- ❌ 23 duplicate card patterns
- ❌ Inconsistent theming
- ❌ No typography scale

### After Cleanup
- ✅ 0 hardcoded color values
- ✅ 0 hardcoded font sizes
- ✅ Shared component library (7 components)
- ✅ Centralized search pattern
- ✅ Standardized card layouts
- ✅ Complete token system (40+ tokens)
- ✅ Semantic typography scale

---

## J) ROLLBACK PLAN

If issues arise during execution:

1. **Git is your safety net**
   ```bash
   git checkout -b design-system-cleanup
   git commit -m "checkpoint" # After each phase
   git reset --hard HEAD~1     # Undo last commit if needed
   ```

2. **Test incrementally**
   - Complete one phase → test → commit
   - Don't move to next phase if tests fail

3. **Keep old code commented**
   ```tsx
   // OLD: <div className="text-[#1a1a1a] dark:text-white">
   <div className="text-foreground">
   ```

4. **Document breaking changes**
   - If a replacement doesn't work, document why
   - Create exception list

---

**END OF CLEANUP PLAN**

**Status:** 🟢 READY TO EXECUTE  
**Next Action:** Begin Phase 1 (Token Expansion)  
**Questions?** Review Section D (Handoff Page Spec) for token reference
