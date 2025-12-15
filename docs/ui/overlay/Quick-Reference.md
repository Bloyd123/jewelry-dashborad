

```markdown
# 📋 Overlay Components - Quick Reference

> **Print & keep on desk!**

---

## 🎯 Which Component?

| Scenario | Use | Code Template |
|----------|-----|---------------|
| **Add/Edit Form** | Modal | `<Modal size="lg">` |
| **View Details** | Modal | `<Modal size="xl">` |
| **Delete Confirm** | ConfirmDialog | `<ConfirmDialog variant="danger">` |
| **Mobile Filters** | Sheet | `<SheetContent size="xl">` |
| **Settings Panel** | Drawer (right) | `<Drawer side="right">` |
| **Side Nav** | Drawer (left) | `<Drawer side="left">` |
| **Alert/Warning** | Dialog | `<Dialog title="...">` |

---

## 📦 1. Modal (Most Common)

### Basic Template
```typescript
const [open, setOpen] = useState(false)

<Modal open={open} onOpenChange={setOpen} size="lg">
  <ModalHeader 
    title="customer.modal.title"
    description="customer.modal.description"
  />
  <ModalBody>
    {/* Your content */}
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSave}>Save</Button>
  </ModalFooter>
</Modal>
```

### Sizes
- `sm` → 384px (small alerts)
- `md` → 448px (default)
- `lg` → 512px (forms)
- `xl` → 576px (detailed forms)
- `full` → Full width with margins

---

## 📱 2. Sheet (Mobile Bottom)

### Basic Template
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

const [open, setOpen] = useState(false)

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
```

### Sizes
- `sm` → 30vh (quick actions)
- `md` → 50vh (default)
- `lg` → 70vh (filters)
- `xl` → 85vh (forms)
- `full` → 95vh (full screen)

### Components
```typescript
Sheet              // Root (manages state)
SheetTrigger       // Trigger button
SheetContent       // Main container
SheetHeader        // Header section
SheetTitle         // Title
SheetDescription   // Description
SheetBody          // Scrollable content
SheetFooter        // Fixed footer
SheetClose         // Close button
```

### FilterSheet (Pre-built)
```typescript
import { FilterSheet } from '@/components/ui/overlay/Sheet'

<FilterSheet
  activeFilterCount={3}
  title="Filter Customers"
  onClearAll={handleClearAll}
  onApply={handleApply}
  size="xl"
>
  {/* Your filters */}
</FilterSheet>
```

### Use For
- ✅ Mobile filters
- ✅ Quick actions
- ✅ Mobile menus
- ✅ Mobile forms
- ✅ Bottom selections

---

## 🚪 3. Drawer (Side Panel)

### Basic Template
```typescript
<Drawer
  open={open}
  onOpenChange={setOpen}
  side="right"
  size="md"
  title="settings.title"
>
  {/* Settings or nav */}
</Drawer>
```

### Sides & Sizes
- Sides: `left` | `right`
- Sizes: `sm` | `md` | `lg` | `xl` | `full`

---

## ✅ 4. ConfirmDialog (Pre-built)

### Basic Template
```typescript
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="danger"
  title="Delete Customer?"
  description="This cannot be undone"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  loading={isDeleting}
/>
```

### Variants
- `default` → Blue info
- `danger` → Red alert (delete)
- `warning` → Yellow warning
- `info` → Blue info
- `success` → Green check

---

## 🔥 Common Patterns

### Pattern 1: Add Modal
```typescript
<Button onClick={() => setOpen(true)}>Add</Button>

<Modal open={open} onOpenChange={setOpen} size="lg">
  <ModalHeader title="Add Item" />
  <ModalBody><Form /></ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSave}>Save</Button>
  </ModalFooter>
</Modal>
```

### Pattern 2: Delete Confirm
```typescript
<Button onClick={() => setOpen(true)}>Delete</Button>

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="danger"
  title="Delete?"
  onConfirm={handleDelete}
  loading={isDeleting}
/>
```

### Pattern 3: Mobile Filter Sheet
```typescript
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Filters</Button>
  </SheetTrigger>

  <SheetContent size="xl">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>
    
    <SheetBody>
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
```

---

## ⚙️ Props Quick Ref

### All Components Have:
```typescript
open: boolean
onOpenChange: (open: boolean) => void
children: React.ReactNode
title?: string
description?: string
closeOnEscape?: boolean          // Default: true
closeOnOutsideClick?: boolean    // Default: true
onClose?: () => void
onOpen?: () => void
className?: string
```

### Modal Specific:
```typescript
size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
showCloseButton?: boolean        // Default: true
forceMobile?: boolean
forceDesktop?: boolean
mobileAsSheet?: boolean          // Default: true
```

### Sheet Specific (SheetContent):
```typescript
size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'  // Default: 'md'
showHandle?: boolean                        // Default: true (drag handle)
showClose?: boolean                         // Default: true (X button)
preventOutsideClick?: boolean               // Default: false
```

### FilterSheet Specific:
```typescript
activeFilterCount?: number       // Badge count
onClearAll?: () => void          // Clear filters
onApply?: () => void             // Apply filters
triggerLabel?: string            // Custom button text
showTrigger?: boolean            // Default: true
size?: SheetSize                 // Default: 'xl'
```

### Drawer Specific:
```typescript
side?: 'left' | 'right'          // Default: 'right'
size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
```

### ConfirmDialog Specific:
```typescript
variant?: 'default' | 'danger' | 'warning' | 'info' | 'success'
confirmLabel?: string
cancelLabel?: string
onConfirm: () => void | Promise<void>
onCancel?: () => void
loading?: boolean
showIcon?: boolean               // Default: true
```

---

## ✅ Best Practices Checklist

- [ ] Use Modal for forms (auto-adapts mobile)
- [ ] Use ConfirmDialog for confirmations
- [ ] Use Sheet for mobile filters
- [ ] Use FilterSheet for quick filter implementation
- [ ] Test on mobile devices
- [ ] Use i18n keys for all text
- [ ] Show loading states
- [ ] Close on success, keep on error
- [ ] Don't nest overlays
- [ ] Handle escape key properly
- [ ] Prevent body scroll when open
- [ ] Use SheetBody for scrollable content
- [ ] Use SheetFooter for fixed actions

---

## 🐛 Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `<Modal><Dialog></Dialog></Modal>` | Use separate state |
| `title="Add Customer"` | `title="customer.modal.add"` |
| No loading state | `<Button loading={isLoading}>` |
| Close immediately | Close after success only |
| Hardcoded sizes | Use size prop |
| No mobile testing | Test on real devices |
| `<Sheet><Content /></Sheet>` | `<Sheet><SheetContent>...</SheetContent></Sheet>` |
| Content outside SheetBody | Put in `<SheetBody>` |
| Actions outside SheetFooter | Put in `<SheetFooter>` |

---

## 🎯 Decision Tree

```
Need overlay?
│
├─ Form? → Modal (size="lg")
├─ Delete? → ConfirmDialog (variant="danger")
├─ Mobile filter? → Sheet or FilterSheet
├─ Settings? → Drawer (side="right")
├─ Alert? → Dialog
└─ Warning? → ConfirmDialog (variant="warning")
```

---

## 📚 Files Location

```
src/components/ui/overlay/
├── Modal/
│   ├── Modal.tsx
│   ├── ModalHeader.tsx
│   ├── ModalBody.tsx
│   ├── ModalFooter.tsx
│   └── index.ts
├── Sheet/
│   ├── Sheet.tsx
│   ├── FilterSheet.tsx         # Pre-built filter sheet
│   └── index.ts
├── Drawer/
│   ├── Drawer.tsx
│   └── index.ts
├── Dialog/
│   ├── Dialog.tsx
│   ├── ConfirmDialog.tsx
│   └── index.ts
└── index.ts
```

---

## 🔗 Imports

```typescript
// Modal
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'

// Sheet
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetTrigger 
} from '@/components/ui/overlay/Sheet'

// FilterSheet (pre-built)
import { FilterSheet } from '@/components/ui/overlay/Sheet'

// Drawer
import { Drawer } from '@/components/ui/overlay/Drawer'

// Dialog
import { Dialog, ConfirmDialog } from '@/components/ui/overlay/Dialog'

// Or all from one place
import { Modal, Sheet, Drawer, Dialog, ConfirmDialog } from '@/components/ui/overlay'
```

---

## 📝 Translation Keys

```json
{
  "ui": {
    "modal": { "close": "Close" },
    "sheet": { "close": "Close" },
    "drawer": { "close": "Close" },
    "dialog": {
      "confirm": "Confirm",
      "cancel": "Cancel"
    }
  },
  "filters": {
    "moreFilters": "More Filters",
    "advancedFilters": "Advanced Filters",
    "clearAll": "Clear All"
  },
  "common": {
    "apply": "Apply",
    "cancel": "Cancel"
  }
}
```

---

## 💡 Quick Tips

### When to use what?

**Modal** 
- ✅ Forms that work on both desktop & mobile
- ✅ Auto-converts to sheet on mobile
- ✅ Most versatile option

**Sheet**
- ✅ Mobile-first experiences
- ✅ Quick filters and actions
- ✅ Native mobile feel with drag handle
- ✅ Use `FilterSheet` for quick implementation

**Drawer**
- ✅ Desktop side panels
- ✅ Settings and navigation
- ✅ Avoid on mobile (use Sheet instead)

**Dialog/ConfirmDialog**
- ✅ Simple confirmations and alerts
- ✅ Delete confirmations (use `variant="danger"`)
- ✅ Quick yes/no decisions

---

## 🚀 Quick Start Examples

### 1. Simple Filter Sheet
```typescript
<FilterSheet
  activeFilterCount={2}
  onClearAll={() => dispatch(clearFilters())}
  onApply={() => console.log('Apply clicked')}
>
  <TypeFilter options={types} value={type} onChange={setType} />
  <StatusFilter value={status} onChange={setStatus} />
</FilterSheet>
```

### 2. Custom Sheet with Structure
```typescript
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent size="lg">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    <SheetBody>
      {/* Scrollable content */}
    </SheetBody>
    <SheetFooter>
      <Button>Action</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### 3. Form Modal
```typescript
<Modal open={open} onOpenChange={setOpen} size="lg">
  <ModalHeader title="Add Customer" />
  <ModalBody>
    <CustomerForm />
  </ModalBody>
  <ModalFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </ModalFooter>
</Modal>
```

### 4. Delete Confirmation
```typescript
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="danger"
  title="Delete Customer?"
  onConfirm={handleDelete}
/>
```

---

**Quick Tip:** When in doubt, use **Modal** for forms and **FilterSheet** for mobile filters! 🚀

**Full Guide:** See `guide-overlay-complete.md`
```

