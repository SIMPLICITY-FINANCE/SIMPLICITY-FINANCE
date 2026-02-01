# Figma Design System Specification

This document extracts the design system from the Figma screenshots to ensure visual parity across the application.

## Layout Grid

### Three-Column Layout
- **Left Sidebar**: 240px fixed width
- **Main Content**: Flexible, max-width 800px, centered
- **Right Rail**: 320px fixed width (optional, shown on home/dashboard)

### Breakpoints
- Desktop: 1280px+ (shows all three columns)
- Tablet: 768px-1279px (hide right rail)
- Mobile: <768px (hide sidebar, show hamburger menu)

### Spacing
- Container padding: 24px
- Section gap: 32px
- Card padding: 24px
- Compact padding: 16px

---

## Colors

### Background
- `bg-primary`: #FFFFFF (white)
- `bg-secondary`: #F9FAFB (light gray, off-white)
- `bg-tertiary`: #F3F4F6 (slightly darker gray)

### Surface
- `surface-card`: #FFFFFF with shadow
- `surface-hover`: #F9FAFB
- `surface-selected`: #F3F4F6

### Borders
- `border-default`: #E5E7EB (light gray)
- `border-hover`: #D1D5DB (medium gray)
- `border-focus`: #3B82F6 (blue)

### Text
- `text-primary`: #111827 (near black)
- `text-secondary`: #6B7280 (gray)
- `text-tertiary`: #9CA3AF (light gray)
- `text-muted`: #D1D5DB (very light gray)

### Accent Colors
- `accent-primary`: #3B82F6 (blue)
- `accent-hover`: #2563EB (darker blue)
- `accent-yellow`: #FCD34D (crown/premium)
- `accent-red`: #EF4444 (notifications badge)

### Brand
- `brand-primary`: #1E293B (dark navy - logo background)
- `brand-accent`: #8B5CF6 (purple - logo icon)

---

## Typography

### Font Family
- Primary: System font stack (Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- Monospace: For code/IDs (SF Mono, Monaco, Consolas)

### Type Scale

#### Headings
- `h1`: 32px / 2rem, font-weight: 700 (bold), line-height: 1.2
- `h2`: 24px / 1.5rem, font-weight: 600 (semibold), line-height: 1.3
- `h3`: 20px / 1.25rem, font-weight: 600 (semibold), line-height: 1.4
- `h4`: 18px / 1.125rem, font-weight: 600 (semibold), line-height: 1.4

#### Body
- `body-lg`: 16px / 1rem, font-weight: 400 (regular), line-height: 1.6
- `body-md`: 14px / 0.875rem, font-weight: 400 (regular), line-height: 1.5
- `body-sm`: 13px / 0.8125rem, font-weight: 400 (regular), line-height: 1.5
- `body-xs`: 12px / 0.75rem, font-weight: 400 (regular), line-height: 1.4

#### Labels
- `label-md`: 14px / 0.875rem, font-weight: 500 (medium), line-height: 1.4
- `label-sm`: 13px / 0.8125rem, font-weight: 500 (medium), line-height: 1.4
- `label-xs`: 11px / 0.6875rem, font-weight: 500 (medium), line-height: 1.3

---

## Components

### Buttons

#### Primary Button
- Background: `#3B82F6` (blue)
- Text: white, 14px, font-weight: 500
- Padding: 10px 20px
- Border-radius: 8px
- Hover: `#2563EB` (darker blue)
- Active: scale(0.98)

#### Secondary Button
- Background: `#F3F4F6` (light gray)
- Text: `#111827` (dark), 14px, font-weight: 500
- Padding: 10px 20px
- Border-radius: 8px
- Hover: `#E5E7EB`

#### Ghost Button
- Background: transparent
- Text: `#6B7280` (gray), 14px, font-weight: 500
- Padding: 8px 16px
- Border-radius: 6px
- Hover: `#F9FAFB`

#### Icon Button
- Size: 40px × 40px
- Border-radius: 8px
- Background: transparent
- Hover: `#F3F4F6`
- Icon size: 20px

### Input Fields

#### Text Input
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid `#E5E7EB`
- Border-radius: 8px
- Font-size: 14px
- Placeholder: `#9CA3AF`
- Focus: border `#3B82F6`, ring 2px `#3B82F620`

#### Search Input
- Same as text input
- Icon: 20px magnifying glass, left-aligned, `#9CA3AF`
- Padding-left: 44px (to accommodate icon)

### Cards

#### Episode Card (Feed)
- Background: white
- Border: 1px solid `#E5E7EB`
- Border-radius: 12px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: shadow increases to 0 4px 6px rgba(0,0,0,0.1)

#### Episode Card (Saved/List View)
- Background: white
- Border: 1px solid `#E5E7EB`
- Border-radius: 12px
- Padding: 16px
- Display: flex (thumbnail left, content right)
- Thumbnail: 120px × 80px, border-radius: 8px

#### Summary Card (Notebook)
- Background: white
- Border: 1px solid `#E5E7EB`
- Border-radius: 12px
- Padding: 20px
- Thumbnail: 180px × 120px, border-radius: 8px
- Horizontal layout

### Chips/Tags

#### Topic Chip
- Background: `#F3F4F6`
- Text: `#6B7280`, 13px, font-weight: 500
- Padding: 6px 12px
- Border-radius: 6px
- Hover: `#E5E7EB`

#### Badge (Notification)
- Background: `#EF4444` (red)
- Text: white, 11px, font-weight: 600
- Size: 20px × 20px (circular)
- Position: absolute top-right of icon

### Navigation

#### Sidebar Nav Item
- Height: 44px
- Padding: 12px 16px
- Border-radius: 8px
- Icon: 20px, `#6B7280`
- Text: 14px, font-weight: 500, `#6B7280`
- Hover: background `#F3F4F6`
- Active: background `#F3F4F6`, text `#111827`, icon `#111827`

#### Sidebar Show Item
- Height: 44px
- Padding: 12px 16px
- Border-radius: 8px
- Avatar: 32px × 32px, border-radius: 50%
- Text: 14px, font-weight: 500, `#6B7280`
- Hover: background `#F3F4F6`

### Modals

#### Modal Overlay
- Background: rgba(0, 0, 0, 0.5)
- Backdrop-blur: 4px

#### Modal Container
- Background: white
- Border-radius: 16px
- Max-width: 800px
- Padding: 32px
- Shadow: 0 20px 25px rgba(0, 0, 0, 0.15)

#### Modal Header
- Close button: top-right, 40px × 40px icon button
- Title: 24px, font-weight: 600
- Margin-bottom: 24px

### Tables (Admin)

#### Table Header
- Background: `#F9FAFB`
- Text: 12px, font-weight: 600, uppercase, `#6B7280`
- Padding: 12px 16px
- Border-bottom: 1px solid `#E5E7EB`

#### Table Row
- Padding: 16px
- Border-bottom: 1px solid `#F3F4F6`
- Hover: background `#F9FAFB`

#### Table Cell
- Text: 14px, `#111827`
- Vertical-align: middle

### Right Rail Components

#### Up Next Card
- Background: white
- Border: 1px solid `#E5E7EB`
- Border-radius: 12px
- Padding: 16px
- Thumbnail: 80px × 80px, border-radius: 8px
- Margin-bottom: 12px

#### Suggestions Carousel
- Avatar: 80px × 80px, border-radius: 12px
- Name: 13px, font-weight: 500, center-aligned
- Horizontal scroll with arrows

#### Quick Action Buttons
- Grid: 3 columns
- Button: 100% width, padding 12px
- Icon: 20px
- Text: 13px, font-weight: 500
- Border: 1px solid `#E5E7EB`
- Border-radius: 8px

---

## Spacing System

### Padding Scale
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `2xl`: 24px
- `3xl`: 32px
- `4xl`: 40px

### Gap Scale (Flexbox/Grid)
- `gap-2`: 8px
- `gap-3`: 12px
- `gap-4`: 16px
- `gap-6`: 24px
- `gap-8`: 32px

### Section Rhythm
- Between major sections: 32px
- Between cards in list: 16px
- Between form fields: 16px
- Between modal sections: 24px

---

## Icons

### Icon Library
- Use Lucide React icons (or similar)
- Default size: 20px
- Small size: 16px
- Large size: 24px

### Common Icons
- Home: `Home`
- Saved: `Bookmark`
- Notebook: `BookOpen`
- Reports: `FileText` (with badge)
- Upload: `Upload`
- Discover: `Compass`
- Search: `Search`
- Filter: `Filter`
- Share: `Share2`
- Download: `Download`
- More: `MoreVertical`
- Close: `X`
- ChevronRight: `ChevronRight`
- ChevronLeft: `ChevronLeft`

---

## Shadows

### Card Shadow
- Default: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`
- Hover: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`

### Modal Shadow
- `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

### Dropdown Shadow
- `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

---

## Animation

### Transitions
- Default: `all 150ms ease-in-out`
- Hover: `all 200ms ease-in-out`
- Modal: `all 300ms cubic-bezier(0.4, 0, 0.2, 1)`

### Hover States
- Scale: `scale(1.02)` for cards
- Opacity: `opacity: 0.8` for images
- Background: lighten by 1 shade

---

## Implementation Notes

### Tailwind Classes Mapping

#### Colors
- `bg-primary` → `bg-white`
- `bg-secondary` → `bg-gray-50`
- `text-primary` → `text-gray-900`
- `text-secondary` → `text-gray-600`
- `border-default` → `border-gray-200`

#### Typography
- `h1` → `text-3xl font-bold`
- `h2` → `text-2xl font-semibold`
- `body-md` → `text-sm`
- `label-sm` → `text-xs font-medium`

#### Spacing
- Padding: `p-6` (24px), `p-4` (16px)
- Gap: `gap-4` (16px), `gap-6` (24px)
- Margin: `mb-8` (32px), `mb-4` (16px)

#### Borders
- Radius: `rounded-lg` (8px), `rounded-xl` (12px)
- Width: `border` (1px)

---

## Page-Specific Patterns

### Home/Dashboard Feed
- Max-width: 800px
- Card spacing: 16px vertical gap
- Search bar: full width, sticky top
- Filter dropdown: right-aligned

### Saved/List Views
- Horizontal card layout
- Thumbnail left (120px × 80px)
- Content right (flexible)
- Metadata row: icons + text, gray

### Notebook
- Recent summaries carousel at top
- Full summary cards below
- Checkboxes for key points
- Collapsible sections

### Reports
- Simple list layout
- Report type badge
- Summary count
- Date right-aligned

### Episode Detail Modal
- Full-width modal (800px max)
- Sections: Key Quotes, Summary (collapsible)
- Topic chips below content
- Actions: bookmark, share, download

### Right Rail
- Fixed position
- Up Next section (3 cards)
- Suggestions carousel
- Quick action grid (3×3)

---

## Accessibility

- Focus states: 2px blue ring
- Keyboard navigation: all interactive elements
- ARIA labels: for icon-only buttons
- Color contrast: WCAG AA minimum
- Touch targets: 44px minimum

---

## Figma Export Token Map

**Source:** Extracted from `/docs/simplicity-export/src/styles/globals.css` and `/docs/simplicity-export/src/DESIGN_SYSTEM.md`

This section contains the **exact design tokens** from the Figma code export. These are the authoritative values that should be implemented in our Next.js application.

### Semantic Color Tokens (Light Mode)

```css
--background: #ffffff;           /* Page background */
--foreground: #1a1a1a;          /* Primary text */
--card: #ffffff;                 /* Card backgrounds */
--card-foreground: #1a1a1a;     /* Card text */
--popover: #ffffff;              /* Popover/dropdown backgrounds */
--popover-foreground: #1a1a1a;  /* Popover text */
--primary: #1a1a1a;             /* Primary brand color */
--primary-foreground: #ffffff;   /* Text on primary */
--secondary: #f5f5f5;           /* Secondary backgrounds */
--secondary-foreground: #1a1a1a; /* Secondary text */
--muted: #f5f5f5;               /* Muted backgrounds (hover states) */
--muted-foreground: #737373;    /* Secondary/muted text */
--accent: #f5f5f5;              /* Accent backgrounds */
--accent-foreground: #1a1a1a;   /* Accent text */
--destructive: #dc2626;         /* Error/danger states */
--destructive-foreground: #ffffff; /* Text on destructive */
--border: rgba(0, 0, 0, 0.1);   /* Border color */
--input: transparent;            /* Input background */
--input-background: #f9f9f9;    /* Input field background */
--ring: #a3a3a3;                /* Focus ring color */
```

### Semantic Color Tokens (Dark Mode)

```css
.dark {
  --background: #242424;
  --foreground: #e5e5e5;
  --card: #2a2a2a;
  --card-foreground: #e5e5e5;
  --popover: #2a2a2a;
  --popover-foreground: #e5e5e5;
  --primary: #f5f5f5;
  --primary-foreground: #1a1a1a;
  --secondary: #323232;
  --secondary-foreground: #e5e5e5;
  --muted: #2d2d2d;
  --muted-foreground: #a3a3a3;
  --accent: #323232;
  --accent-foreground: #e5e5e5;
  --destructive: #ef4444;
  --destructive-foreground: #fecaca;
  --border: #3a3a3a;
  --input: #2d2d2d;
  --ring: #525252;
}
```

### Sidebar Tokens

```css
--sidebar: #fafafa;                      /* Sidebar background (light) */
--sidebar-foreground: #1a1a1a;          /* Sidebar text */
--sidebar-primary: #1a1a1a;             /* Active nav item */
--sidebar-primary-foreground: #fafafa;  /* Active nav text */
--sidebar-accent: #f5f5f5;              /* Hover state */
--sidebar-accent-foreground: #262626;   /* Hover text */
--sidebar-border: #e5e5e5;              /* Sidebar borders */
--sidebar-ring: #a3a3a3;                /* Focus ring */

/* Dark mode */
.dark {
  --sidebar: #1a1a1a;
  --sidebar-foreground: #e5e5e5;
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: #f5f5f5;
  --sidebar-accent: #252525;
  --sidebar-accent-foreground: #e5e5e5;
  --sidebar-border: #2d2d2d;
  --sidebar-ring: oklch(0.439 0 0);
}
```

### Border Radius Scale

```css
--radius: 0.625rem;                    /* Base radius = 10px */
--radius-sm: calc(var(--radius) - 4px); /* 6px - buttons, inputs */
--radius-md: calc(var(--radius) - 2px); /* 8px - standard */
--radius-lg: var(--radius);             /* 10px - cards */
--radius-xl: calc(var(--radius) + 4px); /* 14px - large cards */
--radius-2xl: 1rem;                     /* 16px - modals */
--radius-3xl: 1.5rem;                   /* 24px - sidebar containers */
```

### Typography Scale

```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
--font-size: 17px;                      /* Base font size */

/* Font Sizes */
--text-xs: 0.75rem;                     /* 12px */
--text-sm: 0.875rem;                    /* 14px */
--text-base: 1rem;                      /* 16px */
--text-lg: 1.125rem;                    /* 18px */
--text-xl: 1.25rem;                     /* 20px */
--text-2xl: 1.5rem;                     /* 24px */
--text-3xl: 1.875rem;                   /* 30px */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-relaxed: 1.625;
```

### Spacing Scale (8px Base Grid)

```css
--spacing: 0.25rem;                     /* 4px base unit */

/* Common spacing values */
0.5 = 2px   (micro spacing)
1   = 4px   (tight spacing)
1.5 = 6px   (small spacing)
2   = 8px   (base spacing)
2.5 = 10px  (card padding small)
3   = 12px  (card padding default)
4   = 16px  (section padding)
5   = 20px  (large gaps)
7   = 28px  (section separators)
```

### Shadow Scale

**3-Level Shadow System:**

```css
/* Base shadow - default card state */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)

/* Elevated shadow - hover state, active elements */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)

/* Floating shadow - dropdowns, modals, sidebars */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
```

### Border Opacity Hierarchy

```css
border-border       /* 100% - Active states, hover */
border-border/50    /* 50% - Default card borders */
border-border/40    /* 40% - Subtle borders (note cards) */
border-border/30    /* 30% - Separators, dividers */
```

---

## Interaction State Patterns

**Extracted from Figma export components - these are the exact hover/focus/active patterns to implement.**

### Button States

**Primary Button:**
```tsx
className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium 
           hover:bg-primary/90 active:scale-[0.98] 
           focus:outline-none focus:ring-2 focus:ring-ring/20 
           transition-all duration-150 shadow-sm"
```

**Secondary Button:**
```tsx
className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium 
           hover:bg-muted transition-all duration-150 shadow-sm"
```

**Ghost Button:**
```tsx
className="px-4 py-2 bg-transparent text-foreground rounded-lg font-medium 
           hover:bg-muted transition-all duration-150"
```

**Icon Button (Small):**
```tsx
className="w-7 h-7 rounded-lg hover:bg-muted transition-all 
           flex items-center justify-center"
```

**Icon Button (Medium):**
```tsx
className="w-10 h-10 rounded-lg bg-card border border-border/50 
           hover:bg-muted transition-all shadow-sm 
           flex items-center justify-center"
```

### Card States

**Standard Card (Grid/Feed):**
```tsx
className="bg-card rounded-xl border border-border/50 shadow-sm 
           hover:shadow-md hover:bg-accent/30 hover:border-border 
           transition-all duration-200"
```

**Carousel Card (Compact):**
```tsx
className="bg-card rounded-xl border border-border/50 shadow-sm 
           hover:shadow-md hover:bg-accent/30 hover:border-border 
           transition-all"
```

**Large Note Card:**
```tsx
className="bg-card border border-border/40 rounded-2xl shadow-sm 
           hover:shadow-md hover:bg-accent/30 hover:border-border 
           transition-all"
```

**Sidebar Container:**
```tsx
className="bg-card border border-border/50 rounded-3xl shadow-lg"
```

### Input States

**Standard Input:**
```tsx
className="w-full px-4 py-2 bg-card border border-border rounded-lg 
           text-sm text-foreground placeholder:text-muted-foreground
           focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
           focus:border-indigo-500 transition-all shadow-sm"
```

**Search Input with Icon:**
```tsx
<div className="relative flex-1">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <input 
    className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg 
               text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
               focus:border-indigo-500 transition-all shadow-sm"
  />
</div>
```

### Link States

**Standard Link:**
```tsx
className="text-foreground hover:text-primary transition-colors"
```

**Underline Link:**
```tsx
className="text-foreground underline-offset-4 hover:underline"
```

### Dropdown/Menu States

**Dropdown Container:**
```tsx
className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border/50 
           rounded-xl shadow-lg z-20 overflow-hidden"
```

**Menu Item:**
```tsx
className="w-full px-3 py-2 rounded-lg text-sm font-medium 
           transition-all text-left hover:bg-muted/50"
```

**Menu Separator:**
```tsx
className="border-t border-border/30 my-1"
```

### Focus Ring Pattern

**Standard Focus Ring (Indigo):**
```css
focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
```

**Neutral Focus Ring:**
```css
focus:outline-none focus:ring-2 focus:ring-ring/50
```

### Transition Timing

**Standard Transition:**
```css
transition-all duration-150
```

**Card Hover Transition:**
```css
transition-all duration-200
```

**Ease Functions:**
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Icon Sizing Standards

From Figma export:

| Size | Class | Pixels | Usage |
|------|-------|--------|-------|
| **Micro** | `w-[10px] h-[10px]` | 10px | Carousel card icons |
| **Small** | `w-[11px] h-[11px]` | 11px | Grid card icons |
| **Standard** | `w-3 h-3` | 12px | Metadata icons |
| **Medium** | `w-3.5 h-3.5` | 14px | Button icons |
| **Large** | `w-4 h-4` | 16px | Search icons, nav icons |

---

## Implementation Rules

1. **Always use semantic tokens** - Never hardcode colors like `#ffffff` or `bg-white`
2. **Use CSS variables** - Implement tokens as CSS custom properties in `app/globals.css`
3. **Follow exact hover patterns** - Use the interaction states documented above
4. **Maintain border opacity hierarchy** - Use `/50`, `/40`, `/30` consistently
5. **Apply shadow scale correctly** - `shadow-sm` default, `shadow-md` hover, `shadow-lg` floating
6. **Use 8px spacing grid** - Stick to defined spacing values (2, 2.5, 3, 4, 7)
7. **Support dark mode** - All tokens must work in both light and dark themes
8. **Focus rings are indigo** - Use `focus:ring-indigo-500/20` pattern
9. **Transitions are 150-200ms** - Use `duration-150` or `duration-200`
10. **Border radius follows scale** - `rounded-lg` (10px) for cards, `rounded-xl` (12px) for larger cards

---

This specification should be used as the source of truth for all UI implementation going forward.
