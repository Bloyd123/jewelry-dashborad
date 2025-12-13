# 📋 Overlay Components - Quick Reference

> **Print & keep on desk!**

---

## 🎯 Which Component?

| Scenario | Use | Code Template |
|----------|-----|---------------|
| **Add/Edit Form** | Modal | `<Modal size="lg">` |
| **View Details** | Modal | `<Modal size="xl">` |
| **Delete Confirm** | ConfirmDialog | `<ConfirmDialog variant="danger">` |
| **Mobile Filters** | Sheet | `<Sheet title="...">` |
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
<Sheet 
  open={open} 
  onOpenChange={setOpen}
  title="filter.title"
>
  {/* Filters or actions */}
</Sheet>
```

### Use For
- ✅ Mobile filters
- ✅ Quick actions
- ✅ Mobile menus
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

### Pattern 3: Mobile Filter
```typescript
<Button onClick={() => setOpen(true)}>Filters</Button>

<Sheet open={open} onOpenChange={setOpen} title="Filters">
  <FilterOptions />
  <Button onClick={handleApply}>Apply</Button>
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

### Sheet Specific:
```typescript
showHandle?: boolean             // Default: true (drag handle)
maxHeight?: string               // Default: '90vh'
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
- [ ] Test on mobile devices
- [ ] Use i18n keys for all text
- [ ] Show loading states
- [ ] Close on success, keep on error
- [ ] Don't nest overlays
- [ ] Handle escape key properly
- [ ] Prevent body scroll when open

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

---

## 🎯 Decision Tree

```
Need overlay?
│
├─ Form? → Modal (size="lg")
├─ Delete? → ConfirmDialog (variant="danger")
├─ Mobile filter? → Sheet
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
import { Sheet } from '@/components/ui/overlay/Sheet'

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
  }
}
```

---

**Quick Tip:** When in doubt, use **Modal** - it's the most versatile! 🚀

**Full Guide:** See `guide-overlay-completion.md`