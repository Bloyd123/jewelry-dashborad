Here's the **UPDATED Filter Components Guide** with the new FilterSheet structure:

```markdown
# 🔍 Filter Components - Usage Guide

## 🎯 Quick Start

All filter components are located in `src/components/ui/filters/` and are **theme-aware**, **responsive**, and **reusable across all modules**.

---

## 📦 Available Filters

| Component | Use Case | Best For |
|-----------|----------|----------|
| **FilterBar** | Main container | Desktop/Mobile layout management |
| **FilterGroup** | Label wrapper | Grouping filters with labels |
| **FilterSheet** | Mobile drawer | Mobile filter UI (from overlay/Sheet) |
| **TypeFilter** | Dropdown selection | Customer type, product type, any category |
| **StatusFilter** | Status selection | Active/Inactive, order status |
| **DateRangeFilter** | Date range picker | Created date, order date filtering |
| **PriceRangeFilter** | Min-Max inputs | Price, amount, quantity ranges |
| **CategoryFilter** | Multi-level categories | Product categories, nested lists |
| **FilterChips** | Active filter tags | Show applied filters |

---

## 🏗️ Architecture Pattern

```tsx
// Standard Filter Structure for Any Module
import { FilterSheet } from '@/components/ui/overlay/Sheet'

<FilterBar 
  hasActiveFilters={hasFilters}
  onClearAll={handleClearAll}
  mobileSheet={
    <FilterSheet 
      activeFilterCount={count}
      onClearAll={handleClearAll}
      onApply={handleApply}
      size="xl"
    >
      {/* Mobile: All filters here */}
      <FilterGroup label="Type">
        <TypeFilter {...props} />
      </FilterGroup>
      <FilterGroup label="Status">
        <StatusFilter {...props} />
      </FilterGroup>
    </FilterSheet>
  }
>
  {/* Desktop: Filters shown here directly */}
  <SearchBar />
  <TypeFilter />
  <StatusFilter />
  <DateRangeFilter />
</FilterBar>

{/* Active Filter Tags */}
<FilterChips filters={activeFilters} onRemove={removeFilter} />
```

---

## 📊 1. FilterBar (Container)

### Basic Usage
```tsx
import { FilterBar } from '@/components/ui/filters'

<FilterBar
  hasActiveFilters={activeFilterCount > 0}
  onClearAll={() => dispatch(clearFilters())}
>
  {/* Your filters here */}
</FilterBar>
```

### With Mobile Support (New FilterSheet)
```tsx
import { FilterSheet } from '@/components/ui/overlay/Sheet'

<FilterBar
  hasActiveFilters={hasFilters}
  onClearAll={handleClear}
  mobileSheet={
    <FilterSheet 
      activeFilterCount={3}
      title="Filter Customers"
      onClearAll={handleClear}
      onApply={handleApply}
      size="xl"
      showTrigger={true}
    >
      <FilterGroup label="Customer Type">
        <TypeFilter {...props} />
      </FilterGroup>
      <FilterGroup label="Status">
        <StatusFilter {...props} />
      </FilterGroup>
      <FilterGroup label="Date Range">
        <DateRangeFilter {...props} />
      </FilterGroup>
    </FilterSheet>
  }
>
  {/* Desktop filters */}
  <SearchBar />
  <TypeFilter />
  <StatusFilter />
</FilterBar>
```

### FilterSheet Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | Filter components |
| `activeFilterCount` | `number` | `0` | Badge count on trigger |
| `onClearAll` | `() => void` | - | Clear filters callback |
| `onApply` | `() => void` | - | Apply button callback |
| `triggerLabel` | `string` | `'More Filters'` | Trigger button text |
| `title` | `string` | `'Advanced Filters'` | Sheet title |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Control sheet open/close |
| `showTrigger` | `boolean` | `true` | Show trigger button |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Sheet height |
| `className` | `string` | - | Body content styling |

### FilterBar Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Filter components |
| `hasActiveFilters` | `boolean` | `false` | Show clear button |
| `onClearAll` | `() => void` | - | Clear all callback |
| `mobileSheet` | `ReactNode` | - | Mobile filter sheet |

---

## 🏷️ 2. TypeFilter (Generic Dropdown)

### Basic Usage
```tsx
import { TypeFilter } from '@/components/ui/filters'

const customerTypes = [
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'vip', label: 'VIP' },
]

<TypeFilter
  options={customerTypes}
  value={selectedType}
  onChange={setSelectedType}
  placeholder="Select type"
/>
```

### With Icons
```tsx
import { Users, Building, Crown } from 'lucide-react'

const options = [
  { 
    value: 'retail', 
    label: 'Retail', 
    icon: <Users className="h-4 w-4" /> 
  },
  { 
    value: 'wholesale', 
    label: 'Wholesale', 
    icon: <Building className="h-4 w-4" /> 
  },
  { 
    value: 'vip', 
    label: 'VIP', 
    icon: <Crown className="h-4 w-4" /> 
  },
]

<TypeFilter options={options} value={type} onChange={setType} />
```

### Reusable in All Modules
```tsx
// Customer Module
<TypeFilter options={customerTypes} ... />

// Sales Module
<TypeFilter options={paymentMethods} ... />

// Inventory Module
<TypeFilter options={productCategories} ... />

// Same component, different data! ✅
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `FilterOption[]` | **Required** | Array of options |
| `value` | `string` | - | Selected value |
| `onChange` | `(value) => void` | **Required** | Change callback |
| `placeholder` | `string` | - | Placeholder text |
| `showAllOption` | `boolean` | `true` | Show "All" option |

---

## 🟢 3. StatusFilter

### Basic Usage
```tsx
import { StatusFilter } from '@/components/ui/filters'

<StatusFilter
  value={status}
  onChange={setStatus}
/>
```

### Custom Status Options
```tsx
const orderStatuses = [
  { value: 'pending', label: 'Pending', variant: 'pending', showDot: true },
  { value: 'completed', label: 'Completed', variant: 'completed', showDot: true },
  { value: 'cancelled', label: 'Cancelled', variant: 'cancelled', showDot: true },
]

<StatusFilter
  options={orderStatuses}
  value={orderStatus}
  onChange={setOrderStatus}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Selected status |
| `onChange` | `(value) => void` | **Required** | Change callback |
| `options` | `StatusOption[]` | Active/Inactive | Custom options |
| `placeholder` | `string` | - | Placeholder |

---

## 📅 4. DateRangeFilter

### Basic Usage
```tsx
import { DateRangeFilter } from '@/components/ui/filters'

const [dateRange, setDateRange] = useState<DateRange>()

<DateRangeFilter
  value={dateRange}
  onChange={setDateRange}
  placeholder="Select date range"
/>
```

### With Redux
```tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setDateRangeFilter } from '@/store/slices/customerSlice'

const dispatch = useAppDispatch()
const filters = useAppSelector(state => state.customer.filters)

<DateRangeFilter
  value={{
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined,
  }}
  onChange={(range) => {
    dispatch(setDateRangeFilter({
      startDate: range?.from?.toISOString(),
      endDate: range?.to?.toISOString(),
    }))
  }}
/>
```

---

## 💰 5. PriceRangeFilter

### Basic Usage
```tsx
import { PriceRangeFilter } from '@/components/ui/filters'

const [priceRange, setPriceRange] = useState<PriceRange>({})

<PriceRangeFilter
  value={priceRange}
  onChange={setPriceRange}
  currency="₹"
  minPlaceholder="Min price"
  maxPlaceholder="Max price"
/>
```

### For Different Use Cases
```tsx
// Price Filter
<PriceRangeFilter currency="₹" {...props} />

// Quantity Filter
<PriceRangeFilter 
  currency=""  // No currency
  minPlaceholder="Min qty"
  maxPlaceholder="Max qty"
  {...props} 
/>

// Weight Filter
<PriceRangeFilter 
  currency="g"  // Grams
  minPlaceholder="Min weight"
  {...props} 
/>
```

---

## 📂 6. CategoryFilter

### Basic Usage
```tsx
import { CategoryFilter } from '@/components/ui/filters'

const categories = [
  { value: 'jewelry', label: 'Jewelry' },
  { 
    value: 'gold', 
    label: 'Gold',
    children: [
      { value: 'rings', label: 'Rings' },
      { value: 'necklaces', label: 'Necklaces' },
    ]
  },
  { value: 'silver', label: 'Silver' },
]

<CategoryFilter
  categories={categories}
  value={selectedCategory}
  onChange={setSelectedCategory}
/>
```

---

## 🏷️ 7. FilterChips (Active Tags)

### Basic Usage
```tsx
import { FilterChips } from '@/components/ui/filters'

const activeFilters = [
  { id: 'type', label: 'Type', value: 'VIP' },
  { id: 'status', label: 'Status', value: 'Active' },
]

<FilterChips
  filters={activeFilters}
  onRemove={(id) => handleRemoveFilter(id)}
  onClearAll={handleClearAll}
/>
```

### Auto-Generate from State
```tsx
const activeFilters = useMemo(() => {
  const filters: ActiveFilter[] = []
  
  if (state.customerType) {
    filters.push({
      id: 'type',
      label: 'Type',
      value: state.customerType,
    })
  }
  
  if (state.status) {
    filters.push({
      id: 'status',
      label: 'Status',
      value: state.status,
    })
  }
  
  return filters
}, [state])

<FilterChips filters={activeFilters} onRemove={removeFilter} />
```

---

## 🎯 Complete Example (Customer Module)

```tsx
import {
  FilterBar,
  FilterGroup,
  TypeFilter,
  StatusFilter,
  DateRangeFilter,
  FilterChips,
} from '@/components/ui/filters'
import { FilterSheet } from '@/components/ui/overlay/Sheet'
import { SearchBar } from '@/components/ui/form/SearchBar'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setSearchFilter,
  setCustomerTypeFilter,
  setActiveFilter,
  setDateRangeFilter,
  clearFilters,
  selectCustomerFilters,
  selectHasActiveFilters,
} from '@/store/slices/customerSlice'

export const CustomerFilters = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomerFilters)
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const customerTypes = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'vip', label: 'VIP' },
  ]

  const handleClearAll = () => {
    dispatch(clearFilters())
  }

  const handleApplyFilters = () => {
    // Optional: Add any apply logic
    // Filters are already applied via onChange
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.customerType) count++
    if (filters.isActive !== undefined) count++
    if (filters.startDate || filters.endDate) count++
    return count
  }, [filters])

  return (
    <>
      <FilterBar
        hasActiveFilters={hasActiveFilters}
        onClearAll={handleClearAll}
        mobileSheet={
          !isDesktop && (
            <FilterSheet
              activeFilterCount={activeFilterCount}
              onClearAll={handleClearAll}
              onApply={handleApplyFilters}
              title="Filter Customers"
              size="xl"
              showTrigger={true}
            >
              <FilterGroup label="Customer Type">
                <TypeFilter
                  options={customerTypes}
                  value={filters.customerType}
                  onChange={(v) => dispatch(setCustomerTypeFilter(v))}
                />
              </FilterGroup>

              <FilterGroup label="Status">
                <StatusFilter
                  value={filters.isActive?.toString()}
                  onChange={(v) => dispatch(setActiveFilter(v === 'true'))}
                />
              </FilterGroup>

              <FilterGroup label="Date Range">
                <DateRangeFilter
                  value={{
                    from: filters.startDate ? new Date(filters.startDate) : undefined,
                    to: filters.endDate ? new Date(filters.endDate) : undefined,
                  }}
                  onChange={(range) => {
                    dispatch(setDateRangeFilter({
                      startDate: range?.from?.toISOString(),
                      endDate: range?.to?.toISOString(),
                    }))
                  }}
                />
              </FilterGroup>
            </FilterSheet>
          )
        }
      >
        {/* Desktop Filters */}
        <SearchBar
          value={filters.search}
          onChange={(v) => dispatch(setSearchFilter(v))}
        />
        
        <TypeFilter
          options={customerTypes}
          value={filters.customerType}
          onChange={(v) => dispatch(setCustomerTypeFilter(v))}
        />

        <StatusFilter
          value={filters.isActive?.toString()}
          onChange={(v) => dispatch(setActiveFilter(v === 'true'))}
        />

        <DateRangeFilter
          value={{
            from: filters.startDate ? new Date(filters.startDate) : undefined,
            to: filters.endDate ? new Date(filters.endDate) : undefined,
          }}
          onChange={(range) => {
            dispatch(setDateRangeFilter({
              startDate: range?.from?.toISOString(),
              endDate: range?.to?.toISOString(),
            }))
          }}
        />
      </FilterBar>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <FilterChips
          filters={generateActiveFilters(filters)}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      )}
    </>
  )
}
```

---

## 🎨 Styling Guidelines

### Theme Colors (Always Use These)
```tsx
// ✅ Correct - Uses CSS variables
<TypeFilter className="bg-bg-secondary border-border-primary" />

// ❌ Wrong - Hardcoded colors
<TypeFilter className="bg-white border-gray-300" />
```

### Responsive Width
```tsx
// Desktop: Fixed width, Mobile: Full width
<TypeFilter className="w-full md:w-[180px]" />
<StatusFilter className="w-full md:w-[160px]" />
<DateRangeFilter className="w-full md:w-[280px]" />
```

---

## 📱 Responsive Behavior

| Screen | Layout | Filters Shown |
|--------|--------|---------------|
| **Desktop (≥768px)** | Horizontal bar | All filters visible |
| **Mobile (<768px)** | Search + Sheet button | Filters in bottom drawer |

**New:** FilterSheet now includes:
- ✅ Built-in header with clear button
- ✅ Scrollable body area (SheetBody)
- ✅ Fixed footer with Cancel/Apply buttons
- ✅ Configurable size (sm, md, lg, xl, full)
- ✅ Drag handle for native mobile feel

---

## 🔧 Redux Integration Pattern

### 1. Define Filter State
```tsx
// customerSlice.ts
interface CustomerFilters {
  search: string
  customerType?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
  minPrice?: number
  maxPrice?: number
}
```

### 2. Create Actions
```tsx
setSearchFilter: (state, action) => {
  state.filters.search = action.payload
  state.currentPage = 1  // Reset pagination
}

setCustomerTypeFilter: (state, action) => {
  state.filters.customerType = action.payload
  state.currentPage = 1
}

clearFilters: (state) => {
  state.filters = initialState.filters
  state.currentPage = 1
}
```

### 3. Create Selectors
```tsx
export const selectCustomerFilters = (state) => state.customer.filters
export const selectHasActiveFilters = (state) => {
  const f = state.customer.filters
  return f.search !== '' || f.customerType !== undefined || ...
}
```

---

## ⚠️ Common Mistakes

### ❌ Wrong
```tsx
// Hardcoded text
<TypeFilter placeholder="Select Customer Type" />  // ❌

// Not handling undefined
<TypeFilter value={type} onChange={setType} />  // ❌ value can be undefined

// No Redux integration
const [type, setType] = useState()  // ❌ Lost on page refresh

// Old FilterSheet import
import { FilterSheet } from '@/components/ui/filters'  // ❌
```

### ✅ Correct
```tsx
// Use i18n
<TypeFilter placeholder={t('filters.selectType')} />  // ✅

// Handle undefined properly
<TypeFilter 
  value={type} 
  onChange={(v) => setType(v)}  // ✅ onChange handles undefined
/>

// Redux for persistence
const type = useAppSelector(selectCustomerType)
dispatch(setCustomerTypeFilter(newType))  // ✅ Persisted

// New FilterSheet import
import { FilterSheet } from '@/components/ui/overlay/Sheet'  // ✅
```

---

## 🎯 Pro Tips

1. **Always reset pagination when filters change:**
   ```tsx
   setCustomerTypeFilter: (state, action) => {
     state.filters.customerType = action.payload
     state.currentPage = 1  // ✅ Reset to page 1
   }
   ```

2. **Use FilterGroup for mobile clarity:**
   ```tsx
   <FilterGroup label="Customer Type">
     <TypeFilter {...props} />
   </FilterGroup>
   ```

3. **Calculate active filter count:**
   ```tsx
   const count = useMemo(() => {
     let c = 0
     if (filters.type) c++
     if (filters.status) c++
     return c
   }, [filters])
   ```

4. **Keep filter state in Redux, not local:**
   ```tsx
   // ❌ Bad - Lost on unmount
   const [filters, setFilters] = useState({})
   
   // ✅ Good - Persisted in Redux
   const filters = useAppSelector(selectFilters)
   ```

5. **Use TypeFilter for any dropdown:**
   ```tsx
   // Customer types, Product categories, Payment methods
   // Same component, just different options! ✅
   ```

6. **FilterSheet has built-in structure:**
   ```tsx
   // ✅ Content automatically goes into scrollable body
   // ✅ Footer with actions is fixed at bottom
   // ✅ Header with clear button is fixed at top
   <FilterSheet>
     {/* Just add your filters, structure is handled! */}
   </FilterSheet>
   ```

---

## 📦 Import Paths

```tsx
// Filter components (from filters)
import { 
  FilterBar, 
  FilterGroup,
  TypeFilter, 
  StatusFilter,
  DateRangeFilter,
  PriceRangeFilter,
  CategoryFilter,
  FilterChips
} from '@/components/ui/filters'

// FilterSheet (from overlay)
import { FilterSheet } from '@/components/ui/overlay/Sheet'

// Individual imports
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import { FilterSheet } from '@/components/ui/overlay/Sheet/FilterSheet'
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Filters not showing on mobile | Add `mobileSheet` prop to FilterBar |
| Clear button not showing | Set `hasActiveFilters={true}` |
| Options not displaying | Check `options` array format |
| Date picker not working | Ensure `date-fns` is installed |
| Filter state lost | Use Redux, not local state |
| FilterSheet not found | Import from `@/components/ui/overlay/Sheet` |
| Footer not showing | FilterSheet auto-includes footer |
| Content not scrolling | Content in FilterSheet auto-scrolls |

---

## 🚀 Quick Checklist

Before deploying filters:

- [ ] All text uses `t('key')` (i18n)
- [ ] Uses CSS variables (no hardcoded colors)
- [ ] Mobile FilterSheet implemented with new structure
- [ ] FilterSheet imported from `@/components/ui/overlay/Sheet`
- [ ] Redux integration complete
- [ ] Pagination resets on filter change
- [ ] Active filters show in FilterChips
- [ ] Clear all button works
- [ ] TypeScript types defined
- [ ] Responsive on mobile/desktop
- [ ] FilterSheet has `onApply` callback
- [ ] FilterSheet size configured (`xl` for forms)

---

## 🆕 What's New (FilterSheet Update)

### Changed
- **Import Path**: `@/components/ui/filters/FilterSheet` → `@/components/ui/overlay/Sheet`
- **Component Structure**: Now uses SheetContent, SheetHeader, SheetBody, SheetFooter
- **Size Prop**: Added `size` prop with 5 options (sm, md, lg, xl, full)

### Added
- ✅ `onApply` callback for apply button
- ✅ `showTrigger` prop to control button visibility
- ✅ `size` prop for height control
- ✅ Built-in scrollable body
- ✅ Fixed footer with actions
- ✅ Drag handle for mobile feel

### Migration
```tsx
// OLD (❌)
import { FilterSheet } from '@/components/ui/filters'
<FilterSheet title="Filters">
  <div className="space-y-4">
    {/* filters */}
  </div>
</FilterSheet>

// NEW (✅)
import { FilterSheet } from '@/components/ui/overlay/Sheet'
<FilterSheet 
  title="Filters"
  onApply={handleApply}
  size="xl"
>
  {/* filters - auto-wrapped in scrollable body */}
</FilterSheet>
```

---

**Last Updated:** December 2024  
**Version:** 2.0 (FilterSheet Updated)  
**Components:** 9 reusable filters  
**Maintained By:** Development Team
```

---