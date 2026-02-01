# Simplicity Design System Documentation
## Production-Ready Design System for Next.js + Tailwind + shadcn/ui

**Version:** 1.0  
**Last Updated:** January 30, 2026  
**Status:** ✅ Production Ready

---

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Component Library](#component-library)
4. [Layout Patterns](#layout-patterns)
5. [Component Compositions](#component-compositions)
6. [Implementation Guidelines](#implementation-guidelines)

---

## Design Tokens

### Color System

The design system uses **semantic color tokens** that automatically adapt to light/dark mode. All colors are defined in `/styles/globals.css` as CSS custom properties.

#### Light Mode Colors
```css
--background: #ffffff;      /* Page background */
--foreground: #1a1a1a;      /* Primary text */
--card: #ffffff;            /* Card backgrounds */
--muted: #f5f5f5;          /* Muted backgrounds (hover states) */
--muted-foreground: #737373; /* Secondary text */
--border: rgba(0, 0, 0, 0.1); /* Border color */
--accent: #f5f5f5;          /* Accent backgrounds */
--destructive: #dc2626;     /* Error/danger states */
```

#### Dark Mode Colors
```css
--background: #242424;
--foreground: #e5e5e5;
--card: #2a2a2a;
--muted: #2d2d2d;
--muted-foreground: #a3a3a3;
--border: #3a3a3a;
--accent: #323232;
--destructive: #ef4444;
```

#### Usage in Code
```tsx
// Always use semantic Tailwind classes
className="bg-card text-foreground border-border"

// Never use hardcoded colors
className="bg-white text-black border-gray-200" // ❌ DON'T
```

---

### Spacing Scale

The design system uses an **8px base grid** with consistent spacing values throughout.

#### Spacing Tokens
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `0` | 0px | `gap-0` `p-0` | Reset spacing |
| `0.5` | 2px | `gap-0.5` `p-0.5` | Micro spacing |
| `1` | 4px | `gap-1` `p-1` | Tight spacing |
| `1.5` | 6px | `gap-1.5` `p-1.5` | Small spacing |
| `2` | 8px | `gap-2` `p-2` | Base spacing |
| `2.5` | 10px | `gap-2.5` `p-2.5` | Card padding (small) |
| `3` | 12px | `gap-3` `p-3` | Card padding (default) |
| `4` | 16px | `gap-4` `p-4` | Section padding |
| `5` | 20px | `gap-5` | Large gaps |
| `7` | 28px | `mb-7` `my-7` | Section separators |
| `12` | 48px | `py-12` | Empty states |

#### Common Patterns
```tsx
// Card Content Padding
className="p-2"      // Carousel cards (small)
className="p-2.5"    // Grid cards (medium)
className="p-3"      // Standard cards
className="p-4"      // Large cards/sections

// Element Spacing
className="gap-1"    // Tight icon+text
className="gap-1.5"  // Metadata rows
className="gap-2"    // Standard rows
className="gap-3"    // Card grids
className="gap-4"    // Sections

// Section Separators
className="my-7"     // Between major sections
className="mb-7"     // After controls
```

---

### Border Radius Scale

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `sm` | 8px | `rounded-lg` | Buttons, inputs |
| `md` | 10px | `rounded-xl` | Cards (most common) |
| `lg` | 12px | `rounded-2xl` | Large cards/modals |
| `xl` | 16px | `rounded-3xl` | Sidebar containers |

**Standard:** Most cards use `rounded-xl` (12px radius)

---

### Shadow Scale

The design system uses a **3-level shadow system** for elevation hierarchy.

| Level | Class | Usage |
|-------|-------|-------|
| **Base** | `shadow-sm` | Default card state |
| **Elevated** | `shadow-md` | Hover state, active elements |
| **Floating** | `shadow-lg` | Dropdowns, modals, sidebars |

#### Shadow Patterns
```tsx
// Standard Card Pattern
className="shadow-sm hover:shadow-md"

// Elevated Elements (Dropdowns)
className="shadow-lg"

// Sidebar Containers
className="shadow-lg"
```

---

### Border Opacity Patterns

Consistent border opacity creates visual hierarchy:

| Opacity | Class | Usage |
|---------|-------|-------|
| **100%** | `border-border` | Active states, hover |
| **50%** | `border-border/50` | Default card borders |
| **40%** | `border-border/40` | Subtle borders (note cards) |
| **30%** | `border-border/30` | Separators, dividers |

---

## Typography

### Font Family
**Primary:** Inter (400, 500, 600, 700 weights)  
**Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif

### Font Size Scale

| Size | Class | Pixels | Usage |
|------|-------|--------|-------|
| **9px** | `text-[9px]` | 9px | Micro text (carousel metadata) |
| **10px** | `text-[10px]` | 10px | Small metadata, labels |
| **11px** | `text-[11px]` | 11px | Card titles, buttons |
| **12px** | `text-xs` | 12px | Body text (small), form labels |
| **14px** | `text-sm` | 14px | Body text (standard) |
| **16px** | `text-base` | 16px | Body text (large), headings |

### Font Weight Scale

| Weight | Class | Value | Usage |
|--------|-------|-------|-------|
| **Normal** | `font-normal` | 400 | Body text, descriptions |
| **Medium** | `font-medium` | 500 | Buttons, labels |
| **Semibold** | `font-semibold` | 600 | Card titles |
| **Bold** | `font-bold` | 700 | Headings, emphasis |

### Typography Patterns

```tsx
// Card Title
className="text-[11px] font-semibold text-foreground line-clamp-2"

// Metadata Text
className="text-[10px] text-muted-foreground"

// Body Text
className="text-xs text-foreground"

// Section Headers
className="text-xs font-semibold text-foreground"
```

---

## Component Library

### Core Components

All components are built using **Auto Layout patterns** with consistent spacing and semantic color tokens.

#### Button Variants

**Standard Button**
```tsx
className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-medium 
           hover:bg-muted transition-all shadow-sm"
```

**Icon Button (Small)**
```tsx
className="w-7 h-7 rounded-lg hover:bg-muted transition-all flex items-center justify-center"
```

**Icon Button (Medium)**
```tsx
className="w-10 h-10 rounded-lg bg-card border border-border/50 hover:bg-muted 
           transition-all flex items-center justify-center shadow-sm"
```

**Action Button (Minimal)**
```tsx
className="p-1.5 rounded-lg hover:bg-muted transition-all"
```

---

#### Card Variants

**Standard Card (Grid)**
```tsx
<div className="bg-card rounded-xl border border-border/50 shadow-sm 
                hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
  <div className="p-2.5">
    {/* Card Content */}
  </div>
</div>
```

**Carousel Card (Compact)**
```tsx
<div className="bg-card rounded-xl border border-border/50 shadow-sm 
                hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
  <div className="p-2">
    {/* Card Content */}
  </div>
</div>
```

**Large Note Card**
```tsx
<div className="bg-card border border-border/40 rounded-2xl p-4 shadow-sm 
                hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
  {/* Note Content */}
</div>
```

**Sidebar Container**
```tsx
<div className="bg-card border border-border/50 rounded-3xl shadow-lg">
  {/* Sidebar Content */}
</div>
```

---

#### Input Variants

**Standard Input**
```tsx
<input 
  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-xs 
             focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
             focus:border-indigo-500 transition-all shadow-sm"
/>
```

**Search Input**
```tsx
<div className="relative flex-1">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <input 
    className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-xs 
               focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
               focus:border-indigo-500 transition-all shadow-sm"
  />
</div>
```

---

#### Dropdown Menu

**Standard Dropdown**
```tsx
<div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border/50 
                rounded-xl shadow-lg z-20 overflow-hidden">
  <div className="p-2 space-y-0.5">
    {/* Menu Items */}
    <button className="w-full px-3 py-2 rounded-lg text-xs font-medium 
                       transition-all text-left hover:bg-muted/50">
      Menu Item
    </button>
    
    {/* Separator */}
    <div className="border-t border-border/30 my-1" />
  </div>
</div>
```

---

#### Badge/Pill Components

**Standard Badge**
```tsx
<span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-lg 
                 text-[10px] font-medium text-foreground">
  Badge Text
</span>
```

**Premium Badge**
```tsx
<span className="inline-flex items-center gap-1 px-2 py-1 
                 bg-gradient-to-br from-amber-50 to-amber-100 
                 dark:from-amber-950/30 dark:to-amber-900/30 
                 border border-amber-200 dark:border-amber-900/50 
                 rounded-lg text-[10px] font-medium">
  Premium
</span>
```

---

#### Icon Sizing Standards

| Size | Class | Pixels | Usage |
|------|-------|--------|-------|
| **Micro** | `w-[10px] h-[10px]` | 10px | Carousel card icons |
| **Small** | `w-[11px] h-[11px]` | 11px | Grid card icons |
| **Standard** | `w-3 h-3` | 12px | Metadata icons |
| **Medium** | `w-3.5 h-3.5` | 14px | Button icons |
| **Large** | `w-4 h-4` | 16px | Search icons, nav icons |

---

## Layout Patterns

### Container Widths

```tsx
// Main Content Area
className="w-full max-w-xl mx-auto"  // 36rem = 576px

// Sidebar Widths
className="w-[400px]"                // Right sidebar
className="w-80"                     // Left sidebar (320px)

// Card Widths
className="w-40"                     // Carousel/grid cards (160px)
```

---

### Grid Layouts

**3-Column Card Grid**
```tsx
<div className="flex justify-between">
  <div className="w-40">{/* Card 1 */}</div>
  <div className="w-40">{/* Card 2 */}</div>
  <div className="w-40">{/* Card 3 */}</div>
</div>
```

**Horizontal Carousel**
```tsx
<div className="overflow-x-auto hide-scrollbar -mx-1 px-1">
  <div className="flex gap-3 pb-2">
    {items.map(item => (
      <div className="flex-shrink-0 w-40">{/* Card */}</div>
    ))}
  </div>
</div>
```

---

### Separator Patterns

**Standard Section Separator**
```tsx
<div className="border-t border-border/30 my-7" />
```

**Separator Between Rows**
```tsx
<div className="border-t border-border/30 mt-5" />
```

**Separator in Dropdown/Menu**
```tsx
<div className="border-t border-border/30 my-1" />
```

**Separator with Horizontal Padding (mx-3)**
Used in dropdown menus where separator doesn't go edge-to-edge:
```tsx
<div className="border-t border-border/30 my-1 mx-3" />
```

---

## Component Compositions

### Episode Card (Grid View)

Complete card composition with metadata stack:

```tsx
<div className="group cursor-pointer flex-shrink-0 w-40">
  {/* Card Container */}
  <div className="bg-card rounded-xl border border-border/50 shadow-sm 
                  hover:shadow-md hover:bg-accent/30 hover:border-border transition-all overflow-hidden">
    
    {/* Thumbnail */}
    <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
      <img src={thumbnailUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
    </div>

    {/* Content */}
    <div className="p-2.5">
      {/* Title with Icon */}
      <div className="mb-2">
        <div className="flex items-start gap-1">
          <FileText className="w-[11px] h-[11px] text-foreground flex-shrink-0 mt-0.5" />
          <h3 className="text-[11px] font-semibold text-foreground line-clamp-2 leading-tight flex-1">
            {title}
          </h3>
        </div>
      </div>
      
      {/* Metadata Stack */}
      <div className="flex flex-col gap-1">
        {/* Show */}
        <div className="flex items-center gap-1.5">
          <Mic className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground truncate">{showName}</span>
        </div>
        
        {/* Host */}
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground truncate">{hostName}</span>
        </div>
        
        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">{date}</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### Search + Filter Control Bar

Standard pattern used across multiple pages:

```tsx
<div className="flex items-center gap-3 mb-7">
  {/* Search Bar */}
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <input
      type="text"
      placeholder="Search..."
      className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-xs 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
                 focus:border-indigo-500 transition-all shadow-sm"
    />
  </div>

  {/* Filter Button */}
  <div className="relative flex-shrink-0">
    <button className="px-4 py-2 bg-card border border-border rounded-lg text-xs font-medium 
                       hover:bg-muted transition-all flex items-center gap-2 whitespace-nowrap shadow-sm">
      <Filter className="w-4 h-4 text-muted-foreground" />
      <span className="text-foreground">Filter Label</span>
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    </button>
  </div>
</div>
```

---

### Note Card with Checkboxes

Large card composition for note display:

```tsx
<div className="relative bg-card border border-border/40 rounded-2xl p-4 shadow-sm 
                hover:shadow-md hover:bg-accent/30 hover:border-border transition-all group overflow-hidden">
  
  {/* Title & Actions */}
  <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/30">
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <FileText className="w-[13px] h-[13px] text-foreground flex-shrink-0" />
      <h3 className="text-xs font-semibold text-foreground line-clamp-2">{title}</h3>
    </div>
    
    {/* Action Buttons */}
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button className="p-1.5 rounded-lg hover:bg-muted transition-all">
        <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      <button className="p-1.5 rounded-lg hover:bg-muted transition-all">
        <Download className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  </div>
  
  {/* Note Categories */}
  <div className="space-y-1.5">
    {categories.map(category => (
      <div key={category.title}>
        <h4 className="text-[10px] font-semibold text-foreground">{category.title}</h4>
        {category.items.map(item => (
          <div className="flex items-start gap-2" key={item.text}>
            {/* Checkbox */}
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
              item.checked 
                ? 'bg-gray-600 dark:bg-gray-500 border-gray-600 dark:border-gray-500' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}>
              {item.checked && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
            </div>
            <p className="text-[11px] text-foreground leading-relaxed flex-1">{item.text}</p>
          </div>
        ))}
      </div>
    ))}
  </div>
</div>
```

---

## Implementation Guidelines

### Code Organization

```
/components
  /ui                    # shadcn/ui base components
  /[FeatureName]Page.tsx # Feature pages
  /[Component].tsx       # Shared components
/styles
  /globals.css           # Design tokens & base styles
/data
  /podcasts.ts           # Mock data
/src
  /copy                  # Copy/text content
  /hooks                 # Reusable hooks
  /types                 # TypeScript types
```

---

### Component Naming Conventions

- **Pages:** `[Feature]Page.tsx` (e.g., `NotebookPage.tsx`)
- **Modals:** `[Feature]Modal.tsx` (e.g., `EpisodeSummaryModal.tsx`)
- **Lists:** `[Item]List.tsx` (e.g., `NotificationsList.tsx`)
- **Shared Components:** `[Component].tsx` (e.g., `ChatBotBubble.tsx`)

---

### State Management Patterns

**Boolean UI States**
```tsx
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [isExpanded, setIsExpanded] = useState(false);
```

**View/Tab States**
```tsx
type View = 'main' | 'detail' | 'settings';
const [currentView, setCurrentView] = useState<View>('main');
```

**Selection States**
```tsx
const [selectedId, setSelectedId] = useState<string | null>(null);
const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
```

---

### Responsive Patterns

**Mobile-First Approach**
```tsx
// Desktop (always visible)
<div className="hidden lg:block">Desktop Only</div>

// Mobile (always visible)
<div className="block lg:hidden">Mobile Only</div>

// Responsive Width
<div className="w-full lg:w-[400px]">Responsive Width</div>
```

**Mobile Bottom Navigation**
```tsx
// Show on mobile, hide on desktop
<div className="fixed bottom-0 left-0 right-0 lg:hidden">
  {/* Bottom nav content */}
</div>
```

---

### Accessibility Standards

**Focus States**
```tsx
focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
```

**ARIA Labels**
```tsx
<button aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>
```

**Keyboard Navigation**
- All interactive elements must be keyboard accessible
- Modals should trap focus
- Dropdowns should support arrow key navigation

---

### Performance Best Practices

**Image Optimization**
```tsx
<img 
  src={thumbnailUrl} 
  alt={title}
  loading="lazy"
  className="absolute inset-0 w-full h-full object-cover"
/>
```

**Conditional Rendering**
```tsx
// Good: Clean conditional rendering
{isLoading && <Spinner />}
{!isLoading && <Content />}

// Avoid: Nested ternaries
{isLoading ? <Spinner /> : isError ? <Error /> : <Content />} // ❌
```

**Memoization** (when needed)
```tsx
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);
```

---

## Change Log

### Version 1.0 (January 30, 2026)

**Design System Standardization:**
- ✅ Documented all color tokens with light/dark mode support
- ✅ Defined consistent spacing scale (8px base grid)
- ✅ Standardized shadow system (3 levels: sm, md, lg)
- ✅ Created border opacity hierarchy (100%, 50%, 40%, 30%)
- ✅ Documented typography scale and font weights
- ✅ Defined icon sizing standards

**Component Patterns:**
- ✅ Standardized card variants (grid, carousel, note cards)
- ✅ Documented button variants (standard, icon, action)
- ✅ Created input/search patterns
- ✅ Standardized dropdown menu structure
- ✅ Defined badge/pill components

**Layout Patterns:**
- ✅ Documented container widths and grid layouts
- ✅ Standardized separator patterns
- ✅ Created composition examples (episode cards, control bars, note cards)

**Implementation Guidelines:**
- ✅ Code organization structure
- ✅ Naming conventions
- ✅ State management patterns
- ✅ Responsive design approach
- ✅ Accessibility standards
- ✅ Performance best practices

---

## Next Steps for Engineers

### Implementation Priority

**Phase 1: Foundation** ✅ Complete
- Design tokens defined in `/styles/globals.css`
- Base component library (shadcn/ui) integrated
- Typography and spacing system in place

**Phase 2: Component Library** ✅ Complete
- All UI components use semantic tokens
- Hover states standardized across components
- Card variants consistently implemented

**Phase 3: Feature Pages** ✅ Complete
- All pages use component library
- Consistent layout patterns applied
- Mobile responsiveness implemented

**Phase 4: Polish & Optimization** (Current)
- Performance optimization
- Accessibility audit
- Cross-browser testing
- Production deployment prep

### Key Implementation Notes

1. **Always use semantic color tokens** - never hardcode colors
2. **Follow the spacing scale** - stick to defined gap/padding values
3. **Use standard hover patterns** - don't create custom hover states
4. **Follow naming conventions** - keep component names consistent
5. **Test dark mode** - all components must work in both themes
6. **Check mobile responsiveness** - test all breakpoints

---

## Support & Questions

For questions or clarifications about the design system:
- Review this documentation first
- Check `/styles/globals.css` for token definitions
- Reference existing components for patterns
- Consult component compositions section for complex layouts

---

**End of Design System Documentation**
