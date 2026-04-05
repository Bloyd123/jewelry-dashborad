// FILE: src/components/customer/CustomerTable/CustomerTableColumns.tsx

import { Copy, Award } from 'lucide-react'
import { Avatar } from '@/components/ui/data-display/Avatar'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Customer } from '@/types/customer.types'

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
export const customerTableColumns: DataTableColumn<Customer>[] = [
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
 {
    id: 'address',
    header: 'customer.table.address',
    accessorKey: 'address',
    sortable: false,
    width: '180px',
    cell: ({ row }) => {
      const parts = [
        row.address?.street,
        row.address?.city,
        row.address?.state,
      ].filter(Boolean)

      if (parts.length === 0) {
        return <span className="text-xs text-text-tertiary">—</span>
      }

      return (
        <div className="flex flex-col">
          {row.address?.street && (
            <span className="text-sm text-text-primary truncate max-w-[160px]">
              {row.address.street}
            </span>
          )}
          {(row.address?.city || row.address?.state) && (
            <span className="text-xs text-text-tertiary">
              {[row.address?.city, row.address?.state].filter(Boolean).join(', ')}
            </span>
          )}
        </div>
      )
    },
  },
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

  {
    id: 'customerType',
    header: 'customer.table.customerType',
    accessorKey: 'customerType',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const customerType = row.customerType ?? 'regular'

      const typeVariants = {
        vip: 'vip',
        retail: 'retail',
        wholesale: 'wholesale',
        regular: 'default',
      } as const

      return (
        <Badge variant={typeVariants[customerType]}>
          {customerType.toUpperCase()}
        </Badge>
      )
    },
  },

  {
    id: 'membershipTier',
    header: 'customer.table.membershipTier',
    accessorKey: 'membershipTier',
    sortable: true,
    width: '140px',
    cell: ({ row }) => {
      const tier = row.membershipTier ?? 'standard'

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
        standard: '',
      }

      return (
        <Badge variant={tierVariants[tier]}>
          <span className="mr-1">{tierIcons[tier]}</span>
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </Badge>
      )
    },
  },

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
