// FILE: src/components/features/SupplierTable/SupplierTableColumns.tsx


import { Copy, Award, Store, TrendingUp } from 'lucide-react'
import { Avatar } from '@/components/ui/data-display/Avatar'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Supplier } from './SupplierTable.types'


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
export const supplierTableColumns: DataTableColumn<Supplier>[] = [
  {
    id: 'supplierCode',
    header: 'suppliers.table.supplierCode',
    accessorKey: 'supplierCode',
    sortable: true,
    width: '150px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.businessName} size="sm" />
        <span className="font-medium text-text-primary">
          {row.supplierCode}
        </span>
      </div>
    ),
  },

  {
    id: 'businessName',
    header: 'suppliers.table.businessName',
    accessorKey: 'businessName',
    sortable: true,
    width: '220px',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar
          name={row.businessName}
          size="md"
          status={row.isActive ? 'online' : 'offline'}
        />
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {row.businessName}
          </span>
          <span className="text-xs text-text-tertiary">
            {row.contactPerson.firstName}
          </span>
        </div>
      </div>
    ),
  },

  {
    id: 'phone',
    header: 'suppliers.table.phone',
    accessorKey: 'contactPerson.phone',
    sortable: true,
    width: '150px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-text-primary">{row.contactPerson.phone}</span>
        <button
          onClick={e => {
            e.stopPropagation()
            copyToClipboard(row.contactPerson.phone)
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
    id: 'supplierType',
    header: 'suppliers.table.supplierType',
    accessorKey: 'supplierType',
    sortable: true,
    width: '140px',
    cell: ({ row }) => {
      const typeVariants = {
        manufacturer: 'info',
        wholesaler: 'default',
        distributor: 'warning',
        artisan: 'vip',
        importer: 'retail',
        other: 'default',
      } as const

      const typeIcons = {
        manufacturer: '🏭',
        wholesaler: '📦',
        distributor: '🚚',
        artisan: '🎨',
        importer: '✈️',
        other: '🏢',
      }

      return (
        <Badge variant={typeVariants[row.supplierType]}>
          <span className="mr-1">{typeIcons[row.supplierType]}</span>
          {row.supplierType.charAt(0).toUpperCase() + row.supplierType.slice(1)}
        </Badge>
      )
    },
  },
  {
    id: 'supplierCategory',
    header: 'suppliers.table.category',
    accessorKey: 'supplierCategory',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const categoryVariants = {
        gold: 'warning',
        silver: 'info',
        diamond: 'vip',
        platinum: 'retail',
        gemstone: 'active',
        pearls: 'default',
        making: 'wholesale',
        packaging: 'default',
        mixed: 'default',
      } as const

      return (
        <Badge variant={categoryVariants[row.supplierCategory]}>
          {row.supplierCategory.toUpperCase()}
        </Badge>
      )
    },
  },
  {
    id: 'totalPurchases',
    header: 'suppliers.table.totalPurchases',
    accessorKey: 'totalPurchases',
    sortable: true,
    align: 'right',
    width: '150px',
    cell: ({ row }) => (
      <div className="text-right">
        <div className="flex items-center justify-end gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-status-success" />
          <span className="font-semibold text-text-primary">
            {formatCurrency(row.totalPurchases)}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'totalDue',
    header: 'suppliers.table.totalDue',
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
    id: 'rating',
    header: 'suppliers.table.rating',
    accessorKey: 'rating',
    sortable: true,
    align: 'center',
    width: '120px',
    cell: ({ row }) => {
      if (!row.rating) {
        return (
          <div className="text-center">
            <span className="text-sm text-text-tertiary">N/A</span>
          </div>
        )
      }

      return (
        <div className="flex items-center justify-center gap-1">
          <Award className="text-warning h-4 w-4" />
          <span className="text-warning font-semibold">
            {row.rating.toFixed(1)}
          </span>
        </div>
      )
    },
  },
  {
    id: 'status',
    header: 'suppliers.table.status',
    accessorKey: 'isActive',
    sortable: true,
    width: '150px',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.isPreferred && (
          <Badge variant="vip" size="sm">
            Preferred
          </Badge>
        )}
        {row.isBlacklisted && (
          <Badge variant="error" size="sm">
            🚫 Blacklisted
          </Badge>
        )}
        {!row.isBlacklisted && (
          <Badge variant={row.isActive ? 'active' : 'inactive'} size="sm" dot>
            {row.isActive ? 'Active' : 'Inactive'}
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: 'paymentTerms',
    header: 'suppliers.table.paymentTerms',
    accessorKey: 'paymentTerms',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const termLabels = {
        immediate: 'Immediate',
        cod: 'COD',
        net15: 'Net 15',
        net30: 'Net 30',
        net45: 'Net 45',
        net60: 'Net 60',
        custom: 'Custom',
      }

      return (
        <Badge variant="default" size="sm">
          {termLabels[row.paymentTerms]}
        </Badge>
      )
    },
  },
  {
    id: 'location',
    header: 'suppliers.table.location',
    accessorKey: 'address.city',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Store className="h-4 w-4 text-text-tertiary" />
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">
            {row.address?.city || '-'}
          </span>
          {row.address?.state && (
            <span className="text-xs text-text-tertiary">
              {row.address.state}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    id: 'createdAt',
    header: 'suppliers.table.createdAt',
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
