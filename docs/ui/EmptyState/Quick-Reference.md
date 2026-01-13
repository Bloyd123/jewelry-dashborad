# 📋 EmptyState - Quick Reference Card

> **Print karke rakh lo! Quick reference ke liye!**

---

## 🚀 Quick Start (Copy-Paste)

### Basic Empty State
```typescript
import { EmptyState, EmptyStateIcons } from '@/components/ui/feedback/EmptyState'

<EmptyState
  icon={EmptyStateIcons.customers}
  title="customer.empty.title"
  description="customer.empty.description"
/>
```

### With Action
```typescript
<EmptyState
  icon={EmptyStateIcons.products}
  title="product.empty.title"
  action={{
    label: 'product.actions.add',
    onClick: () => handleAdd(),
  }}
/>
```

### Preset Components
```typescript
// Search
<EmptySearchResults query={searchQuery} onClear={handleClear} />

// Filter
<EmptyFilterResults onClearFilters={handleClearFilters} />

// Error
<EmptyErrorState onRetry={handleRetry} />

// Data
<EmptyDataState entityName="customers" onAdd={handleAdd} />
```

---

## 📊 Props Quick Reference

| Prop | Type | Example |
|------|------|---------|
| `title` | string | `"customer.empty.title"` |
| `description` | string | `"customer.empty.description"` |
| `icon` | Icon | `EmptyStateIcons.customers` |
| `variant` | string | `"default"` \| `"error"` \| `"search"` |
| `size` | string | `"sm"` \| `"md"` \| `"lg"` |
| `action` | object | `{ label, onClick }` |
| `fullHeight` | boolean | `true` \| `false` |
| `compact` | boolean | `true` \| `false` |

---

## 🎨 Variants

| Variant | Use Case | Color |
|---------|----------|-------|
| `default` | General | Gray |
| `search` | No search results | Accent |
| `filter` | No filter results | Accent |
| `error` | Error occurred | Red |
| `success` | Success empty | Green |
| `info` | Informational | Blue |

---

## 📏 Sizes

| Size | Icon | Padding | Use Case |
|------|------|---------|----------|
| `sm` | 12x12 | py-8 | Cards, sidebars |
| `md` | 16x16 | py-12 | Default |
| `lg` | 20x20 | py-16 | Full page |

---

## 🎯 Icons Available

```typescript
EmptyStateIcons.default      // General
EmptyStateIcons.customers    // Customer list
EmptyStateIcons.products     // Product list
EmptyStateIcons.orders       // Order list
EmptyStateIcons.invoices     // Invoice list
EmptyStateIcons.analytics    // Analytics
EmptyStateIcons.search       // Search
EmptyStateIcons.filter       // Filter
EmptyStateIcons.error        // Error
EmptyStateIcons.database     // Database
EmptyStateIcons.inbox        // Inbox
EmptyStateIcons.calendar     // Calendar
```

---

## 🔧 Common Patterns

### Pattern 1: Customer List
```typescript
<EmptyState
  icon={EmptyStateIcons.customers}
  title="customer.empty.title"
  description="customer.empty.description"
  action={{
    label: 'customer.actions.addFirst',
    onClick: () => navigate('/customers/new'),
    icon: <Plus className="h-4 w-4" />,
  }}
/>
```

### Pattern 2: Search Results
```typescript
<EmptySearchResults
  query={searchQuery}
  onClear={() => setSearchQuery('')}
/>
```

### Pattern 3: Filter Results
```typescript
<EmptyFilterResults
  onClearFilters={() => {
    clearFilters()
    setHasFilters(false)
  }}
/>
```

### Pattern 4: Error
```typescript
<EmptyErrorState
  title="common.error.loadFailed"
  onRetry={() => refetch()}
/>
```

### Pattern 5: Conditional
```typescript
if (error) return <EmptyErrorState onRetry={refetch} />
if (searchQuery && !results.length) return <EmptySearchResults query={searchQuery} />
if (hasFilters && !results.length) return <EmptyFilterResults />
if (!data.length) return <EmptyState title="..." action={{...}} />
```

---

## 📱 Responsive

### Desktop
```typescript
<EmptyState size="md" />
```

### Mobile
```typescript
const isMobile = useMediaQuery('(max-width: 768px)')
<EmptyState size={isMobile ? 'sm' : 'md'} compact={isMobile} />
```

### Card/Small Space
```typescript
<EmptyState size="sm" compact />
```

### Full Page
```typescript
<EmptyState size="lg" fullHeight />
```

---

## 📝 Module Examples

| Module | Code |
|--------|------|
| **Customers** | `<EmptyState icon={EmptyStateIcons.customers} .../>` |
| **Products** | `<EmptyState icon={EmptyStateIcons.products} .../>` |
| **Orders** | `<EmptyState icon={EmptyStateIcons.orders} .../>` |
| **Analytics** | `<EmptyState icon={EmptyStateIcons.analytics} .../>` |
| **Invoices** | `<EmptyState icon={EmptyStateIcons.invoices} .../>` |

---

## Checklist

Before using EmptyState, check:

- [ ] Correct variant chosen (default, error, search, filter)
- [ ] Appropriate size (sm for cards, md default, lg for pages)
- [ ] Icon matches context
- [ ] Title is i18n key (not hardcoded)
- [ ] Description is i18n key
- [ ] Action provided (if user can do something)
- [ ] Action label is i18n key
- [ ] Responsive size on mobile

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Text not translating | Use i18n keys: `title="customer.empty.title"` |
| Icon not showing | Check import: `import { EmptyStateIcons }` |
| Wrong size | Use `size="sm"` for cards, `"md"` default |
| Not responsive | Add `const isMobile = useMediaQuery()` |
| Action not clickable | Check `onClick` handler defined |

---

## 💡 Tips

1. Use preset components when possible
2. Always provide action if user can do something
3. Match variant to context (error for errors, search for search)
4. Use i18n keys for all text
5. Test on mobile (use compact mode)

---

## 📚 Full Documentation

See: `EmptyState Component - Complete Guide.md`

---

## 🎓 Quick Decision Tree

```
Need empty state?
  │
  ├─ Error occurred? → EmptyErrorState
  ├─ No search results? → EmptySearchResults  
  ├─ No filter results? → EmptyFilterResults
  ├─ No data at all? → EmptyDataState
  └─ Custom case? → EmptyState
```

---

**Print this card! Keep it handy! 🚀**