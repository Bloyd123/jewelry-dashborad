# 📚 DataTable & CustomerTable - Complete Developer Guide

> **Bhai, yeh documentation hai DataTable aur CustomerTable ke liye. Isko achhe se padh lo, phir kabhi confusion nahi hoga!**

---

## 📖 Table of Contents

1. [DataTable Component - Basic Understanding](#datatable-basic)
2. [DataTable - All Features Explained](#datatable-features)
3. [CustomerTable - Ready-Made Customer List](#customertable)
4. [Real Examples - Copy Paste Karo](#real-examples)
5. [Common Patterns - Aise Use Karo](#common-patterns)
6. [Troubleshooting - Problem Solve Karo](#troubleshooting)
7. [Best Practices - Yeh Follow Karo](#best-practices)

---

<a name="datatable-basic"></a>
## 1. DataTable Component - Basic Understanding

### Kya Hai Yeh?

**DataTable** ek **super flexible, reusable table component** hai jo **kisi bhi data** ko table format mein dikhane ke liye use kar sakte ho.

### Kahan Use Karo?

 Customer List  
 Product List  
 Order List  
 Invoice List  
 Transaction List  
 User List  
 **Basically ANY LIST!**

### Basic Structure Samjho

```typescript
<DataTable
  data={yourData}           // Jo data dikhana hai
  columns={columnDefinitions} // Columns kaise dikhane hai
  // ... optional features
/>
```

---

### 🎯 Simplest Example (Shuru Karo Yahaan Se)

```typescript
import { DataTable } from '@/components/ui/data-display/DataTable'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'

// 1️⃣ Apna data type define karo
interface Product {
  id: string
  name: string
  price: number
  stock: number
}

// 2️⃣ Sample data
const products: Product[] = [
  { id: '1', name: 'iPhone 14', price: 79900, stock: 10 },
  { id: '2', name: 'Samsung S23', price: 74999, stock: 5 },
  { id: '3', name: 'OnePlus 11', price: 56999, stock: 0 },
]

// 3️⃣ Columns define karo
const columns: DataTableColumn<Product>[] = [
  {
    id: 'name',
    header: 'Product Name',
    accessorKey: 'name',
    sortable: true,
  },
  {
    id: 'price',
    header: 'Price',
    accessorKey: 'price',
    sortable: true,
    align: 'right',
    cell: ({ value }) => `₹${value.toLocaleString()}`,
  },
  {
    id: 'stock',
    header: 'Stock',
    accessorKey: 'stock',
    sortable: true,
    align: 'right',
    cell: ({ value }) => (
      <span className={value === 0 ? 'text-status-error' : 'text-text-primary'}>
        {value}
      </span>
    ),
  },
]

// 4️⃣ Use karo
export const ProductTable = () => {
  return (
    <DataTable
      data={products}
      columns={columns}
      sorting={{ enabled: true }}
      pagination={{ enabled: true, pageSize: 10 }}
    />
  )
}
```

**Bas! Itna hi! 🎉**

---

<a name="datatable-features"></a>
## 2. DataTable - All Features Explained

### Feature 1: Columns Definition (Sabse Important!)

#### Basic Column

```typescript
{
  id: 'name',              // Unique ID (required)
  header: 'Customer Name', // Header text (i18n key bhi ho sakta hai)
  accessorKey: 'name',     // Data object se kis key ko access karna hai
  sortable: true,          // Sorting enable/disable
}
```

#### Custom Cell Rendering

```typescript
{
  id: 'status',
  header: 'Status',
  accessorKey: 'isActive',
  cell: ({ value }) => (
    <Badge variant={value ? 'success' : 'default'}>
      {value ? 'Active' : 'Inactive'}
    </Badge>
  ),
}
```

#### Computed Value (Multiple Fields Se Value Nikalna)

```typescript
{
  id: 'fullName',
  header: 'Full Name',
  accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  sortable: true,
  cell: ({ value }) => <span className="font-medium">{value}</span>,
}
```

#### Width, Alignment, Styling

```typescript
{
  id: 'price',
  header: 'Price',
  accessorKey: 'price',
  width: 150,              // Fixed width
  minWidth: 100,           // Minimum width
  maxWidth: 200,           // Maximum width
  align: 'right',          // left | center | right
  className: 'font-bold',  // Column class
  headerClassName: 'bg-accent/10', // Header class
  cellClassName: 'text-accent',    // Cell class
}
```

---

### Feature 2: Sorting (Sorting Enable Karna)

#### Enable Karo

```typescript
<DataTable
  data={data}
  columns={columns}
  sorting={{
    enabled: true,  // Sorting on
  }}
/>
```

#### Controlled Sorting (Redux Se Control Karo)

```typescript
const [sortingState, setSortingState] = useState([
  { columnId: 'name', direction: 'asc' }
])

<DataTable
  data={data}
  columns={columns}
  sorting={{
    enabled: true,
    sortingState: sortingState,
    onSortingChange: (newSorting) => {
      setSortingState(newSorting)
      // Redux dispatch bhi kar sakte ho
    },
  }}
/>
```

#### Custom Sort Function

```typescript
{
  id: 'date',
  header: 'Date',
  accessorKey: 'createdAt',
  sortable: true,
  sortingFn: (rowA, rowB) => {
    const dateA = new Date(rowA.createdAt).getTime()
    const dateB = new Date(rowB.createdAt).getTime()
    return dateA - dateB
  },
}
```

---

### Feature 3: Pagination (Page By Page Data Dikhana)

#### Simple Pagination

```typescript
<DataTable
  data={data}
  columns={columns}
  pagination={{
    enabled: true,
    pageSize: 20,  // Per page kitne items
  }}
/>
```

#### Full Control Pagination

```typescript
const [pageIndex, setPageIndex] = useState(0)
const [pageSize, setPageSize] = useState(20)

<DataTable
  data={data}
  columns={columns}
  pagination={{
    enabled: true,
    pageIndex: pageIndex,
    pageSize: pageSize,
    pageSizeOptions: [10, 20, 50, 100],
    totalItems: data.length,
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setPageIndex(pageIndex)
      setPageSize(pageSize)
    },
    showPageSizeSelector: true,
    showPageInfo: true,
    showFirstLastButtons: true,
  }}
/>
```

#### Server-Side Pagination

```typescript
// Backend se paginated data aata hai
const { data: response, isLoading } = useGetProductsQuery({
  page: pageIndex + 1,
  limit: pageSize,
})

<DataTable
  data={response?.data?.data || []}
  columns={columns}
  pagination={{
    enabled: true,
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItems: response?.data?.meta?.pagination?.total || 0,
    totalPages: response?.data?.meta?.pagination?.totalPages || 0,
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setPageIndex(pageIndex)
      setPageSize(pageSize)
    },
  }}
/>
```

---

### Feature 4: Selection (Rows Select Karna)

#### Simple Selection

```typescript
const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

<DataTable
  data={data}
  columns={columns}
  selection={{
    enabled: true,
    selectedRows: selectedRows,
    onSelectionChange: (newSelection) => {
      setSelectedRows(newSelection)
      console.log('Selected IDs:', Array.from(newSelection))
    },
    getRowId: (row) => row.id,
    selectAllEnabled: true,
  }}
/>

// Selected count dikhao
{selectedRows.size > 0 && (
  <div className="mt-4 p-4 bg-accent/10 rounded-lg">
    <p>{selectedRows.size} items selected</p>
    <button onClick={() => console.log('Delete selected')}>
      Delete Selected
    </button>
  </div>
)}
```

---

### Feature 5: Row Actions (Har Row Pe Actions)

#### Simple Actions

```typescript
import { Edit, Trash2, Eye } from 'lucide-react'

const rowActions: RowAction<Product>[] = [
  {
    label: 'View',
    icon: <Eye className="h-4 w-4" />,
    onClick: (row) => console.log('View:', row),
  },
  {
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (row) => console.log('Edit:', row),
  },
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    onClick: (row) => console.log('Delete:', row),
  },
]

<DataTable
  data={data}
  columns={columns}
  rowActions={{
    enabled: true,
    actions: rowActions,
    position: 'end', // 'start' or 'end'
  }}
/>
```

#### Conditional Actions (Kuch Rows Pe Hide/Disable)

```typescript
const rowActions: RowAction<Product>[] = [
  {
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (row) => console.log('Edit:', row),
    disabled: (row) => row.stock === 0, // Out of stock pe disable
  },
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    onClick: (row) => console.log('Delete:', row),
    hidden: (row) => row.isProtected, // Protected items pe hide
  },
  {
    label: 'Mark as Featured',
    icon: <Star className="h-4 w-4" />,
    onClick: (row) => console.log('Feature:', row),
    hidden: (row) => row.isFeatured, // Already featured pe hide
  },
]
```

---

### Feature 6: Loading States

```typescript
const { data, isLoading } = useGetProductsQuery()

<DataTable
  data={data || []}
  columns={columns}
  loading={{
    isLoading: isLoading,
    loadingRows: 10, // Kitne skeleton rows dikhane hai
  }}
/>
```

#### Custom Loading Component

```typescript
<DataTable
  data={data || []}
  columns={columns}
  loading={{
    isLoading: isLoading,
    loadingComponent: (
      <div className="p-8 text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-text-secondary">Loading products...</p>
      </div>
    ),
  }}
/>
```

---

### Feature 7: Empty State

```typescript
<DataTable
  data={data}
  columns={columns}
  emptyState={{
    message: 'No products found',
    icon: <Package className="h-12 w-12" />,
    action: {
      label: 'Add Product',
      onClick: () => navigate('/products/new'),
    },
  }}
/>
```

---

### Feature 8: Row Expansion (Expandable Rows)

```typescript
const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

<DataTable
  data={orders}
  columns={columns}
  rowExpansion={{
    enabled: true,
    expandedRows: expandedRows,
    onExpandedChange: setExpandedRows,
    renderExpanded: (order) => (
      <div className="p-4 bg-bg-tertiary">
        <h4 className="font-semibold mb-2">Order Items:</h4>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td className="text-right">{item.qty}</td>
                <td className="text-right">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  }}
  getRowId={(row) => row.id}
/>
```

---

### Feature 9: Styling Options

```typescript
<DataTable
  data={data}
  columns={columns}
  style={{
    variant: 'default',     // 'default' | 'bordered' | 'striped' | 'compact'
    size: 'md',            // 'sm' | 'md' | 'lg'
    stickyHeader: true,    // Header fixed rahega scroll pe
    hoverEffect: true,     // Row hover effect
    zebraStripes: true,    // Alternate row colors
    showBorder: true,      // Border dikhana
    rounded: true,         // Rounded corners
    shadow: false,         // Drop shadow
    
    // Custom row styling
    rowClassName: (row, index) => {
      if (row.isVIP) return 'bg-accent/10'
      if (row.isBlacklisted) return 'bg-status-error/10'
      return ''
    },
  }}
/>
```

---

### Feature 10: Row Events

```typescript
<DataTable
  data={data}
  columns={columns}
  onRowClick={(row) => {
    console.log('Row clicked:', row)
    navigate(`/products/${row.id}`)
  }}
  onRowDoubleClick={(row) => {
    console.log('Row double clicked:', row)
  }}
  onRowContextMenu={(row, index, event) => {
    event.preventDefault()
    console.log('Right clicked:', row)
    // Show context menu
  }}
/>
```

---

<a name="customertable"></a>
## 3. CustomerTable - Ready-Made Customer List

### Kya Hai Yeh?

**CustomerTable** ek **ready-made component** hai jo **specifically customers ke liye** banaya gaya hai. Isme **saare customer-specific features** already included hain.

### Kya-Kya Included Hai?

 Customer code, name, phone display  
 Email, customer type, membership tier  
 Loyalty points, total purchases, outstanding due  
 Last order date, status badges  
 View, Edit, Delete actions  
 Call, WhatsApp, Email quick actions  
 Blacklist management  
 Loyalty points add/redeem  
 VIP marking  
 Payment recording  
 Permission-based access control  
 Responsive design (mobile cards)  
 Redux integration  
 RTK Query ready  

---

### Simple Usage (Copy Paste Karo)

```typescript
import { CustomerTable } from '@/features/customer/components/CustomerTable'
import { useGetCustomersQuery } from '@/api/services/customerService'

export const CustomerListPage = () => {
  const shopId = useAppSelector((state) => state.auth.currentShop?._id)
  
  // Fetch customers
  const { data, isLoading } = useGetCustomersQuery({
    shopId: shopId!,
    page: 1,
    limit: 20,
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      
      <CustomerTable
        data={data?.data?.data || []}
        isLoading={isLoading}
        permissions={{
          canViewCustomers: true,
          canEditCustomers: true,
          canDeleteCustomers: true,
        }}
      />
    </div>
  )
}
```

**Bas! Itna hi! Customer list ready! 🎉**

---

### Full-Featured Usage (Saare Features Ke Saath)

```typescript
import { useState } from 'react'
import { CustomerTable } from '@/features/customer/components/CustomerTable'
import { useGetCustomersQuery } from '@/api/services/customerService'
import { useAppSelector } from '@/store/hooks'

export const CustomerListPage = () => {
  const shopId = useAppSelector((state) => state.auth.currentShop?._id)
  const permissions = useAppSelector((state) => state.auth.user?.permissions)

  // Fetch customers
  const { data, isLoading, error } = useGetCustomersQuery({
    shopId: shopId!,
    page: 1,
    limit: 20,
  })

  // Modal states
  const [deleteModal, setDeleteModal] = useState({ open: false, customer: null })
  const [blacklistModal, setBlacklistModal] = useState({ open: false, customer: null })

  // Action handlers
  const handleDeleteCustomer = (customer) => {
    setDeleteModal({ open: true, customer })
  }

  const handleBlacklistCustomer = (customer) => {
    setBlacklistModal({ open: true, customer })
  }

  const handleRemoveBlacklist = async (customer) => {
    // API call to remove blacklist
    await removeBlacklistMutation({ customerId: customer._id })
  }

  const handleAddLoyaltyPoints = (customer) => {
    // Open loyalty points modal
    console.log('Add points for:', customer)
  }

  const handleRecordPayment = (customer) => {
    // Open payment modal
    console.log('Record payment for:', customer)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      
      <CustomerTable
        data={data?.data?.data || []}
        isLoading={isLoading}
        error={error ? 'Failed to load customers' : null}
        
        // Permissions
        permissions={permissions}
        
        // Action handlers
        onDeleteCustomer={handleDeleteCustomer}
        onBlacklistCustomer={handleBlacklistCustomer}
        onRemoveBlacklist={handleRemoveBlacklist}
        onAddLoyaltyPoints={handleAddLoyaltyPoints}
        onRedeemLoyaltyPoints={handleAddLoyaltyPoints}
        onRecordPayment={handleRecordPayment}
        onMarkAsVIP={async (customer) => {
          await markAsVIPMutation({ customerId: customer._id })
        }}
        
        // UI options
        showSelection={true}
        showActions={true}
        compact={false}
      />

      {/* Modals */}
      {deleteModal.open && (
        <DeleteCustomerModal
          customer={deleteModal.customer}
          onClose={() => setDeleteModal({ open: false, customer: null })}
        />
      )}
    </div>
  )
}
```

---

### CustomerTable Props Explained

```typescript
interface CustomerTableProps {
  // Required
  data: CustomerListItem[]              // Customer data array
  
  // Optional
  isLoading?: boolean                   // Loading state
  error?: string | null                 // Error message
  
  // Permissions (user ke permissions pass karo)
  permissions?: {
    canViewCustomers?: boolean
    canEditCustomers?: boolean
    canDeleteCustomers?: boolean
    canManageCustomers?: boolean
    canBlacklistCustomer?: boolean
    canRemoveCustomerBlacklist?: boolean
    canAddLoyaltyPoints?: boolean
    canRedeemLoyaltyPoints?: boolean
    canCreateSales?: boolean
    canCreatePayments?: boolean
  }
  
  // Action handlers (jo actions chahiye wo pass karo)
  onCustomerClick?: (customer) => void
  onDeleteCustomer?: (customer) => void
  onBlacklistCustomer?: (customer) => void
  onRemoveBlacklist?: (customer) => void
  onAddLoyaltyPoints?: (customer) => void
  onRedeemLoyaltyPoints?: (customer) => void
  onRecordPayment?: (customer) => void
  onMarkAsVIP?: (customer) => void
  
  // UI options
  compact?: boolean                     // Compact mode (mobile)
  showSelection?: boolean               // Row selection enable/disable
  showActions?: boolean                 // Actions menu enable/disable
}
```

---

<a name="real-examples"></a>
## 4. Real Examples - Copy Paste Karo

### Example 1: Product List

```typescript
import { DataTable } from '@/components/ui/data-display/DataTable'
import { Edit, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  isActive: boolean
}

const columns: DataTableColumn<Product>[] = [
  {
    id: 'name',
    header: 'product.name',
    accessorKey: 'name',
    sortable: true,
  },
  {
    id: 'category',
    header: 'product.category',
    accessorKey: 'category',
    sortable: true,
  },
  {
    id: 'price',
    header: 'product.price',
    accessorKey: 'price',
    sortable: true,
    align: 'right',
    cell: ({ value }) => `₹${value.toLocaleString()}`,
  },
  {
    id: 'stock',
    header: 'product.stock',
    accessorKey: 'stock',
    sortable: true,
    align: 'right',
    cell: ({ value }) => (
      <span className={value < 10 ? 'text-status-warning font-medium' : 'text-text-primary'}>
        {value}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'product.status',
    accessorKey: 'isActive',
    cell: ({ value }) => (
      <Badge variant={value ? 'success' : 'default'}>
        {value ? t('common.active') : t('common.inactive')}
      </Badge>
    ),
  },
]

const rowActions = [
  {
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (row) => navigate(`/products/edit/${row.id}`),
  },
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    onClick: (row) => handleDelete(row),
    disabled: (row) => row.stock > 0,
  },
]

export const ProductTable = () => {
  const { data, isLoading } = useGetProductsQuery()

  return (
    <DataTable
      data={data || []}
      columns={columns}
      sorting={{ enabled: true }}
      pagination={{ enabled: true, pageSize: 20 }}
      rowActions={{ enabled: true, actions: rowActions }}
      loading={{ isLoading }}
    />
  )
}
```

---

### Example 2: Order List with Expandable Rows

```typescript
interface Order {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  items: Array<{ name: string; qty: number; price: number }>
}

const columns: DataTableColumn<Order>[] = [
  {
    id: 'orderNumber',
    header: 'order.number',
    accessorKey: 'orderNumber',
    sortable: true,
  },
  {
    id: 'customerName',
    header: 'order.customer',
    accessorKey: 'customerName',
    sortable: true,
  },
  {
    id: 'total',
    header: 'order.total',
    accessorKey: 'total',
    sortable: true,
    align: 'right',
    cell: ({ value }) => `₹${value.toLocaleString()}`,
  },
  {
    id: 'status',
    header: 'order.status',
    accessorKey: 'status',
    cell: ({ value }) => {
      const variants = {
        pending: 'warning',
        completed: 'success',
        cancelled: 'error',
      }
      return <Badge variant={variants[value]}>{t(`order.status.${value}`)}</Badge>
    },
  },
]

export const OrderTable = () => {
  const [expandedRows, setExpandedRows] = useState(new Set())
  const { data } = useGetOrdersQuery()

  return (
    <DataTable
      data={data || []}
      columns={columns}
      sorting={{ enabled: true }}
      pagination={{ enabled: true }}
      rowExpansion={{
        enabled: true,
        expandedRows,
        onExpandedChange: setExpandedRows,
        renderExpanded: (order) => (
          <div className="p-4 bg-bg-tertiary">
            <h4 className="font-semibold mb-2">Order Items:</h4>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td className="text-right">{item.qty}</td>
                    <td className="text-right">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      }}
    />
  )
}
```

---

### Example 3: Invoice List with Selection & Bulk Actions

```typescript
export const InvoiceTable = () => {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const { data } = useGetInvoicesQuery()

  const handleBulkDelete = () => {
    const selectedIds = Array.from(selectedRows)
    console.log('Delete invoices:', selectedIds)
    // Call bulk delete API
  }

  const handleBulkExport = () => {
    const selectedIds = Array.from(selectedRows)
    console.log('Export invoices:', selectedIds)
    // Export selected invoices
  }

  return (
    <div>
      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div className="mb-4 p-4 bg-accent/10 border border-accent rounded-lg flex items-center justify-between">
          <p className="text-text-primary font-medium">
            {selectedRows.size} invoice(s) selected
          </p>
          <div className="flex gap-2">
            <Button onClick={handleBulkExport}>
              Export Selected
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <DataTable
        data={data || []}
        columns={invoiceColumns}
        sorting={{ enabled: true }}
        pagination={{ enabled: true }}
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: (row) => row.id,
        }}
      />
    </div>
  )
}
```

---

<a name="common-patterns"></a>
## 5. Common Patterns - Aise Use Karo

### Pattern 1: Redux Se Integrate Karna

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  selectCustomerPagination,
  selectSelectedCustomerIds,
  setCurrentPage,
  setPageSize,
  setSorting,
} from '@/store/slices/customerSlice'

export const CustomerList = () => {
  const dispatch = useAppDispatch()
  const pagination = useAppSelector(selectCustomerPagination)
  const selectedIds = useAppSelector(selectSelectedCustomerIds)

  return (
    <DataTable
      data={customers}
      columns={columns}
      sorting={{
        enabled: true,
        sortingState: [{ 
          columnId: pagination.sortBy, 
          direction: pagination.sortOrder 
        }],
        onSortingChange: (sorting) => {
          dispatch(setSorting({
            sortBy: sorting[0].columnId,
            sortOrder: sorting[0].direction,
          }))
        },
      }}
      pagination={{
        enabled: true,
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
        onPaginationChange: ({ pageIndex, pageSize }) => {
          dispatch(setCurrentPage(pageIndex))
          dispatch(setPageSize(pageSize))
        },
      }}
    />
  )
}
```

---

### Pattern 2: RTK Query Ke Saath

```typescript
export const ProductList = () => {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [sorting, setSorting] = useState([])

  // RTK Query hook
  const { data, isLoading, isFetching } = useGetProductsQuery({
    page: page + 1,
    limit: pageSize,
    sortBy: sorting[0]?.columnId,
    sortOrder: sorting[0]?.direction,
  })

  return (
    <DataTable
      data={data?.data?.data || []}
      columns={columns}
      loading={{ 
        isLoading: isLoading || isFetching 
      }}
      sorting={{
        enabled: true,
        sortingState: sorting,
        onSortingChange: setSorting,
      }}
      pagination={{
        enabled: true,
        pageIndex: page,
        pageSize: pageSize,
        totalItems: data?.data?.meta?.pagination?.total || 0,
        onPaginationChange: ({ pageIndex, pageSize }) => {
          setPage(pageIndex)
          setPageSize(pageSize)
        },
      }}
    />
  )
}
```

---

### Pattern 3: Filters Ke Saath

```typescript
export const CustomerList = () => {
  const [filters, setFilters] = useState({
    search: '',
    customerType: undefined,
    isActive: undefined,
  })

  // Apply filters on data
  const filteredData = useMemo(() => {
    return customers.filter(customer => {
      if (filters.search && !customer.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.customerType && customer.customerType !== filters.customerType) {
        return false
      }
      if (filters.isActive !== undefined && customer.isActive !== filters.isActive) {
        return false
      }
      return true
    })
  }, [customers, filters])

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          value={filters.customerType || ''}
          onValueChange={(value) => setFilters({ ...filters, customerType: value || undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="wholesale">Wholesale</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        sorting={{ enabled: true }}
        pagination={{ enabled: true }}
      />
    </div>
  )
}
```

---

### Pattern 4: Mobile Responsive

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery'

export const ResponsiveTable = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Mobile ke liye compact columns
  const mobileColumns = [
    {
      id: 'summary',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-text-tertiary">{row.phone}</div>
        </div>
      ),
    },
  ]

  // Desktop ke liye full columns
  const desktopColumns = [
    { id: 'name', header: 'Name', accessorKey: 'name' },
    { id: 'phone', header: 'Phone', accessorKey: 'phone' },
    { id: 'email', header: 'Email', accessorKey: 'email' },
    // ... more columns
  ]

  return (
    <DataTable
      data={data}
      columns={isMobile ? mobileColumns : desktopColumns}
      pagination={{
        enabled: true,
        pageSize: isMobile ? 10 : 20,
        showFirstLastButtons: !isMobile,
      }}
    />
  )
}
```

---

<a name="troubleshooting"></a>
## 6. Troubleshooting - Problem Solve Karo

### Problem 1: Table Update Nahi Ho Raha

**Reason:** Data reference same hai, React ko pata nahi chal raha update hua

**Solution:**
```typescript
//  Wrong
const handleUpdate = () => {
  data.push(newItem) // Same reference
  setData(data)
}

// Correct
const handleUpdate = () => {
  setData([...data, newItem]) // New reference
}

// Or with Redux
dispatch(addCustomer(newItem)) // Redux internally new reference banata hai
```

---

### Problem 2: Sorting Kaam Nahi Kar Rahi

**Reason:** Column mein `sortable: true` nahi hai ya accessor wrong hai

**Solution:**
```typescript
// Correct
{
  id: 'name',
  header: 'Name',
  accessorKey: 'name',  // Yeh zaruri hai
  sortable: true,       // Yeh bhi zaruri hai
}
```

---

### Problem 3: Selection Clear Nahi Ho Raha

**Solution:**
```typescript
const [selectedRows, setSelectedRows] = useState(new Set())

// Clear selection
const clearSelection = () => {
  setSelectedRows(new Set()) // New empty Set
}
```

---

### Problem 4: Actions Menu Nahi Dikh Raha

**Reason:** Permissions missing ya actions array empty

**Solution:**
```typescript
// Check karo actions array
console.log('Actions:', rowActions)

// Check karo permissions
console.log('Permissions:', permissions)

// Ensure rowActions enabled hai
rowActions={{
  enabled: true, // Yeh zaruri
  actions: rowActions,
}}
```

---

### Problem 5: Pagination Wrong Total Dikha Raha

**Client-Side Pagination:**
```typescript
// Correct - totalItems mat do
pagination={{
  enabled: true,
  pageSize: 20,
  // totalItems nahi chahiye client-side ke liye
}}
```

**Server-Side Pagination:**
```typescript
// Correct - totalItems zaruri hai
pagination={{
  enabled: true,
  pageSize: 20,
  totalItems: response?.meta?.pagination?.total || 0,
}}
```

---

<a name="best-practices"></a>
## 7. Best Practices - Yeh Follow Karo

### DO's

1. **Column definitions ko useMemo mein wrap karo**
```typescript
const columns = useMemo(() => [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  // ...
], []) // Dependencies empty if static
```

2. **Data ko prop drilling se bachao, Redux/Context use karo**
```typescript
// Good
const data = useAppSelector(selectCustomers)

//  Avoid
<Parent>
  <Child>
    <GrandChild>
      <DataTable data={data} /> {/* Too much drilling */}
    </GrandChild>
  </Child>
</Parent>
```

3. **Translation keys use karo, hardcoded text avoid karo**
```typescript
// Good
{ header: 'customer.fields.name' }

//  Bad
{ header: 'Customer Name' }
```

4. **Loading states properly handle karo**
```typescript
const { data, isLoading, isFetching } = useGetCustomersQuery()

<DataTable
  data={data || []}
  loading={{ isLoading: isLoading || isFetching }}
/>
```

5. **Error handling karo**
```typescript
const { data, error } = useGetCustomersQuery()

if (error) {
  return <ErrorComponent error={error} />
}
```

---

###  DON'Ts

1. **Inline functions mat banao columns mein (performance issue)**
```typescript
//  Bad
cell: ({ value }) => {
  const formatted = formatDate(value) // Har render pe call hoga
  return formatted
}

// Good
cell: ({ value }) => formatDate(value)
```

2. **Heavy computations mat karo cell rendering mein**
```typescript
//  Bad
cell: ({ row }) => {
  const result = heavyComputation(row) // Har row ke liye!
  return result
}

// Good - Pehle compute karo
const processedData = useMemo(
  () => data.map(row => ({ ...row, computed: heavyComputation(row) })),
  [data]
)
```

3. **Har jagah DataTable mat use karo**
```typescript
//  Bad - Simple list ke liye DataTable overkill hai
<DataTable data={[1, 2, 3]} columns={...} />

// Good - Simple list use karo
<ul>
  {items.map(item => <li key={item}>{item}</li>)}
</ul>
```

---

## 🎯 Quick Reference Cheat Sheet

```typescript
// BASIC TABLE
<DataTable data={data} columns={columns} />

// WITH SORTING
sorting={{ enabled: true }}

// WITH PAGINATION
pagination={{ enabled: true, pageSize: 20 }}

// WITH SELECTION
selection={{
  enabled: true,
  selectedRows: selected,
  onSelectionChange: setSelected,
}}

// WITH ACTIONS
rowActions={{
  enabled: true,
  actions: [
    { label: 'Edit', icon: <Edit />, onClick: (row) => {} },
  ],
}}

// WITH LOADING
loading={{ isLoading: true }}

// WITH EMPTY STATE
emptyState={{ message: 'No data', action: { label: 'Add', onClick: () => {} } }}

// CUSTOMER TABLE (Ready-made)
<CustomerTable
  data={customers}
  isLoading={loading}
  permissions={permissions}
  onDeleteCustomer={handleDelete}
/>
```

---

## 📞 Need Help?

### Common Questions

**Q: Kaunsa use karu - DataTable ya CustomerTable?**  
A: Agar **customers** dikhane hai toh **CustomerTable** use karo (ready-made hai). Agar **kuch aur** (products, orders, etc.) toh **DataTable** use karo.

**Q: Redux zaroori hai?**  
A: Nahi, optional hai. `useState` se bhi chal jayega. But large app mein Redux better hai.

**Q: Server-side pagination kaise?**  
A: `totalItems` aur `totalPages` pass karo. Backend se data fetch karo jab page change ho.

**Q: Mobile pe kaise dikhega?**  
A: Automatically responsive hai. Ya `compact={true}` use kar sakte ho CustomerTable mein.

**Q: Custom styling kaise?**  
A: `style` prop mein `className`, `rowClassName` use karo. CSS variables already theme-based hain.

---

## 🚀 Final Tips

1. **Start simple** - Pehle basic table banao, phir features add karo
2. **Copy examples** - Documentation mein examples copy karo
3. **Use CustomerTable** - Customers ke liye CustomerTable already ready hai
4. **Check console** - Errors console mein dikhte hain
5. **Ask team** - Confusion ho toh team se pucho

---

**Happy Coding! 🎉**

Agar kuch samajh nahi aaya toh yeh document phir se padho. Sab kuch detail mein explain kiya hai!