# Design System

UI design system for the Smart Agriculture IoT Dashboard.

## Design Principles

1. **Agriculture-first** — Green palette evokes farming/nature
2. **Clarity over decoration** — Data visibility is priority
3. **Dark mode native** — Not an afterthought, first-class support
4. **Responsive** — Works on mobile, tablet, desktop

## Color System

### Light Theme

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-page` | `#E8F0E4` | Page background |
| `--bg-card` | `#FFFFFF` | Card surfaces |
| `--bg-card-hover` | `#F0F5ED` | Card hover state |
| `--bg-muted` | `#DDE8D8` | Muted backgrounds |
| `--border` | `#D5DDD7` | Default borders |
| `--border-strong` | `#B0BFB3` | Emphasized borders |
| `--text-primary` | `#17231B` | Headings, primary text |
| `--text-secondary` | `#3D4F44` | Body text |
| `--text-muted` | `#647067` | Labels, captions |

### Dark Theme

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-page` | `#0F172A` | Page background |
| `--bg-card` | `#1E293B` | Card surfaces |
| `--bg-card-hover` | `#253449` | Card hover state |
| `--bg-muted` | `#1E293B` | Muted backgrounds |
| `--border` | `#334155` | Default borders |
| `--border-strong` | `#475569` | Emphasized borders |
| `--text-primary` | `#F1F5F9` | Headings, primary text |
| `--text-secondary` | `#94A3B8` | Body text |
| `--text-muted` | `#64748B` | Labels, captions |

### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-success` | `#10B981` | `#10B981` | Online, optimal, active |
| `--color-warning` | `#F59E0B` | `#F59E0B` | Moist, caution |
| `--color-danger` | `#EF4444` | `#EF4444` | Offline, dry, error |

### Brand Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--green-600` | `#166534` | `#4ADE80` | Primary accent, buttons |
| `--green-700` | `#15803D` | `#86EFAC` | Hover state |
| `--green-50` | `#F0FDF4` | `#143323` | Light accent backgrounds |
| `--blue-600` | `#0284C7` | `#0EA5E9` | Water/irrigation |
| `--blue-50` | `#F0F9FF` | `#0C2D44` | Water light backgrounds |

## Typography

**Font Family:** Space Grotesk (300-700 weight)

| Element | Size | Weight | Class |
|---------|------|--------|-------|
| Page title | 1.5rem | 700 | `text-[1.5rem] font-bold` |
| Section title | 1.1rem | 700 | `text-[1.1rem] font-bold` |
| Card title | 1.05rem | 700 | `text-[1.05rem] font-bold` |
| Body text | 0.875rem | 400 | `text-[0.875rem]` |
| Label | 0.75rem | 500 | `text-[0.75rem] font-medium` |
| Caption | 0.7rem | 500 | `text-[0.7rem] font-medium` |

**Responsive pattern:** `text-[0.8125rem] sm:text-[0.875rem]` — sizes adapt at `sm:` breakpoint.

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Page padding | `px-4 sm:px-6` | Horizontal page margins |
| Section gap | `space-y-5` | Between dashboard sections |
| Card padding | `p-4 sm:p-5 md:p-6` | Inner card spacing |
| Grid gap | `gap-4 sm:gap-5` | Between grid items |

## Border Radius

| Element | Radius | Class |
|---------|--------|-------|
| Cards | 20px (16px mobile) | `rounded-2xl` |
| Buttons | 12px | `rounded-xl` |
| Badges | 9999px | `rounded-full` |
| Toggle | 30px | `rounded-[30px]` |

## Shadows

**Card shadow (default):**
```css
box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
```

**Card shadow (hover):**
```css
box-shadow: 0 8px 25px rgba(0,0,0,0.08);
```

## Components

### Card

Shared `.card` class:
```css
background: var(--bg-card);
border-radius: 20px;
padding: 28px;
box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
```

Mobile: `padding: 20px 16px; border-radius: 16px;`

### Toggle Switch

- Size: 56×30px (desktop), 50×26px (mobile), 44×22px (small mobile)
- Knob: 24px diameter with white background
- Colors: red, blue, yellow, green, gray, purple, teal
- Transition: 0.3s ease

### Range Slider

- Track: 8px height, 4px border-radius
- Thumb: 20px diameter, white border, green fill
- Active track: green fill
- Inactive track: border color

### Buttons

| Type | Style |
|------|-------|
| Primary | `bg-accent text-white hover:bg-accent-hover` |
| Secondary | `border border-border bg-bg-muted text-text-secondary` |
| Danger | `text-danger hover:border-danger/30 hover:bg-danger/5` |

## Animations

### Page Transitions (framer-motion)

```tsx
// Fade in on enter
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2 }}
```

### Staggered Section Reveal

```tsx
const section = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};
```

### Splash Screen

- Wave animation: `splash-wave` (2s ease-out infinite)
- Pulse: `splash-pulse` (2s ease-in-out infinite)
- Progress: `splash-progress` (2.5s ease-in-out forwards)
- Duration: 3s total (2.5s display + 0.5s fade)

### Hover Effects

- Cards: `hover:shadow-md hover:-translate-y-0.5`
- Buttons: `hover:opacity-80`
- Icons: `whileHover={{ scale: 1.03 }}`

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Default | < 640px | Mobile: single column, smaller padding |
| `sm:` | ≥ 640px | Larger padding, adjusted font sizes |
| `md:` | ≥ 768px | Two-column layouts, larger icons |
| `lg:` | ≥ 1024px | Full dashboard layout |

## Dark Mode Implementation

- Uses `data-theme="dark"` attribute on `<html>` element
- Custom variant: `@custom-variant dark (&:where([data-theme="dark"] *));`
- Theme persisted to `localStorage`
- Flash prevention: synchronous script in `<head>` before React loads

## Iconography

**Library:** lucide-react

| Context | Size | Class |
|---------|------|-------|
| Header icons | 20px | `size-5` |
| Card icons | 18-22px | `size-[18px]` or `size={22}` |
| Button icons | 16-18px | `sm:size-5` |
| Status dots | 6-8px | `w-1.5 h-1.5` or `w-2 h-2` |
