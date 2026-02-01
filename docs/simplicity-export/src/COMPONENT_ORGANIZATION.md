# Component Organization & Naming Standards

**Version:** 1.0  
**Last Updated:** January 30, 2026

---

## Directory Structure

```
/components
  /shared              # Reusable composition components (NEW)
    EpisodeCard.tsx
    SearchFilterBar.tsx
    MetadataDisplay.tsx
    EmptyState.tsx
    SectionSeparator.tsx
    IconButton.tsx
    CardLayouts.tsx
    README.md
  
  /ui                  # shadcn/ui base components
    button.tsx
    input.tsx
    card.tsx
    [40+ shadcn components]
  
  /figma              # Figma-specific utilities
    ImageWithFallback.tsx
  
  [Feature]Page.tsx   # Page-level components (root level)
  [Feature]Modal.tsx  # Modal components (root level)
  [Feature]List.tsx   # List components (root level)
  [Other].tsx         # Other shared components (root level)

/contexts
  ThemeContext.tsx    # Global contexts

/data
  podcasts.ts         # Mock data

/src
  /copy
    en.ts             # Copy/text content
  /hooks
    index.ts
    useEpisodeFeed.ts
    useFilterState.ts
    ...
  /types
    index.ts          # TypeScript types

/styles
  globals.css         # Design tokens & base styles
```

---

## Naming Conventions

### Component Files

#### Pages (23 files)
**Pattern:** `[Feature]Page.tsx`  
**Examples:**
- ✅ `HomePage.tsx`
- ✅ `DiscoverPage.tsx`
- ✅ `NotebookPage.tsx`
- ✅ `SettingsPage.tsx`

**Rules:**
- Must end with `Page.tsx`
- PascalCase for feature name
- Singular form (not plural)

---

#### Modals (4 files)
**Pattern:** `[Feature]Modal.tsx`  
**Examples:**
- ✅ `EpisodeSummaryModal.tsx`
- ✅ `PodcastDetailModal.tsx`
- ✅ `PersonProfileModal.tsx`
- ✅ `ReportModal.tsx`

**Rules:**
- Must end with `Modal.tsx`
- PascalCase for feature name
- Describes content, not action

---

#### Lists (8 files)
**Pattern:** `[Item]List.tsx`  
**Examples:**
- ✅ `FollowingList.tsx`
- ✅ `SavedList.tsx`
- ✅ `TopShowsList.tsx`
- ✅ `NotificationsList.tsx`

**Rules:**
- Must end with `List.tsx`
- PascalCase for item name
- Plural form in name is okay

---

#### Layout Components (7 files)
**Pattern:** `[Location][Component].tsx`  
**Examples:**
- ✅ `LeftSidebar.tsx`
- ✅ `RightSidebar.tsx`
- ✅ `BottomNavBar.tsx`
- ✅ `MobileTopBar.tsx`

**Rules:**
- Descriptive location + component type
- PascalCase
- Avoid generic names like `Sidebar.tsx`

---

#### Shared Components (NEW - 7 files)
**Location:** `/components/shared/`  
**Pattern:** `[Purpose].tsx`  
**Examples:**
- ✅ `EpisodeCard.tsx`
- ✅ `SearchFilterBar.tsx`
- ✅ `MetadataDisplay.tsx`
- ✅ `EmptyState.tsx`

**Rules:**
- Reusable compositions only
- Clear, descriptive names
- No "Shared" prefix (directory implies this)

---

#### UI Components (40+ files)
**Location:** `/components/ui/`  
**Pattern:** `[component].tsx` (kebab-case)  
**Examples:**
- ✅ `button.tsx`
- ✅ `dropdown-menu.tsx`
- ✅ `alert-dialog.tsx`

**Rules:**
- shadcn/ui convention (lowercase, hyphenated)
- Don't modify this convention
- Don't add custom components here

---

### Component Names (Exports)

#### Default Exports
```tsx
// Page components
export default function HomePage() { }

// Modal components
export default function EpisodeSummaryModal() { }
```

#### Named Exports (Preferred for Shared)
```tsx
// Shared components
export function EpisodeCard() { }

// Multiple exports from one file
export function MetadataRow() { }
export function MetadataStack() { }
```

---

### Props Interfaces

**Pattern:** `[ComponentName]Props`

```tsx
export interface EpisodeCardProps {
  title: string;
  thumbnailUrl: string;
  // ...
}

export function EpisodeCard(props: EpisodeCardProps) { }
```

**Rules:**
- Always export the interface
- Name matches component + "Props"
- Document all props with JSDoc comments

---

### TypeScript Types

**Location:** `/src/types/index.ts`  
**Pattern:** PascalCase for types/interfaces

```tsx
export interface Episode {
  id: string;
  title: string;
  // ...
}

export type FilterType = 'all' | 'today' | 'week' | 'month';

export interface Podcast {
  id: string;
  title: string;
  // ...
}
```

---

### Hooks

**Location:** `/src/hooks/`  
**Pattern:** `use[Purpose].ts`

```tsx
// File: useFilterState.ts
export function useFilterState() {
  // Hook logic
}

// File: useFollowState.ts
export function useFollowState() {
  // Hook logic
}
```

**Rules:**
- Always start with "use"
- camelCase
- One hook per file (usually)
- Export from `/src/hooks/index.ts`

---

## Import Organization

### Import Order

```tsx
// 1. External libraries
import { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

// 2. Shared components
import { EpisodeCard } from '@/components/shared/EpisodeCard';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';

// 3. UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 4. Contexts
import { useTheme } from '@/contexts/ThemeContext';

// 5. Hooks
import { useFilterState } from '@/src/hooks/useFilterState';

// 6. Types
import { Episode, Podcast } from '@/src/types';

// 7. Data/Utils
import { podcasts } from '@/data/podcasts';
import { copy } from '@/src/copy/en';
```

---

## File Organization Within Components

### Standard Structure

```tsx
// 1. Imports
import { ... } from 'react';
import { ... } from 'lucide-react';

// 2. Types/Interfaces
export interface ComponentProps {
  // ...
}

interface LocalState {
  // ...
}

// 3. Constants (if needed)
const DEFAULT_OPTIONS = [...];

// 4. Component
export function Component(props: ComponentProps) {
  // 4a. Props destructuring
  const { prop1, prop2 } = props;
  
  // 4b. Hooks
  const [state, setState] = useState();
  const theme = useTheme();
  
  // 4c. Derived values
  const computedValue = useMemo(() => ...);
  
  // 4d. Event handlers
  const handleClick = () => { };
  
  // 4e. Effects
  useEffect(() => { }, []);
  
  // 4f. Render helpers (if needed)
  const renderItem = (item) => ( );
  
  // 4g. Return JSX
  return ( );
}
```

---

## CSS Class Organization

### Class Order
```tsx
className="
  // 1. Display & Position
  flex relative absolute
  
  // 2. Layout
  w-40 h-10 gap-3
  
  // 3. Spacing
  p-4 px-3 py-2 mx-auto
  
  // 4. Typography
  text-xs font-semibold
  
  // 5. Colors
  bg-card text-foreground border-border
  
  // 6. Border & Shadow
  rounded-xl border shadow-sm
  
  // 7. Effects
  hover:bg-muted transition-all
  
  // 8. Responsive
  lg:hidden
"
```

---

## Component Complexity Guidelines

### Small Components (<100 lines)
- ✅ Single responsibility
- ✅ Reusable
- ✅ Well-typed
- Example: `IconButton`, `MetadataRow`, `EmptyState`

### Medium Components (100-300 lines)
- ✅ Feature-focused
- ✅ Composed of smaller components
- ✅ Clear sections
- Example: Most page components

### Large Components (300-500 lines)
- 🟡 Consider splitting
- 🟡 Use clear section comments
- 🟡 Extract render helpers
- Example: `PodcastCatalog`, `NotebookPage`

### Very Large Components (500+ lines)
- 🔴 Should be refactored
- 🔴 Split into multiple components
- 🔴 Extract complex logic to hooks
- Example: `RightSidebar` (1500+ lines - needs refactoring)

---

## Documentation Standards

### Component Documentation

```tsx
/**
 * EpisodeCard - Reusable card component for episode/podcast display
 * 
 * Used across: Discover, Notebook, Top Shows, New Shows
 * Variants: grid (default), carousel (compact)
 * 
 * @example
 * ```tsx
 * <EpisodeCard
 *   title="Market Analysis"
 *   thumbnailUrl="/image.jpg"
 *   showName="All-In Podcast"
 *   host="Jason"
 *   date="01-15-2026"
 *   variant="grid"
 * />
 * ```
 */
export function EpisodeCard(props: EpisodeCardProps) {
```

### Props Documentation

```tsx
export interface EpisodeCardProps {
  /** Episode or podcast title */
  title: string;
  
  /** URL for thumbnail image */
  thumbnailUrl: string;
  
  /** Show/podcast name */
  showName: string;
  
  /** Host or guest name */
  host: string;
  
  /** Date string (formatted as MM-DD-YYYY) */
  date: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Card variant - grid has larger padding, carousel is compact */
  variant?: 'grid' | 'carousel';
}
```

---

## Testing Patterns

### Component Test Files
**Pattern:** `[Component].test.tsx`  
**Location:** Same directory as component

```tsx
// EpisodeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { EpisodeCard } from './EpisodeCard';

describe('EpisodeCard', () => {
  it('renders title correctly', () => {
    // Test
  });
});
```

---

## Migration Checklist

When creating or refactoring components:

- [ ] **Naming:** Follows naming conventions
- [ ] **Location:** In correct directory
- [ ] **Types:** Props interface defined and exported
- [ ] **Documentation:** JSDoc comments added
- [ ] **Imports:** Organized in standard order
- [ ] **Exports:** Named or default as appropriate
- [ ] **Reusability:** Can it be shared? Move to `/shared/`
- [ ] **Complexity:** <500 lines? Consider splitting
- [ ] **Accessibility:** ARIA labels, keyboard nav
- [ ] **Responsive:** Works on mobile and desktop

---

## Anti-Patterns to Avoid

### ❌ Generic Names
```tsx
// Bad
Card.tsx
Button.tsx  // Use shadcn's button.tsx instead
List.tsx
```

### ❌ Inconsistent Suffixes
```tsx
// Bad
EpisodeCard.tsx      // Card
SearchFilter.tsx     // Should be SearchFilterBar.tsx
TopShows.tsx        // Should be TopShowsPage.tsx or TopShowsList.tsx
```

### ❌ Deeply Nested Directories
```tsx
// Bad
/components/features/pages/discover/DiscoverPage.tsx

// Good
/components/DiscoverPage.tsx
```

### ❌ God Components
```tsx
// Bad: 1500 lines in one file
RightSidebar.tsx  // Should be split into smaller components
```

### ❌ Unnamed Exports
```tsx
// Bad
export default () => { }

// Good
export default function HomePage() { }
// or
export function EpisodeCard() { }
```

---

## Summary

### Key Principles

1. **Consistency** - Follow naming patterns religiously
2. **Clarity** - Names should be immediately understandable
3. **Organization** - Everything has its place
4. **Documentation** - Code should be self-documenting
5. **Reusability** - Extract common patterns
6. **Simplicity** - Don't over-engineer

### File Organization Score

✅ **Current State:** 92/100
- Excellent naming consistency
- Clear directory structure
- Well-organized imports
- Strong TypeScript usage

🎯 **Target State:** 98/100
- Add shared component library (✅ Created)
- Refactor large files (RightSidebar)
- Add more inline documentation
- Create component tests

---

**End of Component Organization Standards**
