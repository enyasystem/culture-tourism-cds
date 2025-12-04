# Admin Dashboard Visual Design Guide

## 🎨 Color System

### Primary Metrics Colors

```
Site Card (Blue)
├─ Background: #3B82F6
├─ Light Background: #EFF6FF (blue-50)
├─ Hover Border: border-l-blue-600
└─ Icon: text-blue-600

Event Card (Purple)
├─ Background: #A855F7
├─ Light Background: #F8F0FF (purple-50)
├─ Hover Border: border-l-purple-600
└─ Icon: text-purple-600

Story Card (Green)
├─ Background: #10B981
├─ Light Background: #F0FDF4 (green-50)
├─ Hover Border: border-l-green-600
└─ Icon: text-green-600

User Card (Orange)
├─ Background: #F97316
├─ Light Background: #FFFBEB (orange-50)
├─ Hover Border: border-l-orange-600
└─ Icon: text-orange-600
```

### Semantic Colors

```
Success: #10B981 (Green) - Used for positive metrics
Warning: #F59E0B (Amber) - Used for pending items
Error: #EF4444 (Red) - Used for destructive actions
Info: #3B82F6 (Blue) - Used for informational content
Neutral: #6B7280 (Gray) - Used for secondary text
```

## 📐 Layout Structure

### Dashboard Grid

```
┌─────────────────────────────────────────────────────────┐
│  Header: "Dashboard"                                    │
│  Subheader: "Welcome back..."              [Create Story]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐ │
│  │   SITES  │  │  EVENTS  │  │ STORIES  │ │  USERS   │ │
│  │    10    │  │    5     │  │    15    │ │    32    │ │
│  └──────────┘  └──────────┘  └──────────┘ └──────────┘ │
│                                                         │
│  ┌──────────────────────────┐  ┌──────────────────────┐ │
│  │   QUICK ACTIONS          │  │  AT A GLANCE         │ │
│  │                          │  │                      │ │
│  │  [Stories] [Sites]       │  │  Content Health: 75% │ │
│  │  [Events]  [Settings]    │  │  User Activity: 82%  │ │
│  │                          │  │  [View Details →]    │ │
│  └──────────────────────────┘  └──────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  CONTENT MANAGEMENT (Stories List)                 │ │
│  │                                                     │ │
│  │  [Story 1]  [Story 2]  [Story 3]                   │ │
│  │                                                     │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Sidebar Layout

```
SIDEBAR (Desktop)
┌─────────────────────┐
│ • Admin Panel       │  ← Accent dot + header
│   Jos Culture      │
├─────────────────────┤
│ 🎯 Dashboard       │  ← Active state: Primary color
│ 📍 Cultural Sites  │     Hover: Primary color bg
│ 📅 Events          │
│ 📷 Stories         │
│ ⚙️  Settings       │
├─────────────────────┤
│ [Logout]           │  ← Bottom action
└─────────────────────┘
```

## 🎯 Card Design

### Metric Card Anatomy

```
┌────────────────────────────────────┐  ← border-l-4 color-coded
│  Culture Sites          [📍 Icon]  │
│                    (Blue bg)       │
│  10                                │
│  Total locations                   │
└────────────────────────────────────┘
 ↑                                  ↑
 │                                  │
 └──────────────────────────────────┘
 Hover: shadow-lg + border-l lift
```

### Quick Action Button

```
┌──────────────────────────────┐
│ 📷                           │  ← Icon (w-5 h-5)
│ Manage Stories               │  ← Action label
│ Edit & moderate content      │  ← Benefit/description
└──────────────────────────────┘
 Hover: bg-primary/5 border-primary
```

## 📏 Typography Scale

```
h1: text-4xl (36px) font-bold       ← "Dashboard"
h2: text-2xl (24px) font-bold       ← Section titles
h3: text-xl (20px) font-semibold    ← Card titles
body: text-base (16px)              ← Default
sm: text-sm (14px)                  ← Labels, captions
xs: text-xs (12px)                  ← Hints, secondary
```

### Font Weights

```
Light:      font-light (300)        ← Rarely used
Normal:     font-normal (400)       ← Body text
Medium:     font-medium (500)       ← Labels
Semibold:   font-semibold (600)     ← Subheadings
Bold:       font-bold (700)         ← Headlines
```

## 🔄 Spacing System

### Padding Scale
```
xs: p-1.5  (6px)
sm: p-3    (12px)
md: p-4    (16px)
lg: p-6    (24px)
xl: p-8    (32px)
```

### Gap Scale
```
xs: gap-2  (8px)
sm: gap-3  (12px)
md: gap-4  (16px)
lg: gap-6  (24px)
xl: gap-8  (32px)
```

### Margin Scale
```
Sidebar:     w-64 (256px)
Card padding: p-6 (24px)
Page margin:  mx-auto (centered)
Page padding: px-4 sm:px-6 md:px-8 (responsive)
```

## 🎬 Animations & Transitions

### Hover States
```css
transition: all duration-300

Card:
  - shadow-none → shadow-lg
  - border-l-color → border-l-darker-color
  - transform: none → scale-[1.02]

Button:
  - bg-ghost → bg-primary/10
  - color: fg → color: primary

Navigation:
  - bg-ghost → bg-primary
  - text-fg → text-white
```

## 📱 Responsive Behavior

### Breakpoints

```
Mobile (< 640px)
├─ 1 column layout
├─ Full width cards
├─ Sidebar as overlay
└─ Hamburger menu

Tablet (640px - 1024px)
├─ 2 column layout (metrics)
├─ Sidebar visible
└─ Stacked quick actions

Desktop (> 1024px)
├─ 4 column layout (metrics)
├─ Sidebar 64px-256px (collapsible)
├─ 2 column quick actions
└─ Full layout optimization
```

## 🔧 Implementation Classes

### Color Utilities
```html
<!-- Border colors -->
border-l-blue-500 border-l-purple-500 border-l-green-500 border-l-orange-500

<!-- Background colors -->
bg-blue-100 bg-purple-100 bg-green-100 bg-orange-100

<!-- Text colors -->
text-blue-600 text-purple-600 text-green-600 text-orange-600

<!-- Hover states -->
hover:border-l-blue-600 hover:bg-primary/10 hover:shadow-lg
```

### Layout Classes
```html
<!-- Grid -->
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6

<!-- Flexbox -->
flex flex-col md:flex-row items-center justify-between

<!-- Spacing -->
p-6 px-4 py-8 mb-8 gap-6

<!-- Responsive -->
hidden md:flex md:flex-row flex-col lg:grid-cols-4
```

### State Classes
```html
<!-- Active/Hover -->
hover:shadow-lg hover:border-l-color-600 transition-all duration-300

<!-- Focus -->
focus:outline-none focus:ring-2 focus:ring-primary

<!-- Disabled -->
opacity-50 cursor-not-allowed disabled:opacity-50
```

## 🎨 Design Tokens

### Shadows
```css
shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1)
shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.15)
```

### Border Radius
```css
rounded-sm:  2px
rounded-md:  6px
rounded-lg:  8px
rounded-xl:  12px
rounded-2xl: 16px
```

### Borders
```css
border:     1px solid
border-2:   2px solid
border-l-4: 4px solid left
```

## 🖼️ Visual Examples

### Metric Card - Detailed View
```
┌─ border-l-4 border-l-blue-500 ─┐
│                                │  p-6
│  text-sm text-muted-foreground │
│  Cultural Sites                │
│                    [bg-blue-100]│
│  text-3xl font-bold            │  py-2
│  10                            │
│                                │
│  text-xs text-green-600        │  mt-2
│  Total locations               │
│                                │
└────────────────────────────────┘
```

### Active Navigation Item
```
┌─────────────────────────────┐
│ bg-primary text-white       │
│ ➜ Dashboard                 │
│ gap-3 px-3 py-2            │
│                             │
│ w-full justify-start        │
└─────────────────────────────┘
```

## 📊 Accessibility Specifications

### Color Contrast
- Text on background: 4.5:1 (WCAG AA)
- Large text on background: 3:1 (WCAG AA)
- Icon on background: 3:1 (WCAG AA)

### Focus States
- Clear focus ring: 2px solid primary
- Focus visible on all interactive elements
- Keyboard navigation supported

### Typography
- Minimum font size: 12px (xs - rarely used)
- Recommended minimum: 14px (sm)
- Line height: 1.5 for body text

---

**Design System Version**: 1.0  
**Last Updated**: December 2024  
**Components**: Dashboard, Sidebar, Cards, Buttons, Navigation
