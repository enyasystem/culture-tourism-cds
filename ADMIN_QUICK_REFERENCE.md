# Admin Dashboard - Quick Reference Guide

## 🚀 Quick Start

### For New Developers

1. **Understanding the Structure**
   ```
   /app/admin/
   ├─ page.tsx           ← Main dashboard (you are here)
   ├─ layout.tsx         ← Layout wrapper
   └─ [sections]/        ← Content, sites, events, etc.

   /components/admin/
   ├─ admin-layout-wrapper.tsx
   ├─ admin-layout.tsx
   ├─ admin-sidebar.tsx  ← Navigation
   ├─ content-management.tsx
   └─ create-story-modal.tsx
   ```

2. **Color System Quick Lookup**
   ```
   Sites:   Blue (#3B82F6)      → border-l-blue-500
   Events:  Purple (#A855F7)    → border-l-purple-500
   Stories: Green (#10B981)     → border-l-green-500
   Users:   Orange (#F97316)    → border-l-orange-500
   ```

3. **Key Components to Know**
   - `<StatsCard>` - Individual metric display
   - `<Card>` - Container for grouped content
   - `<Button>` - All clickable actions
   - `<Badge>` - Status/count indicators

## 📝 Common Tasks

### Add New Metric Card

```tsx
<Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-[COLOR]-500 hover:border-l-[COLOR]-600">
  <CardContent className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-2">Label Here</p>
        <p className="text-3xl font-bold text-foreground">99</p>
        <p className="text-xs text-green-600 mt-2 font-medium">Context</p>
      </div>
      <div className="bg-[COLOR]-100 p-3 rounded-lg">
        <IconComponent className="w-6 h-6 text-[COLOR]-600" />
      </div>
    </div>
  </CardContent>
</Card>
```

**Replace:**
- `[COLOR]` with color name (blue, purple, green, orange, red, etc.)
- `[COLOR]-500` with Tailwind color variant
- `Label Here` with actual label
- `99` with data value
- `IconComponent` with lucide-react icon
- `Context` with contextual label

### Add Quick Action Button

```tsx
<Link href="/admin/[section]">
  <Button variant="outline" className="w-full h-auto py-4 px-4 flex-col gap-3 hover:bg-primary/5 hover:border-primary transition-all">
    <IconComponent className="w-5 h-5" />
    <div className="text-left">
      <div className="font-semibold text-sm">Action Name</div>
      <div className="text-xs text-muted-foreground">Benefit/Description</div>
    </div>
  </Button>
</Link>
```

### Update Sidebar Navigation

Edit `/components/admin/admin-sidebar.tsx`:

```tsx
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", badge: null },
  { icon: NewIcon, label: "New Section", href: "/admin/new-section", badge: null },
  // Rest of items...
]
```

## 🎨 Styling Patterns

### Hover States
```tsx
className="hover:shadow-lg hover:border-l-blue-600 transition-all duration-300"
```

### Text Hierarchy
```tsx
<h1 className="text-4xl font-bold">Main Heading</h1>
<h2 className="text-2xl font-bold">Section Title</h2>
<h3 className="text-xl font-semibold">Card Title</h3>
<p className="text-base">Body text</p>
<p className="text-sm text-muted-foreground">Secondary text</p>
<p className="text-xs">Caption</p>
```

### Spacing
```tsx
// Padding
className="p-6"        // All sides
className="px-4 py-6"  // Horizontal/Vertical
className="pl-3 pr-6"  // Individual sides

// Gap (between items)
className="gap-3"      // Small
className="gap-4"      // Medium
className="gap-6"      // Large
className="gap-8"      // Extra large
```

### Colors
```tsx
// Text
className="text-foreground"          // Main text
className="text-muted-foreground"    // Secondary
className="text-green-600"           // Success
className="text-red-600"             // Error
className="text-white"               // On dark bg

// Background
className="bg-primary"               // Primary action
className="bg-blue-100"              // Light variant
className="bg-primary/5"             // Very light
className="bg-gradient-to-br"        // Gradient

// Borders
className="border border-border"     // Standard
className="border-l-4 border-l-blue-500"  // Colored left
className="border-b border-border/50"     // With opacity
```

## 🔍 Finding Things

### Where to Change...

| What | Where |
|------|-------|
| Dashboard title | `/app/admin/page.tsx` line ~130 |
| Metric cards | `/app/admin/page.tsx` lines ~150-200 |
| Quick actions | `/app/admin/page.tsx` lines ~200-260 |
| Sidebar links | `/components/admin/admin-sidebar.tsx` line ~24 |
| Sidebar styling | `/components/admin/admin-sidebar.tsx` lines ~65-110 |
| Colors | Tailwind config or inline classes |
| Icons | Import from `lucide-react` |

## 🐛 Debugging

### Dashboard Not Loading
```
1. Check console for errors
2. Verify Supabase connection
3. Check count fetch in useEffect
4. Verify table names (user_profiles, cultural_sites, etc.)
5. Check RLS policies if no data
```

### Colors Not Showing
```
1. Verify Tailwind is built
2. Check color name spelling
3. Run npm/pnpm install
4. Clear browser cache
5. Check tailwind.config.js
```

### Sidebar Hidden on Mobile
```
// Expected behavior - check CSS
hidden md:flex  // Hidden on mobile, visible on md+

// To change:
hidden lg:flex  // Hidden on desktop, visible on lg+
```

## 📊 Data Loading Flow

```
Dashboard Mount
    ↓
useEffect hook runs
    ↓
Fetch counts (4 queries) → Display with "..."
    ↓
Data arrives → Update state
    ↓
Re-render with real values
```

### Common Issues
- **Showing "..." forever**: Check Supabase connection
- **Wrong count**: Verify table names in query
- **Permissions error**: Check RLS policies

## 🎯 Performance Tips

### Optimize Dashboard
```tsx
// ✅ Good: Data fetches in parallel
Promise.all([fetch1, fetch2, fetch3])

// ❌ Bad: Sequential fetches
await fetch1; await fetch2; await fetch3;

// ✅ Good: Loading state shown immediately
state shows "..." → data updates smoothly

// ❌ Bad: Wait for data to show anything
No UI until all data loads
```

## 🧪 Testing the Dashboard

### Manual Testing Checklist
```
□ Dashboard loads
□ All metrics show values
□ Quick actions clickable
□ Sidebar collapses/expands
□ Mobile menu opens/closes
□ Hover effects work
□ No console errors
□ Load time < 2 seconds
```

### Test Data
Use dev database with sample data:
- 10 cultural sites
- 5 upcoming events
- 15 stories
- 32 active users

## 📚 Component Props

### StatsCard
```tsx
<StatsCard
  title="Label"
  value="99"
  change="↑ 12%"
  changeType="positive|neutral|negative"
  icon={IconComponent}
/>
```

### Card
```tsx
<Card className="optional-classes">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Button
```tsx
<Button
  variant="default|outline|ghost"
  size="sm|md|lg"
  className="optional"
  onClick={handler}
>
  Text or Icon
</Button>
```

## 🔗 Related Files

- **Dashboard**: `/app/admin/page.tsx`
- **Layout**: `/app/admin/layout.tsx`
- **Sidebar**: `/components/admin/admin-sidebar.tsx`
- **Content Mgmt**: `/components/admin/content-management.tsx`
- **Styles**: Tailwind CSS classes (in-line)
- **Icons**: `lucide-react` package
- **Components**: `/components/ui/` folder

## 🚀 Deployment Notes

- No database migrations needed
- No new environment variables
- CSS already optimized
- Mobile responsive by default
- Accessibility compliant (WCAG AA)

## 💬 Questions?

Refer to:
1. `ADMIN_UX_SUMMARY.md` - Overview of changes
2. `ADMIN_DESIGN_SYSTEM.md` - Visual reference
3. `ADMIN_IMPLEMENTATION_GUIDE.md` - Detailed guide
4. `ADMIN_DASHBOARD_UX_IMPROVEMENTS.md` - Complete documentation

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Production Ready
