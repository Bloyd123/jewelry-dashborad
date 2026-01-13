# 📭 EmptyState Component - Complete Developer Guide

> **Fully flexible, reusable empty state component for all modules!**

---

## 📖 Table of Contents

1. [What is EmptyState?](#what-is)
2. [When to Use](#when-to-use)
3. [Basic Usage](#basic-usage)
4. [All Props Explained](#props-explained)
5. [Preset Components](#preset-components)
6. [Real Examples by Module](#real-examples)
7. [Responsive Design](#responsive)
8. [Best Practices](#best-practices)

---

<a name="what-is"></a>
## 1. What is EmptyState?

**EmptyState** ek **universal component** hai jo **empty/no-data scenarios** ko beautifully handle karta hai across your entire application.

### Features

✅ **Fully Flexible** - Any module mein use karo  
✅ **Responsive** - Mobile, tablet, desktop perfect  
✅ **Theme-Based** - CSS variables only  
✅ **i18n Ready** - All text translatable  
✅ **Multiple Variants** - Default, error, success, info, search, filter  
✅ **Multiple Sizes** - sm, md, lg  
✅ **Actions Support** - Primary & secondary buttons  
✅ **Custom Content** - Complete flexibility  
✅ **Preset Components** - Common use cases ready  
✅ **TypeScript** - Full type safety  

---

<a name="when-to-use"></a>
## 2. When to Use

### Use EmptyState When:

| Scenario | Example |
|----------|---------|
| **No Data** | Customer list empty, no products yet |
| **Search Results** | No matches found for search query |
| **Filter Results** | Filters return zero results |
| **Date Range** | No data in selected date range |
| **Error State** | API failed, network error |
| **Loading Complete** | Data loaded but empty |
| **Permission Denied** | User can't see any data |
| **Fresh Start** | New user, no data created yet |

### Don't Use When:

❌ Loading state (use Skeleton instead)  
❌ Single item missing (use inline message)  
❌ Temporary states (use Toast/Alert)  
❌ Form validation errors (use form error messages)  

---

<a name="basic-usage"></a>
## 3. Basic Usage

### Simplest Example

```typescript
import { EmptyState, EmptyStateIcons } from '@/components/ui/feedback/EmptyState'

<EmptyState
  icon={EmptyStateIcons.default}
  title="ui.emptyState.noData"
  description="ui.emptyState.getStarted"
/>
```

### With Action Button

```typescript
<EmptyState
  icon={EmptyStateIcons.customers}
  title="customer.empty.title"
  description="customer.empty.description"
  action={{
    label: 'customer.actions.addFirst',
    onClick: () => handleAdd(),
    icon: <Plus className="h-4 w-4" />,
  }}
/>
```

### With Two Actions

```typescript
<EmptyState
  icon={EmptyStateIcons.products}
  title="product.empty.title"
  description="product.empty.description"
  action={{
    label: 'product.actions.addProduct',
    onClick: handleAdd,
  }}
  secondaryAction={{
    label: 'product.actions.importProducts',
    onClick: handleImport,
    variant: 'outline',
  }}
/>
```

---

<a name="props-explained"></a>
## 4. All Props Explained

### Content Props

```typescript
// Title (translatable)
title?: string
// Example: "customer.empty.title"

// Description (translatable)
description?: string
// Example: "customer.empty.description"

// Icon (Lucide icon or custom JSX)
icon?: React.ReactNode | LucideIcon
// Example: EmptyStateIcons.customers or <CustomIcon />

// Children (for complete custom content)
children?: React.ReactNode
```

---

### Variant Prop

```typescript
variant?: 'default' | 'search' | 'filter' | 'error' | 'success' | 'info'
```

| Variant | Use Case | Icon Color |
|---------|----------|------------|
| `default` | General empty state | Gray |
| `search` | No search results | Accent |
| `filter` | No filter results | Accent |
| `error` | Error occurred | Red |
| `success` | Success but empty | Green |
| `info` | Informational | Blue |

---

### Size Prop

```typescript
size?: 'sm' | 'md' | 'lg'
```

| Size | Use Case | Icon Size | Padding |
|------|----------|-----------|---------|
| `sm` | Cards, sidebars, compact spaces | 12x12 (3rem) | py-8 px-4 |
| `md` | Default, most common | 16x16 (4rem) | py-12 px-6 |
| `lg` | Full page, hero sections | 20x20 (5rem) | py-16 px-8 |

---

### Action Props

```typescript
// Primary action
action?: {
  label: string           // Translation key
  onClick: () => void     // Handler function
  variant?: 'default' | 'outline' | 'ghost'
  icon?: React.ReactNode  // Optional icon
  disabled?: boolean      // Disable button
  loading?: boolean       // Show loading state
}

// Secondary action (same structure)
secondaryAction?: EmptyStateAction
```

**Example:**
```typescript
action={{
  label: 'customer.actions.addFirst',
  onClick: () => navigate('/customers/new'),
  icon: <Plus className="h-4 w-4" />,
}}
```

---

### Custom Content Props

```typescript
// Image/Illustration
image?: string
imageAlt?: string

// Custom content block (above actions)
customContent?: React.ReactNode

// Complete custom content (below actions)
children?: React.ReactNode
```

---

### Styling Props

```typescript
className?: string              // Container class
iconClassName?: string          // Icon class
titleClassName?: string         // Title class
descriptionClassName?: string   // Description class
```

---

### Layout Props

```typescript
fullHeight?: boolean    // Min height 400px (for full page)
compact?: boolean       // Reduced padding (for small spaces)
```

---

<a name="preset-components"></a>
## 5. Preset Components

### 5.1 EmptySearchResults

**Use When:** Search returns no results

```typescript
import { EmptySearchResults } from '@/components/ui/feedback/EmptyState'

<EmptySearchResults
  query={searchQuery}
  onClear={handleClearSearch}
/>
```

---

### 5.2 EmptyFilterResults

**Use When:** Filters return no results

```typescript
import { EmptyFilterResults } from '@/components/ui/feedback/EmptyState'

<EmptyFilterResults
  onClearFilters={handleClearFilters}
/>
```

---

### 5.3 EmptyDataState

**Use When:** No data available, fresh start

```typescript
import { EmptyDataState } from '@/components/ui/feedback/EmptyState'

<EmptyDataState
  entityName="customers"
  onAdd={handleAddCustomer}
  addLabel="customer.actions.addFirst"
/>
```

---

### 5.4 EmptyErrorState

**Use When:** Error occurred while loading

```typescript
import { EmptyErrorState } from '@/components/ui/feedback/EmptyState'

<EmptyErrorState
  title="common.error.loadFailed"
  description="common.error.checkConnection"
  onRetry={handleRetry}
/>
```

---

<a name="real-examples"></a>
## 6. Real Examples by Module

### 6.1 Customer List

```typescript
// No customers yet
<EmptyState
  icon={EmptyStateIcons.customers}
  title="customer.empty.title"
  description="customer.empty.description"
  action={{
    label: 'customer.actions.addFirst',
    onClick: () => navigate('/customers/new'),
    icon: <Plus className="h-4 w-4" />,
  }}
  secondaryAction={{
    label: 'customer.actions.importCustomers',
    onClick: () => setImportModal(true),
    icon: <Upload className="h-4 w-4" />,
    variant: 'outline',
  }}
/>
```

---

### 6.2 Product List

```typescript
// No products
<EmptyState
  icon={EmptyStateIcons.products}
  title="product.empty.title"
  description="product.empty.description"
  action={{
    label: 'product.actions.addProduct',
    onClick: handleAddProduct,
  }}
/>
```

---

### 6.3 Order List

```typescript
// No orders yet
<EmptyState
  icon={EmptyStateIcons.orders}
  title="order.empty.title"
  description="order.empty.waitingForOrders"
  variant="info"
/>
```

---

### 6.4 Analytics Dashboard

```typescript
// No data in date range
<EmptyState
  icon={EmptyStateIcons.analytics}
  title="analytics.empty.title"
  description="analytics.empty.noDataInRange"
  action={{
    label: 'analytics.actions.changeDateRange',
    onClick: () => setDateRangeModal(true),
    variant: 'outline',
  }}
  variant="info"
/>
```

---

### 6.5 Search Results

```typescript
const [searchQuery, setSearchQuery] = useState('iPhone')

// No search results
<EmptySearchResults
  query={searchQuery}
  onClear={() => setSearchQuery('')}
/>
```

---

### 6.6 Filtered Results

```typescript
const [hasFilters, setHasFilters] = useState(true)

// No results after filtering
<EmptyFilterResults
  onClearFilters={() => {
    clearAllFilters()
    setHasFilters(false)
  }}
/>
```

---

### 6.7 Error State

```typescript
const { data, error, refetch } = useGetCustomersQuery()

if (error) {
  return (
    <EmptyErrorState
      title="customer.error.loadFailed"
      description="customer.error.tryAgain"
      onRetry={refetch}
    />
  )
}
```

---

### 6.8 In DataTable

```typescript
<DataTable
  data={customers}
  columns={columns}
  emptyState={{
    message: (
      <EmptyState
        icon={EmptyStateIcons.customers}
        title="customer.empty.title"
        description="customer.empty.description"
        action={{
          label: 'customer.actions.addFirst',
          onClick: handleAdd,
        }}
      />
    ),
  }}
/>
```

---

### 6.9 Conditional Empty States

```typescript
export const CustomerListPage = () => {
  const { data, isLoading, error } = useGetCustomersQuery()
  const [searchQuery, setSearchQuery] = useState('')
  const [hasFilters, setHasFilters] = useState(false)

  // Error
  if (error) {
    return <EmptyErrorState onRetry={refetch} />
  }

  // Loading
  if (isLoading) {
    return <Skeleton />
  }

  // No data
  if (!data || data.length === 0) {
    // Search active
    if (searchQuery) {
      return <EmptySearchResults query={searchQuery} onClear={...} />
    }

    // Filters active
    if (hasFilters) {
      return <EmptyFilterResults onClearFilters={...} />
    }

    // Fresh start
    return (
      <EmptyState
        icon={EmptyStateIcons.customers}
        title="customer.empty.title"
        action={{ label: 'Add Customer', onClick: ... }}
      />
    )
  }

  return <DataTable data={data} ... />
}
```

---

<a name="responsive"></a>
## 7. Responsive Design

### Desktop (Default)

```typescript
<EmptyState
  icon={EmptyStateIcons.customers}
  title="No customers yet"
  description="Get started by adding your first customer"
  size="md"
/>
```

### Mobile (Compact)

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery'

const isMobile = useMediaQuery('(max-width: 768px)')

<EmptyState
  icon={EmptyStateIcons.customers}
  title="No customers"
  description="Add your first customer"
  size={isMobile ? 'sm' : 'md'}
  compact={isMobile}
/>
```

### In Cards/Small Spaces

```typescript
<Card>
  <CardContent>
    <EmptyState
      icon={EmptyStateIcons.inbox}
      title="No notifications"
      description="You're all caught up!"
      size="sm"
      compact
    />
  </CardContent>
</Card>
```

### Full Page

```typescript
<div className="container">
  <EmptyState
    icon={EmptyStateIcons.database}
    title="No data available"
    description="Get started by importing your data"
    fullHeight
    size="lg"
  />
</div>
```

---

<a name="best-practices"></a>
## 8. Best Practices

### DO's

1. **Use Preset Components for Common Cases**
```typescript
// Good
<EmptySearchResults query={query} onClear={clear} />

// ❌ Bad - Reinventing the wheel
<EmptyState icon={Search} title="No results" ... />
```

2. **Provide Actions When Possible**
```typescript
// Good - Helps user know what to do
<EmptyState
  title="No customers"
  action={{ label: 'Add Customer', onClick: handleAdd }}
/>

// ⚠️ OK but not ideal - User stuck
<EmptyState title="No customers" />
```

3. **Use Appropriate Variants**
```typescript
// Good
<EmptySearchResults /> // variant="search"
<EmptyErrorState />     // variant="error"

// ❌ Bad - Wrong context
<EmptyState variant="error" title="No customers" />
```

4. **Use i18n Keys**
```typescript
// Good
title="customer.empty.title"

// ❌ Bad
title="No customers found"
```

5. **Match Size to Context**
```typescript
// Good
<Card>
  <EmptyState size="sm" compact />
</Card>

// ❌ Bad - Too big for card
<Card>
  <EmptyState size="lg" fullHeight />
</Card>
```

---

### ❌ DON'Ts

1. **Don't Use for Loading**
```typescript
// ❌ Wrong
if (isLoading) return <EmptyState title="Loading..." />

// Correct
if (isLoading) return <Skeleton />
```

2. **Don't Hardcode Text**
```typescript
// ❌ Wrong
<EmptyState title="No data" />

// Correct
<EmptyState title="ui.emptyState.noData" />
```

3. **Don't Use Multiple Actions Without Purpose**
```typescript
// ❌ Confusing
<EmptyState
  action={{...}}
  secondaryAction={{...}}
  children={<Button>Third action</Button>}
/>

// Clear
<EmptyState
  action={{ label: 'Add', onClick: handleAdd }}
/>
```

4. **Don't Mix Variants Randomly**
```typescript
// ❌ Confusing
<EmptyState variant="success" icon={AlertCircle} />

// Consistent
<EmptyState variant="success" icon={CheckCircle} />
```

---

## 9. Available Icons

```typescript
import { EmptyStateIcons } from '@/components/ui/feedback/EmptyState'

EmptyStateIcons.default      // FileX
EmptyStateIcons.search       // Search
EmptyStateIcons.filter       // Filter
EmptyStateIcons.customers    // Users
EmptyStateIcons.products     // Package
EmptyStateIcons.orders       // ShoppingCart
EmptyStateIcons.invoices     // FileText
EmptyStateIcons.analytics    // BarChart3
EmptyStateIcons.database     // Database
EmptyStateIcons.inbox        // Inbox
EmptyStateIcons.error        // AlertCircle
EmptyStateIcons.calendar     // Calendar
EmptyStateIcons.image        // Image
```

---

## 10. Translation Keys Required

```json
{
  "ui": {
    "emptyState": {
      "noData": "No data available",
      "getStarted": "Get started by adding your first item",
      "noSearchResults": "No search results found",
      "noResultsFor": "No results found for \"{{query}}\"",
      "tryDifferentKeywords": "Try different keywords or filters",
      "clearSearch": "Clear Search",
      "noFilterResults": "No results match your filters",
      "tryAdjustingFilters": "Try adjusting your filters",
      "clearFilters": "Clear All Filters",
      "noDataAvailable": "No data available",
      "noItemsYet": "No {{entity}} yet",
      "addFirst": "Add Your First {{entity}}",
      "errorOccurred": "An error occurred",
      "tryAgainLater": "Please try again later",
      "retry": "Retry"
    }
  }
}
```

---

## 11. Quick Reference

| Use Case | Component | Code |
|----------|-----------|------|
| No data | `EmptyState` | `<EmptyState title="..." />` |
| No search results | `EmptySearchResults` | `<EmptySearchResults query="..." />` |
| No filter results | `EmptyFilterResults` | `<EmptyFilterResults />` |
| Error state | `EmptyErrorState` | `<EmptyErrorState onRetry={...} />` |
| Fresh start | `EmptyDataState` | `<EmptyDataState entityName="..." />` |

---

## 12. Component Files

```
src/components/ui/feedback/EmptyState/
├── EmptyState.tsx       # Main component
├── index.ts             # Exports
└── README.md            # This file
```

---

**Happy Coding! May your empty states be beautiful! 🎉**