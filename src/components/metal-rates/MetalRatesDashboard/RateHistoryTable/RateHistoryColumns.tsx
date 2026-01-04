// FILE: src/components/metal-rates/MetalRatesDashboard/RateHistoryTable/RateHistoryColumns.tsx
// Rate History Table Column Definitions

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { MetalRate } from '@/types/metalrate.types'

// HELPER FUNCTIONS

/**
 * Format currency in INR
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
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
 * Format change percentage
 */
const formatChangePercentage = (change: number): string => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

/**
 * Get trend icon
 */
const getTrendIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-status-success" />
  if (change < 0) return <TrendingDown className="h-4 w-4 text-status-error" />
  return <Minus className="h-4 w-4 text-text-tertiary" />
}

// COLUMN DEFINITIONS

export const rateHistoryColumns: DataTableColumn<MetalRate>[] = [
  // 1. Date
  {
    id: 'rateDate',
    header: 'metalRates.table.date',
    accessorKey: 'rateDate',
    sortable: true,
    width: '120px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">
          {formatDate(row.rateDate).split(' ')[0]}
        </span>
        <span className="text-xs text-text-tertiary">
          {formatDate(row.rateDate).split(' ').slice(1).join(' ')}
        </span>
      </div>
    ),
  },

  // 2. Gold 24K
  {
    id: 'gold24K',
    header: 'metalRates.table.gold24K',
    accessorKey: 'gold.gold24K.sellingRate',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-text-primary">
          {formatCurrency(row.gold.gold24K.sellingRate)}
        </span>
      </div>
    ),
  },

  // 3. Gold 22K
  {
    id: 'gold22K',
    header: 'metalRates.table.gold22K',
    accessorKey: 'gold.gold22K.sellingRate',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-text-primary">
          {formatCurrency(row.gold.gold22K.sellingRate)}
        </span>
      </div>
    ),
  },

  // 4. Silver 999
  {
    id: 'silver999',
    header: 'metalRates.table.silver999',
    accessorKey: 'silver.pure.sellingRate',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-text-primary">
          {formatCurrency(row.silver.pure.sellingRate)}
        </span>
      </div>
    ),
  },

  // 5. Platinum
  {
    id: 'platinum',
    header: 'metalRates.table.platinum',
    accessorKey: 'platinum.sellingRate',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-text-primary">
          {formatCurrency(row.platinum.sellingRate)}
        </span>
      </div>
    ),
  },

  // 6. Change (Gold)
  {
    id: 'change',
    header: 'metalRates.table.change',
    accessorKey: 'changes.goldChangePercentage',
    sortable: true,
    align: 'center',
    width: '120px',
    cell: ({ row }) => {
      const change = row.changes.goldChangePercentage

      return (
        <div className="flex items-center justify-center gap-2">
          {getTrendIcon(change)}
          <span
            className={`font-semibold ${
              change > 0
                ? 'text-status-success'
                : change < 0
                  ? 'text-status-error'
                  : 'text-text-tertiary'
            }`}
          >
            {formatChangePercentage(change)}
          </span>
        </div>
      )
    },
  },

  // 7. User (Rate Source)
  {
    id: 'user',
    header: 'metalRates.table.user',
    accessorKey: 'rateSource',
    sortable: true,
    width: '100px',
    cell: ({ row }) => {
      const sourceLabels: Record<string, string> = {
        manual: 'RK',
        market: 'MK',
        api: 'API',
        association: 'AS',
      }

      const sourceVariants: Record<string, 'default' | 'info' | 'warning'> = {
        manual: 'default',
        market: 'info',
        api: 'warning',
        association: 'info',
      }

      return (
        <Badge variant={sourceVariants[row.rateSource] || 'default'}>
          {sourceLabels[row.rateSource] || row.rateSource.toUpperCase()}
        </Badge>
      )
    },
  },
]
