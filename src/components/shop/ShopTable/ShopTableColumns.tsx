// ============================================================================
// FILE: src/components/features/ShopTable/ShopTableColumns.tsx
// Shop Table Column Definitions
// ============================================================================

import { Copy, MapPin, Phone, Award } from 'lucide-react'
import { Avatar } from '@/components/ui/data-display/Avatar'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Shop, ShopType, ShopCategory } from '@/types/shop.types'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format currency in INR
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date - handles string, Date, and undefined
 */
const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return '-'
  }
}

/**
 * Copy to clipboard
 */
const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text)
}

/**
 * Get manager full name
 */
const getManagerName = (shop: Shop): string => {
  if (!shop.managerId || typeof shop.managerId === 'string') return 'N/A'
  return `${shop.managerId.firstName} ${shop.managerId.lastName}`
}

/**
 * Get manager email
 */
const getManagerEmail = (shop: Shop): string => {
  if (!shop.managerId || typeof shop.managerId === 'string') return ''
  return shop.managerId.email || ''
}

/**
 * Badge variant type from Badge component
 */
type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'accent'
  | 'outline'
  | 'vip'
  | 'retail'
  | 'wholesale'
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'cancelled'

/**
 * Get badge variant for shop type
 */
const getShopTypeVariant = (shopType: ShopType | undefined): BadgeVariant => {
  if (!shopType) return 'default'

  const variants: Record<ShopType, BadgeVariant> = {
    retail: 'info',
    wholesale: 'warning',
    manufacturing: 'default',
    showroom: 'accent',
    workshop: 'default',
    warehouse: 'default',
    online: 'success',
  }

  return variants[shopType] ?? 'default'
}

/**
 * Get badge variant for shop category
 */
const getCategoryVariant = (
  category: ShopCategory | undefined
): BadgeVariant => {
  if (!category) return 'default'

  const variants: Record<ShopCategory, BadgeVariant> = {
    jewelry: 'accent',
    gold: 'warning',
    silver: 'info',
    diamond: 'default',
    gemstone: 'success',
    pearls: 'default',
    platinum: 'default',
    mixed: 'default',
  }

  return variants[category] ?? 'default'
}

// ============================================================================
// COLUMN DEFINITIONS
// ============================================================================

export const shopTableColumns: DataTableColumn<Shop>[] = [
  // 1. Shop Code with Badge
  {
    id: 'code',
    header: 'table.shopCode',
    accessorKey: 'code',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-text-primary">
          {row.code}
        </span>
        {row.isFeatured && <Award className="h-3.5 w-3.5 text-accent" />}
      </div>
    ),
  },

  // 2. Shop Name with Display Name
  {
    id: 'name',
    header: 'table.shopName',
    accessorKey: 'name',
    sortable: true,
    width: '220px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-text-primary">{row.name}</span>
        {row.displayName && row.displayName !== row.name && (
          <span className="text-xs text-text-tertiary">{row.displayName}</span>
        )}
      </div>
    ),
  },

  // 3. Shop Type & Category Badges
  {
    id: 'type',
    header: 'table.type',
    accessorKey: 'shopType',
    sortable: true,
    width: '160px',
    cell: ({ row }) => {
      const shopType = row.shopType || 'retail'
      const category = row.category || 'mixed'

      return (
        <div className="flex flex-col gap-1.5">
          <Badge variant={getShopTypeVariant(row.shopType)} size="sm">
            {shopType.toUpperCase()}
          </Badge>
          <Badge variant={getCategoryVariant(row.category)} size="sm">
            {category}
          </Badge>
        </div>
      )
    },
  },

  // 4. Location with Icon
  {
    id: 'location',
    header: 'table.location',
    accessorFn: row => `${row.address.city}, ${row.address.state}`,
    sortable: true,
    width: '180px',
    cell: ({ row }) => (
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">
            {row.address.city}
          </span>
          <span className="text-xs text-text-tertiary">
            {row.address.state}
          </span>
        </div>
      </div>
    ),
  },

  // 5. Contact with Copy Button
  {
    id: 'contact',
    header: 'table.contact',
    accessorKey: 'phone',
    sortable: false,
    width: '160px',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-text-tertiary" />
          <span className="text-sm text-text-primary">{row.phone}</span>
          <button
            onClick={e => {
              e.stopPropagation()
              copyToClipboard(row.phone)
            }}
            className="rounded p-1 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            aria-label="Copy phone number"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
        {row.email && (
          <span className="truncate text-xs text-text-tertiary">
            {row.email}
          </span>
        )}
      </div>
    ),
  },

  // 6. Manager with Avatar
  {
    id: 'manager',
    header: 'table.manager',
    accessorFn: row => getManagerName(row),
    sortable: true,
    width: '180px',
    cell: ({ row }) => {
      const managerName = getManagerName(row)
      const managerEmail = getManagerEmail(row)

      return (
        <div className="flex items-center gap-2">
          <Avatar name={managerName} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              {managerName}
            </span>
            {managerEmail && (
              <span className="truncate text-xs text-text-tertiary">
                {managerEmail}
              </span>
            )}
          </div>
        </div>
      )
    },
  },

  // 7. GST Number (if available)
  {
    id: 'gst',
    header: 'table.gstNumber',
    accessorKey: 'gstNumber',
    sortable: true,
    width: '160px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.gstNumber ? (
          <>
            <span className="font-mono text-sm text-text-primary">
              {row.gstNumber}
            </span>
            <button
              onClick={e => {
                e.stopPropagation()
                copyToClipboard(row.gstNumber!)
              }}
              className="rounded p-1 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              aria-label="Copy GST number"
            >
              <Copy className="h-3 w-3" />
            </button>
          </>
        ) : (
          <span className="text-sm text-text-tertiary">-</span>
        )}
      </div>
    ),
  },

  // 8. Total Products
  {
    id: 'products',
    header: 'table.products',
    accessorFn: row => row.statistics?.totalProducts ?? 0,
    sortable: true,
    align: 'center',
    width: '120px',
    cell: ({ row }) => (
      <div className="text-center">
        <span className="font-semibold text-text-primary">
          {(row.statistics?.totalProducts ?? 0).toLocaleString('en-IN')}
        </span>
      </div>
    ),
  },

  // 9. Inventory Value
  {
    id: 'inventory',
    header: 'table.inventoryValue',
    accessorFn: row => row.statistics?.totalInventoryValue ?? 0,
    sortable: true,
    align: 'right',
    width: '140px',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-text-primary">
          {formatCurrency(row.statistics?.totalInventoryValue ?? 0)}
        </span>
      </div>
    ),
  },

  // 10. Status Badges
  {
    id: 'status',
    header: 'table.status',
    accessorKey: 'isActive',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5">
        <Badge variant={row.isActive ? 'active' : 'inactive'} dot size="sm">
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
        {row.isVerified && (
          <Badge variant="success" size="sm">
            ✓ Verified
          </Badge>
        )}
      </div>
    ),
  },

  // 11. Created Date
  {
    id: 'createdAt',
    header: 'table.createdAt',
    accessorKey: 'createdAt',
    sortable: true,
    width: '130px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
]
