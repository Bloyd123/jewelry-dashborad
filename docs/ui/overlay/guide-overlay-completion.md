
---

```markdown
<a name="sheet"></a>
## 3. Sheet - Bottom Drawer

### What is Sheet?

**Sheet** is a **bottom drawer** that slides up from the bottom. Perfect for:
- Mobile-first experiences
- Quick actions
- Filters and forms
- Mobile menus
- Native mobile feel with drag handle

### Basic Usage

```typescript
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetTrigger 
} from '@/components/ui/overlay/Sheet'

export const FilterSheet = () => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Open Filters</Button>
      </SheetTrigger>

      <SheetContent size="xl" showHandle showClose>
        <SheetHeader>
          <SheetTitle>Filter Options</SheetTitle>
        </SheetHeader>
        
        <SheetBody>
          {/* Scrollable content */}
          <FilterOptions />
        </SheetBody>
        
        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

### Sheet Components

```typescript
Sheet              // Root container (manages open state)
SheetTrigger       // Trigger button (optional)
SheetContent       // Main sheet container with animations
SheetHeader        // Header section (auto-bordered)
SheetTitle         // Title text
SheetDescription   // Description text (optional)
SheetBody          // Scrollable content area
SheetFooter        // Footer with actions (fixed at bottom)
SheetClose         // Manual close trigger (optional)
```

### Sheet Sizes

```typescript
size="sm"    // h-[30vh] min-h-[250px] - Quick actions
size="md"    // h-[50vh] min-h-[400px] - Default
size="lg"    // h-[70vh] min-h-[500px] - Filters
size="xl"    // h-[85vh] min-h-[600px] - Forms
size="full"  // h-[95vh] - Full screen
```

### Sheet Props (Root)

```typescript
interface SheetProps {
  // Required
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Optional
  children: React.ReactNode
}
```

### SheetContent Props

```typescript
interface SheetContentProps {
  // Optional
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'  // Default: 'md'
  showHandle?: boolean                        // Default: true (drag handle)
  showClose?: boolean                         // Default: true (X button)
  preventOutsideClick?: boolean               // Default: false
  className?: string
  children: React.ReactNode
}
```

### Examples

#### Filter Sheet with Structure
```typescript
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Filter className="h-4 w-4 mr-2" />
      Filters
    </Button>
  </SheetTrigger>

  <SheetContent size="xl" showHandle showClose>
    <SheetHeader>
      <SheetTitle>Filter Customers</SheetTitle>
      <SheetDescription>
        Apply filters to refine your search
      </SheetDescription>
    </SheetHeader>
    
    <SheetBody>
      <div className="space-y-4">
        {/* Customer Type */}
        <div>
          <Label>Customer Type</Label>
          <Select
            value={filters.customerType}
            onValueChange={(value) => 
              dispatch(setCustomerTypeFilter(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label>Status</Label>
          <Select
            value={filters.isActive}
            onValueChange={(value) => 
              dispatch(setActiveFilter(value === 'true'))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SheetBody>
    
    <SheetFooter>
      <Button 
        variant="outline" 
        onClick={() => dispatch(clearFilters())}
        className="flex-1"
      >
        Clear
      </Button>
      <Button 
        onClick={handleApplyFilters}
        className="flex-1"
      >
        Apply Filters
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

#### Mobile Menu Sheet
```typescript
<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>

  <SheetContent size="lg" showHandle>
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    
    <SheetBody>
      <nav className="space-y-2">
        <a 
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-tertiary"
        >
          <Home className="h-5 w-5" />
          Dashboard
        </a>
        <a 
          href="/customers"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-tertiary"
        >
          <Users className="h-5 w-5" />
          Customers
        </a>
        <a 
          href="/products"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-tertiary"
        >
          <Package className="h-5 w-5" />
          Products
        </a>
      </nav>
    </SheetBody>
  </SheetContent>
</Sheet>
```

#### Quick Action Sheet
```typescript
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent size="sm" showHandle showClose>
    <SheetHeader>
      <SheetTitle>Quick Actions</SheetTitle>
    </SheetHeader>
    
    <SheetBody>
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </SheetBody>
  </SheetContent>
</Sheet>
```

#### Form Sheet (Large)
```typescript
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Add Product</Button>
  </SheetTrigger>

  <SheetContent size="full" showHandle showClose>
    <SheetHeader>
      <SheetTitle>Add New Product</SheetTitle>
      <SheetDescription>
        Fill in the details to add a new product
      </SheetDescription>
    </SheetHeader>
    
    <SheetBody>
      <ProductForm />
    </SheetBody>
    
    <SheetFooter>
      <Button 
        variant="outline" 
        onClick={() => setOpen(false)}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        onClick={handleSubmit}
        loading={isSubmitting}
      >
        Save Product
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

#### Controlled Sheet (No Trigger)
```typescript
const [open, setOpen] = useState(false)

// Open programmatically
<Button onClick={() => setOpen(true)}>
  Open Filters
</Button>

<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent size="xl">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    <SheetBody>
      {/* Content */}
    </SheetBody>
  </SheetContent>
</Sheet>
```

### Specialized: FilterSheet Component

For common filter use cases, use the pre-built `FilterSheet`:

```typescript
import { FilterSheet } from '@/components/ui/overlay/Sheet'

<FilterSheet
  activeFilterCount={3}
  title="Filter Customers"
  onClearAll={handleClearAll}
  onApply={handleApply}
  size="xl"
  showTrigger={true}  // Shows "More Filters" button
>
  {/* Your filter components */}
  <TypeFilter {...props} />
  <StatusFilter {...props} />
  <DateRangeFilter {...props} />
</FilterSheet>
```

**FilterSheet Props:**

```typescript
interface FilterSheetProps {
  children: React.ReactNode
  activeFilterCount?: number           // Badge count on trigger
  onClearAll?: () => void              // Clear all filters
  onApply?: () => void                 // Apply filters
  triggerLabel?: string                // Custom trigger text
  title?: string                       // Sheet title
  open?: boolean                       // Controlled state
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean                // Default: true
  size?: SheetSize                     // Default: 'xl'
  className?: string
}
```

### Features

✅ **Drag Handle** - Native mobile feel
✅ **Smooth Animations** - Slide up/down with easing
✅ **Auto Scroll Lock** - Prevents body scroll when open
✅ **Backdrop Blur** - Modern glassmorphism effect
✅ **Keyboard Support** - ESC to close
✅ **Touch Gestures** - Swipe down to close (coming soon)
✅ **Flexible Sizing** - 5 size options
✅ **Structured Layout** - Header, Body, Footer components

### Best Practices

1. **Use appropriate size:**
   - `sm` for quick actions (3-4 buttons)
   - `md` for simple filters (2-3 fields)
   - `lg` for complex filters (4-6 fields)
   - `xl` for forms (many fields)
   - `full` for detailed forms/content

2. **Always include SheetHeader:**
   ```typescript
   <SheetHeader>
     <SheetTitle>Title Here</SheetTitle>
   </SheetHeader>
   ```

3. **Use SheetFooter for actions:**
   ```typescript
   <SheetFooter>
     <Button variant="outline">Cancel</Button>
     <Button>Confirm</Button>
   </SheetFooter>
   ```

4. **Keep content in SheetBody:**
   ```typescript
   <SheetBody>
     {/* All scrollable content here */}
   </SheetBody>
   ```

5. **Use FilterSheet for filters:**
   ```typescript
   // Instead of building manually, use FilterSheet
   <FilterSheet activeFilterCount={3} onApply={handleApply}>
     {/* Filters */}
   </FilterSheet>
   ```

### Mobile-First Tips

- Sheet is **always bottom drawer** (no side variants)
- Shows **drag handle** by default for native feel
- **Auto-locks body scroll** when open
- Perfect for **mobile-first** experiences
- Use for **filters, menus, quick actions**
- For desktop side panels, use **Drawer** instead

---
```

---

That's the complete updated Sheet section! Key changes:

1. **New component structure** (SheetHeader, SheetBody, SheetFooter)
2. **Size variants** (sm, md, lg, xl, full)
3. **SheetTrigger** component
4. **FilterSheet** specialized component
5. **More examples** (filters, menu, actions, forms)
6. **Best practices** section
7. **Props reference** for all components

Replace the entire Section 3 with this! 🚀