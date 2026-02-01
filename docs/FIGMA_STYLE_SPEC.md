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

This specification should be used as the source of truth for all UI implementation going forward.
