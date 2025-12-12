# 📋 DataTable Quick Reference Card

> **Print karke desk pe rakh lo! Quick reference ke liye.**

---

## 🎯 When to Use What?

| Scenario | Component | Why |
|----------|-----------|-----|
| Customer list dikhana hai | `CustomerTable` | Ready-made, all features included |
| Product list dikhana hai | `DataTable` | Flexible, customize karo |
| Order list dikhana hai | `DataTable` | Any data type ke liye |
| Invoice list dikhana hai | `DataTable` | Universal component |
| Simple list (3-4 columns) | `DataTable` | But keep it simple |

---

## 🚀 Copy-Paste Templates

### Template 1: Basic Table (5 minutes mein ready)

```typescript
import { DataTable } from '@/components/ui/data-display/DataTable'

const columns = [
  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
  { id: 'value', header: 'Value', accessorKey: 'value', sortable: true },
]

export const MyTable = () => {
  const { data, isLoading } = useGetDataQuery()
  
  return (
    <DataTable
      data={data || []}
      columns={columns}
      sorting={{ enabled: true }}
      pagination={{ enabled: true, pageSize: 20 }}
      loading={{ isLoading }}
    />
  )
}
```

---

### Template 2: Table with Actions

```typescript
import { Edit, Trash2 } from 'lucide-react'

const actions = [
  {
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (row) => navigate(`/edit/${row.id}`),
  },
  {
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    onClick: (row) => handleDelete(row),
  },
]

<DataTable
  data={data}
  columns={columns}
  rowActions={{ enabled: true, actions }}
/>
```

---

### Template 3: Customer Table (Ekdum Ready)

```typescript
import { CustomerTable } from '@/features/customer/components/CustomerTable'

<CustomerTable
  data={customers}
  isLoading={isLoading}
  permissions={{
    canViewCustomers: true,
    canEditCustomers: true,
    canDeleteCustomers: true,
  }}
  onDeleteCustomer={(customer) => setDeleteModal({ open: true, customer })}
/>
```

---

## 🔧 Feature Flags

| Feature | Prop | Value |
|---------|------|-------|
| **Sorting** | `sorting={{ enabled: true }}` | Enable sorting |
| **Pagination** | `pagination={{ enabled: true }}` | Enable pagination |
| **Selection** | `selection={{ enabled: true }}` | Enable row selection |
| **Actions** | `rowActions={{ enabled: true }}` | Enable action menu |
| **Loading** | `loading={{ isLoading: true }}` | Show skeleton |
| **Sticky Header** | `style={{ stickyHeader: true }}` | Fixed header |
| **Hover Effect** | `style={{ hoverEffect: true }}` | Row hover |
| **Zebra Stripes** | `style={{ zebraStripes: true }}` | Alternate colors |

---

## 💡 Common Patterns

### Pattern: Redux Integration
```typescript
const pagination = useAppSelector(selectPagination)
const dispatch = useAppDispatch()

pagination={{
  pageIndex: pagination.currentPage,
  pageSize: pagination.pageSize,
  onPaginationChange: ({ pageIndex, pageSize }) => {
    dispatch(setCurrentPage(pageIndex))
    dispatch(setPageSize(pageSize))
  },
}}
```

### Pattern: RTK Query
```typescript
const { data, isLoading } = useGetItemsQuery({ page, limit })

<DataTable
  data={data?.data?.data || []}
  loading={{ isLoading }}
  pagination={{
    totalItems: data?.data?.meta?.pagination?.total,
  }}
/>
```

### Pattern: Selection with Bulk Actions
```typescript
const [selected, setSelected] = useState(new Set())

{selected.size > 0 && (
  <div className="mb-4 p-4 bg-accent/10">
    {selected.size} selected
    <button onClick={handleBulkDelete}>Delete</button>
  </div>
)}

<DataTable
  selection={{
    enabled: true,
    selectedRows: selected,
    onSelectionChange: setSelected,
  }}
/>
```

---

## ❌ Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `data={data}` when loading | `data={data || []}` |
| Hardcoded text in header | Use i18n: `header: 'customer.name'` |
| `sortable: false` (default) | `sortable: true` to enable sorting |
| Inline functions in cell | Define outside or use useMemo |
| Same reference for data | `setData([...data, newItem])` |

---

## 🎨 Styling Quick Reference

```typescript
style={{
  variant: 'default' | 'bordered' | 'striped' | 'compact',
  size: 'sm' | 'md' | 'lg',
  stickyHeader: true,
  hoverEffect: true,
  zebraStripes: true,
  rowClassName: (row) => row.isVIP ? 'bg-accent/10' : '',
}}
```

---

## 📱 Responsive

```typescript
const isMobile = useMediaQuery('(max-width: 768px)')

<DataTable
  columns={isMobile ? compactColumns : fullColumns}
  pagination={{
    pageSize: isMobile ? 10 : 20,
    showFirstLastButtons: !isMobile,
  }}
/>
```

---

## 🐛 Debug Checklist

- [ ] Data array pass kiya? `data={data || []}`
- [ ] Columns array valid hai? Check `id` and `accessorKey`
- [ ] `sortable: true` hai sorting columns mein?
- [ ] Actions array defined hai?
- [ ] Permissions pass kiye CustomerTable mein?
- [ ] Loading state properly set hai?
- [ ] Console errors check kiye?

---

## 📞 Quick Help

**Table render nahi ho raha?**
- Check: `data` array hai ya nahi
- Check: `columns` array empty toh nahi

**Sorting kaam nahi kar rahi?**
- Check: `sortable: true` hai?
- Check: `sorting={{ enabled: true }}`

**Actions nahi dikh rahe?**
- Check: `rowActions={{ enabled: true }}`
- Check: `actions` array empty toh nahi

**Selection clear nahi ho raha?**
- Use: `setSelectedRows(new Set())`

---

## 🎯 Best Practices

1. ✅ `useMemo` for columns
2. ✅ `useCallback` for handlers
3. ✅ Error boundaries
4. ✅ Loading states
5. ✅ Empty states
6. ✅ i18n for all text
7. ✅ CSS variables for colors
8. ✅ TypeScript types
9. ✅ Responsive design
10. ✅ Permission checks

---

## 📚 Full Documentation

**Detailed Guide:** See `DataTable & CustomerTable - Complete Developer Guide.md`

**Component Files:**
- `src/components/ui/data-display/DataTable/`
- `src/features/customer/components/CustomerTable/`

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Maintained By:** Development Team

---

> **Tip:** Bookmark this page! Jab bhi confusion ho, yahan dekh lo! 