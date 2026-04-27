// FILE: src/components/girviTransfer/GirviTransferTable/GirviTransferTableColumns.tsx

import { Badge }  from '@/components/ui/data-display/Badge/Badge'
import { ArrowRightLeft, Copy } from 'lucide-react'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { IGirviTransfer }  from '@/types/girviTransfer.types'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(date))

const getStatusVariant = (status: string) => {
  const map: Record<string, string> = {
    pending:   'warning',
    completed: 'success',
    returned:  'info',
    cancelled: 'error',
  }
  return map[status] ?? 'default'
}

const getTypeVariant = (type: string) => {
  const map: Record<string, string> = {
    outgoing: 'error',
    incoming: 'success',
    return:   'info',
  }
  return map[type] ?? 'default'
}

export const girviTransferTableColumns: DataTableColumn<IGirviTransfer>[] = [

  // 1. Transfer Number
  {
    id:          'transferNumber',
    header:      'girviTransfer.table.transferNumber',
    accessorKey: 'transferNumber',
    sortable:    true,
    width:       '160px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="h-4 w-4 text-accent" />
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{row.transferNumber}</span>
          <button
            onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(row.transferNumber) }}
            className="text-xs text-text-tertiary hover:text-accent"
          >
            <Copy className="inline h-3 w-3" /> Copy
          </button>
        </div>
      </div>
    ),
  },

  // 2. Transfer Type
  {
    id:          'transferType',
    header:      'girviTransfer.table.transferType',
    accessorKey: 'transferType',
    sortable:    true,
    width:       '120px',
    cell: ({ row }) => (
      <Badge variant={getTypeVariant(row.transferType) as any} size="sm">
        {row.transferType.toUpperCase()}
      </Badge>
    ),
  },

  // 3. From Party
  {
    id:          'fromParty',
    header:      'girviTransfer.table.fromParty',
    accessorKey: 'fromParty.name',
    sortable:    false,
    width:       '160px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">{row.fromParty.name}</span>
        {row.fromParty.phone && (
          <span className="text-xs text-text-tertiary">{row.fromParty.phone}</span>
        )}
      </div>
    ),
  },

  // 4. To Party
  {
    id:          'toParty',
    header:      'girviTransfer.table.toParty',
    accessorKey: 'toParty.name',
    sortable:    false,
    width:       '160px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">{row.toParty.name}</span>
        {row.toParty.phone && (
          <span className="text-xs text-text-tertiary">{row.toParty.phone}</span>
        )}
      </div>
    ),
  },

  // 5. Transfer Date
  {
    id:          'transferDate',
    header:      'girviTransfer.table.transferDate',
    accessorKey: 'transferDate',
    sortable:    true,
    width:       '130px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {formatDate(row.transferDate)}
      </span>
    ),
  },

  // 6. Party Principal
  {
    id:          'partyPrincipalAmount',
    header:      'girviTransfer.table.partyPrincipal',
    accessorKey: 'partyPrincipalAmount',
    sortable:    true,
    align:       'right',
    width:       '140px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-bold text-text-primary">
          {formatCurrency(row.partyPrincipalAmount)}
        </span>
        <span className="text-xs text-text-tertiary">
          {row.partyInterestRate}% / mo ({row.partyInterestType})
        </span>
      </div>
    ),
  },

  // 7. Transfer Amount
  {
    id:          'transferAmount',
    header:      'girviTransfer.table.transferAmount',
    accessorKey: 'transferAmount',
    sortable:    true,
    align:       'right',
    width:       '130px',
    cell: ({ row }) => (
      <span className="font-semibold text-text-primary">
        {formatCurrency(row.transferAmount)}
      </span>
    ),
  },

  // 8. Return Info
  {
    id:       'returnInfo',
    header:   'girviTransfer.table.returnInfo',
    sortable: false,
    width:    '140px',
    cell: ({ row }) => {
      if (row.returnDate) {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-status-success">✓ Returned</span>
            <span className="text-xs text-text-tertiary">
              {formatDate(row.returnDate)}
            </span>
            {row.partyInterestCharged !== undefined && (
              <span className="text-xs text-text-secondary">
                Int: {formatCurrency(row.partyInterestCharged)}
              </span>
            )}
          </div>
        )
      }
      return <span className="text-xs text-text-tertiary">-</span>
    },
  },

  // 9. Status
  {
    id:          'status',
    header:      'girviTransfer.table.status',
    accessorKey: 'status',
    sortable:    true,
    width:       '120px',
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.status) as any} dot size="sm">
        {row.status.toUpperCase()}
      </Badge>
    ),
  },
]