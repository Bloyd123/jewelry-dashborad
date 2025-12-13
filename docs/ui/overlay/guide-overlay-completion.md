# 🎭 Overlay Components - Complete Developer Guide

> **Modal, Sheet, Drawer, Dialog - Flexible overlay system for all modules!**

---

## 📖 Table of Contents

1. [Overview - What & When](#overview)
2. [Modal - Adaptive Desktop/Mobile](#modal)
3. [Sheet - Bottom Drawer](#sheet)
4. [Drawer - Side Drawer](#drawer)
5. [Dialog - Confirmation](#dialog)
6. [Decision Tree - Which to Use](#decision-tree)
7. [Real Examples](#real-examples)
8. [Best Practices](#best-practices)
9. [Quick Reference](#quick-reference)

---

<a name="overview"></a>
## 1. Overview - What & When

### 🎯 What Are Overlay Components?

**Overlay components** are UI elements that appear **on top** of your main content:
- Modals (centered popups)
- Sheets (bottom drawers)
- Drawers (side panels)
- Dialogs (confirmations)

### 📊 Component Comparison

| Component | Position | Best For | Mobile Behavior |
|-----------|----------|----------|-----------------|
| **Modal** | Center | Forms, details, content | Auto converts to Sheet |
| **Sheet** | Bottom | Mobile actions, filters | Native mobile feel |
| **Drawer** | Left/Right | Navigation, settings | Same on all devices |
| **Dialog** | Center | Confirmations, alerts | Smaller, focused |

---

<a name="modal"></a>
## 2. Modal - Adaptive Desktop/Mobile

### What is Modal?

**Modal** is the **most versatile** overlay component that:
- Shows centered on **desktop**
- Auto converts to **bottom sheet** on **mobile**
- Fully customizable with header, body, footer

### Basic Usage

```typescript
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/base/button'

export const AddCustomerModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Customer</Button>

      <Modal open={open} onOpenChange={setOpen} size="lg">
        <ModalHeader
          title="customer.modal.addTitle"
          description="customer.modal.addDescription"
        />
        
        <ModalBody>
          {/* Your form or content here */}
          <CustomerForm />
        </ModalBody>
        
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Customer
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

### Modal Sizes

```typescript
size="sm"    // max-w-sm (384px)
size="md"    // max-w-md (448px) - Default
size="lg"    // max-w-lg (512px)
size="xl"    // max-w-xl (576px)
size="full"  // max-w-full with margins
```

### Modal Props

```typescript
interface ModalProps {
  // Required
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  
  // Optional
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  title?: string
  description?: string
  
  // Behavior
  closeOnEscape?: boolean           // Default: true
  closeOnOutsideClick?: boolean     // Default: true
  showCloseButton?: boolean         // Default: true
  preventScroll?: boolean           // Default: true
  
  // Mobile control
  forceMobile?: boolean             // Force mobile sheet
  forceDesktop?: boolean            // Force desktop modal
  mobileAsSheet?: boolean           // Default: true
  
  // Callbacks
  onClose?: () => void
  onOpen?: () => void
  
  // Styling
  className?: string
  overlayClassName?: string
  contentClassName?: string
}
```

### Examples

#### Simple Modal
```typescript
<Modal open={open} onOpenChange={setOpen}>
  <ModalHeader title="Confirm Action" />
  <ModalBody>
    <p>Are you sure?</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={() => setOpen(false)}>Close</Button>
  </ModalFooter>
</Modal>
```

#### Form Modal
```typescript
<Modal open={open} onOpenChange={setOpen} size="lg">
  <ModalHeader
    title="customer.modal.editTitle"
    description="customer.modal.editDescription"
  />
  <ModalBody>
    <CustomerForm data={customer} onSubmit={handleSubmit} />
  </ModalBody>
  <ModalFooter align="between">
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSave}>Save Changes</Button>
  </ModalFooter>
</Modal>
```

#### Details Modal (No Footer)
```typescript
<Modal open={open} onOpenChange={setOpen} size="xl">
  <ModalHeader title="customer.details.title" />
  <ModalBody>
    <CustomerDetails data={customer} />
  </ModalBody>
</Modal>
```

#### Force Desktop Mode
```typescript
<Modal 
  open={open} 
  onOpenChange={setOpen}
  forceDesktop={true}  // Always show as modal, even on mobile
>
  {/* Content */}
</Modal>
```

---

<a name="sheet"></a>
## 3. Sheet - Bottom Drawer

### What is Sheet?

**Sheet** is a **bottom drawer** that slides up from the bottom. Perfect for:
- Mobile-first experiences
- Quick actions
- Filters
- Mobile menus

### Basic Usage

```typescript
import { Sheet } from '@/components/ui/overlay/Sheet'

export const FilterSheet = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Filters</Button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="filter.title"
        description="filter.description"
      >
        {/* Filter options */}
        <FilterOptions />
      </Sheet>
    </>
  )
}
```

### Sheet Props

```typescript
interface SheetProps {
  // Required
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  
  // Optional
  title?: string
  description?: string
  showHandle?: boolean              // Default: true (drag handle)
  showCloseButton?: boolean         // Default: true
  closeOnEscape?: boolean           // Default: true
  closeOnOutsideClick?: boolean     // Default: true
  maxHeight?: string | number       // Default: '90vh'
  
  // Callbacks
  onClose?: () => void
  onOpen?: () => void
  
  // Styling
  className?: string
  overlayClassName?: string
  contentClassName?: string
}
```

### Examples

#### Filter Sheet
```typescript
<Sheet
  open={open}
  onOpenChange={setOpen}
  title="filter.title"
  maxHeight="80vh"
>
  <div className="space-y-4">
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Customer Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="retail">Retail</SelectItem>
        <SelectItem value="wholesale">Wholesale</SelectItem>
      </SelectContent>
    </Select>
    
    <Button onClick={handleApplyFilters}>
      Apply Filters
    </Button>
  </div>
</Sheet>
```

#### Mobile Menu
```typescript
<Sheet
  open={menuOpen}
  onOpenChange={setMenuOpen}
  title="Menu"
  showHandle={true}
>
  <nav className="space-y-2">
    <a href="/dashboard">Dashboard</a>
    <a href="/customers">Customers</a>
    <a href="/products">Products</a>
  </nav>
</Sheet>
```

---

<a name="drawer"></a>
## 4. Drawer - Side Drawer

### What is Drawer?

**Drawer** is a **side panel** that slides from left or right. Perfect for:
- Settings
- Side navigation
- Details panel
- Multi-step forms

### Basic Usage

```typescript
import { Drawer } from '@/components/ui/overlay/Drawer'

export const SettingsDrawer = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        size="md"
        title="settings.title"
        description="settings.description"
      >
        <SettingsForm />
      </Drawer>
    </>
  )
}
```

### Drawer Props

```typescript
interface DrawerProps {
  // Required
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  
  // Optional
  side?: 'left' | 'right'           // Default: 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'  // Default: 'md'
  title?: string
  description?: string
  showCloseButton?: boolean         // Default: true
  closeOnEscape?: boolean           // Default: true
  closeOnOutsideClick?: boolean     // Default: true
  
  // Callbacks
  onClose?: () => void
  onOpen?: () => void
  
  // Styling
  className?: string
  overlayClassName?: string
  contentClassName?: string
}
```

### Examples

#### Settings Drawer (Right)
```typescript
<Drawer
  open={open}
  onOpenChange={setOpen}
  side="right"
  size="md"
  title="settings.title"
>
  <SettingsForm />
</Drawer>
```

#### Navigation Drawer (Left)
```typescript
<Drawer
  open={navOpen}
  onOpenChange={setNavOpen}
  side="left"
  size="sm"
  title="navigation.title"
>
  <Navigation />
</Drawer>
```

#### Details Panel (Large)
```typescript
<Drawer
  open={detailsOpen}
  onOpenChange={setDetailsOpen}
  side="right"
  size="lg"
  title="customer.details.title"
  description="customer.details.description"
>
  <CustomerDetailsPanel data={customer} />
</Drawer>
```

---

<a name="dialog"></a>
## 5. Dialog - Confirmation

### What is Dialog?

**Dialog** is a **simple, focused** overlay for:
- Confirmations
- Alerts
- Quick decisions
- Important messages

### Basic Dialog

```typescript
import { Dialog } from '@/components/ui/overlay/Dialog'

export const DeleteDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="delete.confirmTitle"
      description="delete.confirmDescription"
    >
      <div className="px-6 pb-6">
        <p className="text-text-secondary mb-4">
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
```

### ConfirmDialog (Pre-built)

```typescript
import { ConfirmDialog } from '@/components/ui/overlay/Dialog'

export const DeleteCustomerDialog = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await deleteCustomer(customerId)
    setLoading(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      variant="danger"
      title="customer.delete.confirmTitle"
      description="customer.delete.confirmDescription"
      confirmLabel="customer.delete.confirm"
      cancelLabel="common.cancel"
      onConfirm={handleConfirm}
      onCancel={() => setOpen(false)}
      loading={loading}
    />
  )
}
```

### ConfirmDialog Variants

```typescript
variant="default"   // Blue info icon
variant="danger"    // Red alert icon (for delete, destructive)
variant="warning"   // Yellow warning icon
variant="info"      // Blue info icon
variant="success"   // Green check icon
```

### Examples

#### Delete Confirmation
```typescript
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="danger"
  title="Delete Customer?"
  description="This will permanently delete the customer. This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  loading={isDeleting}
/>
```

#### Warning Dialog
```typescript
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="warning"
  title="Unsaved Changes"
  description="You have unsaved changes. Are you sure you want to leave?"
  confirmLabel="Leave"
  cancelLabel="Stay"
  onConfirm={handleLeave}
/>
```

#### Success Dialog
```typescript
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="success"
  title="Success!"
  description="Customer has been added successfully"
  confirmLabel="View Customer"
  cancelLabel="Add Another"
  onConfirm={handleView}
  onCancel={handleAddAnother}
/>
```

---

<a name="decision-tree"></a>
## 6. Decision Tree - Which to Use?

```
Need an overlay?
    │
    ├─ Confirmation/Alert?
    │   └─ Use Dialog/ConfirmDialog
    │
    ├─ Form or detailed content?
    │   ├─ Multi-device? → Modal (auto-adaptive)
    │   ├─ Mobile only? → Sheet
    │   └─ Side panel? → Drawer
    │
    ├─ Navigation or settings?
    │   └─ Use Drawer (left/right)
    │
    ├─ Quick filters/actions (mobile)?
    │   └─ Use Sheet (bottom)
    │
    └─ Complex content?
        ├─ Desktop & Mobile → Modal
        └─ Desktop only → Modal with forceDesktop
```

### Quick Decision Table

| Use Case | Component | Why |
|----------|-----------|-----|
| Add/Edit Customer | Modal | Form, needs both desktop & mobile |
| Delete Confirmation | ConfirmDialog | Simple yes/no decision |
| Filter Options | Sheet | Mobile-first, quick access |
| Settings Panel | Drawer | Side panel, persistent |
| Customer Details | Modal (lg/xl) | Detailed view, both devices |
| Mobile Menu | Sheet | Bottom drawer, mobile UX |
| Navigation | Drawer (left) | Traditional side nav |
| Quick Alert | Dialog | Simple message |

---

<a name="real-examples"></a>
## 7. Real Examples

### Example 1: Add Customer Modal

```typescript
export const AddCustomerModal = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const handleSubmit = async (data: CustomerFormData) => {
    setLoading(true)
    try {
      await createCustomer(data)
      setOpen(false)
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        {t('customer.actions.add')}
      </Button>

      <Modal open={open} onOpenChange={setOpen} size="lg">
        <ModalHeader
          title="customer.modal.addTitle"
          description="customer.modal.addDescription"
        />
        
        <ModalBody>
          <CustomerForm onSubmit={handleSubmit} loading={loading} />
        </ModalBody>
        
        <ModalFooter align="right">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            type="submit" 
            form="customer-form"
            loading={loading}
          >
            {t('customer.actions.save')}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

### Example 2: Filter Sheet (Mobile)

```typescript
export const CustomerFilters = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomerFilters)

  const handleApplyFilters = () => {
    dispatch(applyFilters(filters))
    setOpen(false)
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="md:hidden"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>

      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="filter.title"
        description="filter.description"
      >
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              Apply
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  )
}
```

### Example 3: Delete Confirmation

```typescript
export const DeleteCustomerButton = ({ customer }: { customer: Customer }) => {
  const [open, setOpen] = useState(false)
  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation()

  const handleDelete = async () => {
    try {
      await deleteCustomer({ customerId: customer._id }).unwrap()
      // Show success toast
      setOpen(false)
    } catch (error) {
      // Show error toast
    }
  }

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        variant="danger"
        title="customer.delete.confirmTitle"
        description="customer.delete.confirmDescription"
        confirmLabel="customer.delete.confirm"
        cancelLabel="common.cancel"
        onConfirm={handleDelete}
        loading={isLoading}
      />
    </>
  )
}
```

### Example 4: Settings Drawer

```typescript
export const SettingsDrawer = () => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={() => setOpen(true)}
      >
        <Settings className="h-4 w-4" />
      </Button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        size="md"
        title="settings.title"
        description="settings.description"
      >
        <div className="space-y-6">
          {/* Theme */}
          <div>
            <h3 className="text-sm font-medium mb-3">Theme</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-sm font-medium mb-3">Language</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Save Button */}
          <Button className="w-full">
            Save Settings
          </Button>
        </div>
      </Drawer>
    </>
  )
}
```

---

<a name="best-practices"></a>
## 8. Best Practices

### ✅ DO's

1. **Use Modal for forms** (auto-adapts to mobile)
```typescript
<Modal size="lg"> {/* Forms need space */}
  <ModalHeader title="..." />
  <ModalBody>
    <YourForm />
  </ModalBody>
  <ModalFooter>
    <Button>Save</Button>
  </ModalFooter>
</Modal>
```

2. **Use ConfirmDialog for confirmations** (pre-built, consistent)
```typescript
<ConfirmDialog
  variant="danger"
  title="Delete?"
  onConfirm={handleDelete}
/>
```

3. **Use Sheet for mobile filters** (better UX)
```typescript
<Sheet title="Filters">
  <FilterOptions />
</Sheet>
```

4. **Close on success, keep on error**
```typescript
const handleSubmit = async () => {
  try {
    await save()
    setOpen(false) // Close on success
  } catch (error) {
    // Keep open, show error
  }
}
```

5. **Show loading states**
```typescript
<Button loading={isLoading}>
  Save
</Button>
```

6. **Use i18n keys**
```typescript
title="customer.modal.addTitle" // ✅ Good
title="Add Customer" // ❌ Bad
```

---

### ❌ DON'Ts

1. **Don't nest overlays** (confusing)
```typescript
// ❌ Bad
<Modal>
  <Button onClick={() => setDialog(true)}>Delete</Button>
  <Dialog>...</Dialog> {/* Don't nest */}
</Modal>

// ✅ Good - Use separate state
const [modalOpen, setModalOpen] = useState(false)
const [dialogOpen, setDialogOpen] = useState(false)
```

2. **Don't use Modal for simple confirmations**
```typescript
// ❌ Bad
<Modal><p>Are you sure?</p></Modal>

// ✅ Good
<ConfirmDialog title="Are you sure?" />
```

3. **Don't forget mobile testing**
```typescript
// ✅ Test on mobile
// ✅ Test sheet behavior
// ✅ Test touch interactions
```

4. **Don't use Drawer on mobile** (use Sheet instead)
```typescript
// ❌ Bad on mobile
<Drawer side="left">...</Drawer>

// ✅ Good - Use Sheet or Modal
const isMobile = useMediaQuery('(max-width: 768px)')
{isMobile ? <Sheet>...</Sheet> : <Drawer>...</Drawer>}
```

---

<a name="quick-reference"></a>
## 9. Quick Reference

### Component Selection

| Need | Use | Code |
|------|-----|------|
| Form (desktop & mobile) | Modal | `<Modal size="lg">` |
| Delete confirmation | ConfirmDialog | `<ConfirmDialog variant="danger">` |
| Mobile filters | Sheet | `<Sheet title="Filters">` |
| Settings panel | Drawer | `<Drawer side="right">` |
| Alert message | Dialog | `<Dialog title="Alert">` |

### Common Patterns

#### Pattern 1: Form Modal
```typescript
const [open, setOpen] = useState(false)

<Modal open={open} onOpenChange={setOpen} size="lg">
  <ModalHeader title="..." description="..." />
  <ModalBody>
    <Form />
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={handleSave}>Save</Button>
  </ModalFooter>
</Modal>
```

#### Pattern 2: Delete Confirmation
```typescript
const [open, setOpen] = useState(false)

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  variant="danger"
  title="Delete?"
  description="This cannot be undone"
  onConfirm={handleDelete}
  loading={isDeleting}
/>
```

#### Pattern 3: Mobile Sheet
```typescript
const [open, setOpen] = useState(false)

<Sheet open={open} onOpenChange={setOpen} title="...">
  <Content />
</Sheet>
```

### Translation Keys Required

```json
{
  "ui": {
    "modal": {
      "close": "Close"
    },
    "sheet": {
      "close": "Close"
    },
    "drawer": {
      "close": "Close"
    },
    "dialog": {
      "confirm": "Confirm",
      "cancel": "Cancel"
    }
  }
}
```

---

## 🎯 Summary

**Choose wisely:**
- **Modal** → Forms, details (auto-adaptive)
- **Sheet** → Mobile filters, quick actions
- **Drawer** → Settings, navigation (side)
- **Dialog** → Confirmations, alerts
- **ConfirmDialog** → Delete, warnings (pre-built)

**Remember:**
- ✅ Modal adapts to mobile automatically
- ✅ Use ConfirmDialog for confirmations
- ✅ Test on mobile devices
- ✅ Use i18n for all text
- ✅ Show loading states
- ✅ Close on success, keep on error

---

**Happy Coding! May your overlays be smooth! 🚀**