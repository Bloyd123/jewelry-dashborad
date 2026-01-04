// FILE: src/components/customer/CustomerTable/CustomerTableColumns.tsx
// Customer Table Column Definitions

import { Copy, Award } from 'lucide-react'
import { Avatar } from '@/components/ui/data-display/Avatar'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Customer } from './CustomerTable.types'

// HELPER FUNCTIONS

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
 * Format date
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Copy to clipboard
 */
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// COLUMN DEFINITIONS

export const customerTableColumns: DataTableColumn<Customer>[] = [
  // 1. Customer Code with Avatar Initial
  {
    id: 'customerCode',
    header: 'customer.table.customerCode',
    accessorKey: 'customerCode',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.fullName} size="sm" />
        <span className="font-medium text-text-primary">
          {row.customerCode}
        </span>
      </div>
    ),
  },

  // 2. Full Name with Avatar
  {
    id: 'fullName',
    header: 'customer.table.fullName',
    accessorKey: 'fullName',
    sortable: true,
    width: '200px',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar
          name={row.fullName}
          size="md"
          status={row.isActive ? 'online' : 'offline'}
        />
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{row.fullName}</span>
          <span className="text-xs text-text-tertiary">{row.email}</span>
        </div>
      </div>
    ),
  },

  // 3. Phone with Copy Button
  {
    id: 'phone',
    header: 'customer.table.phone',
    accessorKey: 'phone',
    sortable: true,
    width: '150px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-text-primary">{row.phone}</span>
        <button
          onClick={e => {
            e.stopPropagation()
            copyToClipboard(row.phone)
          }}
          className="rounded p-1 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          aria-label="Copy phone number"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    ),
  },

  // 4. Customer Type Badge
  {
    id: 'customerType',
    header: 'customer.table.customerType',
    accessorKey: 'customerType',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const typeVariants = {
        vip: 'vip',
        retail: 'retail',
        wholesale: 'wholesale',
        regular: 'default',
      } as const

      return (
        <Badge variant={typeVariants[row.customerType]}>
          {row.customerType.toUpperCase()}
        </Badge>
      )
    },
  },

  // 5. Membership Tier Badge
  {
    id: 'membershipTier',
    header: 'customer.table.membershipTier',
    accessorKey: 'membershipTier',
    sortable: true,
    width: '140px',
    cell: ({ row }) => {
      const tierVariants = {
        platinum: 'vip',
        gold: 'warning',
        silver: 'info',
        standard: 'default',
      } as const

      const tierIcons = {
        platinum: '💎',
        gold: '🥇',
        silver: '🥈',
        standard: '⭐',
      }

      return (
        <Badge variant={tierVariants[row.membershipTier]}>
          <span className="mr-1">{tierIcons[row.membershipTier]}</span>
          {row.membershipTier.charAt(0).toUpperCase() +
            row.membershipTier.slice(1)}
        </Badge>
      )
    },
  },

  // 6. Total Purchases (Formatted Currency)
  {
    id: 'totalPurchases',
    header: 'customer.table.totalPurchases',
    accessorKey: 'totalPurchases',
    sortable: true,
    align: 'right',
    width: '150px',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-text-primary">
          {formatCurrency(row.totalPurchases)}
        </span>
      </div>
    ),
  },

  // 7. Total Due (Formatted Currency with Color)
  {
    id: 'totalDue',
    header: 'customer.table.totalDue',
    accessorKey: 'totalDue',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => {
      const hasDue = row.totalDue > 0

      return (
        <div className="text-right">
          <span
            className={`font-semibold ${
              hasDue ? 'text-status-error' : 'text-status-success'
            }`}
          >
            {formatCurrency(row.totalDue)}
          </span>
        </div>
      )
    },
  },

  // 8. Loyalty Points with Icon
  {
    id: 'loyaltyPoints',
    header: 'customer.table.loyaltyPoints',
    accessorKey: 'loyaltyPoints',
    sortable: true,
    align: 'center',
    width: '140px',
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Award className="h-4 w-4 text-accent" />
        <span className="font-semibold text-accent">{row.loyaltyPoints}</span>
      </div>
    ),
  },

  // 9. Active Status Badge with Dot
  {
    id: 'isActive',
    header: 'customer.table.status',
    accessorKey: 'isActive',
    sortable: true,
    width: '120px',
    cell: ({ row }) => (
      <Badge variant={row.isActive ? 'active' : 'inactive'} dot>
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },

  // 10. Created Date
  {
    id: 'createdAt',
    header: 'customer.table.createdAt',
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
