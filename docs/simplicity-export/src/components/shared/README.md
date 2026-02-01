# Reusable Component Library

This directory contains **shared, reusable components** extracted from common patterns across the Simplicity codebase.

## Components

### 🎴 EpisodeCard
**File:** `EpisodeCard.tsx`  
**Usage:** Episode/podcast display cards  
**Variants:** `grid`, `carousel`  
**Props:**
- `title` - Episode title
- `thumbnailUrl` - Card thumbnail
- `showName` - Podcast name
- `host` - Host/guest name
- `date` - Formatted date (MM-DD-YYYY)
- `variant` - Display variant
- `onClick` - Click handler

**Example:**
```tsx
<EpisodeCard
  title="Market Analysis Q1 2026"
  thumbnailUrl="/image.jpg"
  showName="All-In Podcast"
  host="Jason Calacanis"
  date="01-15-2026"
  variant="grid"
  onClick={() => handleClick()}
/>
```

---

### 🔍 SearchFilterBar
**File:** `SearchFilterBar.tsx`  
**Usage:** Search + filter control bar  
**Props:**
- `searchValue` - Current search query
- `onSearchChange` - Search handler
- `searchPlaceholder` - Placeholder text
- `filterValue` - Current filter
- `filterOptions` - Filter option array
- `onFilterChange` - Filter handler
- `showFilter` - Show filter dropdown

**Example:**
```tsx
<SearchFilterBar
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="Search notes..."
  filterValue={filter}
  filterOptions={[
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' }
  ]}
  onFilterChange={setFilter}
/>
```

---

### 📊 MetadataDisplay
**File:** `MetadataDisplay.tsx`  
**Components:** `MetadataRow`, `MetadataStack`  
**Usage:** Icon + text metadata display

**MetadataRow Example:**
```tsx
<MetadataRow
  icon={Mic}
  text="All-In Podcast"
  size="sm"
/>
```

**MetadataStack Example:**
```tsx
<MetadataStack
  items={[
    { icon: Mic, text: 'All-In Podcast' },
    { icon: User, text: 'Jason Calacanis' },
    { icon: Calendar, text: '01-15-2026' }
  ]}
  gap="normal"
/>
```

---

### 🚫 EmptyState
**File:** `EmptyState.tsx`  
**Usage:** Empty state displays  
**Props:**
- `icon` - Lucide icon
- `title` - Primary message
- `description` - Secondary message (optional)
- `action` - Custom action button (optional)

**Example:**
```tsx
<EmptyState
  icon={BookMarked}
  title="No saved notes yet"
  description="Your notes from episode summaries will appear here"
/>
```

---

### ➖ SectionSeparator
**File:** `SectionSeparator.tsx`  
**Usage:** Visual section separators  
**Props:**
- `spacing` - `'tight'` | `'default'` | `'loose'`
- `horizontalPadding` - Padding for menu separators

**Example:**
```tsx
<SectionSeparator spacing="default" />
<SectionSeparator spacing="tight" horizontalPadding={3} />
```

---

### 🔘 IconButton
**File:** `IconButton.tsx`  
**Usage:** Icon-only action buttons  
**Variants:** `default`, `premium`, `active`, `minimal`  
**Sizes:** `sm` (w-7), `md` (w-10), `action` (minimal)

**Example:**
```tsx
<IconButton
  icon={RefreshCw}
  size="md"
  variant="default"
  onClick={() => refresh()}
  aria-label="Refresh data"
/>
```

---

### 📐 CardLayouts
**File:** `CardLayouts.tsx`  
**Components:** `CardGrid`, `CardCarousel`

**CardGrid Example:**
```tsx
<CardGrid
  items={episodes}
  columns={3}
  showSeparators={true}
  renderItem={(episode) => (
    <EpisodeCard {...episode} />
  )}
/>
```

**CardCarousel Example:**
```tsx
<CardCarousel
  items={episodes}
  gap={3}
  renderItem={(episode) => (
    <EpisodeCard {...episode} variant="carousel" />
  )}
/>
```

---

## Usage Guidelines

### Import Pattern
```tsx
import { EpisodeCard } from '@/components/shared/EpisodeCard';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { MetadataRow, MetadataStack } from '@/components/shared/MetadataDisplay';
```

### When to Use Shared Components

✅ **DO use shared components when:**
- Displaying episode/podcast cards
- Creating search + filter interfaces
- Showing metadata (icon + text pairs)
- Displaying empty states
- Adding section separators
- Creating icon buttons

❌ **DON'T use shared components when:**
- You need highly custom behavior
- The component is truly one-off
- Forcing it would make the API awkward

### Customization

All shared components accept a `className` prop for additional customization:

```tsx
<EpisodeCard
  {...props}
  className="custom-additional-styles"
/>
```

---

## Benefits

1. **Consistency** - Guaranteed visual consistency across the app
2. **Maintainability** - Update in one place, changes everywhere
3. **Developer Experience** - Less code to write, faster development
4. **Testing** - Single test suite per component
5. **Documentation** - Clear API with TypeScript types

---

## Migration Guide

### Before (Duplicated Code)
```tsx
<div className="group cursor-pointer flex-shrink-0 w-40">
  <div className="bg-card rounded-xl border border-border/50...">
    <div className="w-full aspect-square...">
      <img src={url} />
    </div>
    <div className="p-2.5">
      {/* 50+ lines of card content */}
    </div>
  </div>
</div>
```

### After (Shared Component)
```tsx
<EpisodeCard
  title={title}
  thumbnailUrl={url}
  showName={show}
  host={host}
  date={date}
  onClick={handleClick}
/>
```

**Result:** ~90% less code, guaranteed consistency

---

## Component Development

When creating new shared components:

1. **Identify the pattern** - Find 3+ instances of similar code
2. **Extract common props** - Determine the API surface
3. **Handle variants** - Support different sizes/styles
4. **Add TypeScript types** - Document all props
5. **Write documentation** - Update this README
6. **Update existing code** - Migrate to new component

---

## Questions?

Refer to:
- `/DESIGN_SYSTEM.md` - Design token documentation
- `/COMPONENT_AUDIT.md` - Component analysis
- Individual component files for detailed JSDoc

---

**End of Shared Components Documentation**
