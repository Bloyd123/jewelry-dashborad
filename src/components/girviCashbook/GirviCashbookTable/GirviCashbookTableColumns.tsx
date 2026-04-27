// FILE: src/components/girviCashbook/GirviCashbookTable/GirviCashbookTableColumns.tsx

import { Badge }  from '@/components/ui/data-display/Badge/Badge'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import type { DataTableColumn }       from '@/components/ui/data-display/DataTable'
import type { IGirviCashbookEntry }   from '@/types/girviCashbook.types'
import { ENTRY_TYPE_LABELS }          from '@/validators/girviCashbookValidation'


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

const getEntryTypeVariant = (type: string) => {
  const map: Record<string, string> = {
    girvi_jama:          'info',
    interest_received:   'success',
    principal_received:  'success',
    release_received:    'success',
    discount_given:      'warning',
    transfer_out:        'error',
    transfer_in:         'success',
    transfer_return_in:  'warning',
    transfer_return_out: 'info',
  }
  return map[type] ?? 'default'
}

const getPaymentModeLabel = (mode: string) => {
  const map: Record<string, string> = {
    cash:          'Cash',
    upi:           'UPI',
    bank_transfer: 'Bank Transfer',
    cheque:        'Cheque',
  }
  return map[mode] ?? mode
}


export const girviCashbookTableColumns: DataTableColumn<IGirviCashbookEntry>[] = [

  {
    id:          'entryNumber',
    header:      'girviCashbook.table.entryNumber',
    accessorKey: 'entryNumber',
    sortable:    true,
    width:       '160px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">
          {row.entryNumber}
        </span>
        <span className="text-xs text-text-tertiary">
          {formatDate(row.entryDate)}
        </span>
      </div>
    ),
  },

  {
    id:          'entryType',
    header:      'girviCashbook.table.entryType',
    accessorKey: 'entryType',
    sortable:    true,
    width:       '170px',
    cell: ({ row }) => (
      <Badge
        variant={getEntryTypeVariant(row.entryType) as any}
        size="sm"
      >
        {ENTRY_TYPE_LABELS[row.entryType] ?? row.entryType}
      </Badge>
    ),
  },

  {
    id:          'flowType',
    header:      'girviCashbook.table.flowType',
    accessorKey: 'flowType',
    sortable:    true,
    align:       'center',
    width:       '100px',
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        {row.flowType === 'inflow' ? (
          <ArrowUpCircle className="h-4 w-4 text-status-success" />
        ) : (
          <ArrowDownCircle className="h-4 w-4 text-status-error" />
        )}
        <span className={`text-xs font-medium capitalize ${
          row.flowType === 'inflow'
            ? 'text-status-success'
            : 'text-status-error'
        }`}>
          {row.flowType}
        </span>
      </div>
    ),
  },

  {
    id:          'amount',
    header:      'girviCashbook.table.amount',
    accessorKey: 'amount',
    sortable:    true,
    align:       'right',
    width:       '140px',
    cell: ({ row }) => (
      <span className={`text-base font-bold ${
        row.flowType === 'inflow'
          ? 'text-status-success'
          : 'text-status-error'
      }`}>
        {row.flowType === 'inflow' ? '+' : '-'}
        {formatCurrency(row.amount)}
      </span>
    ),
  },

  {
    id:          'paymentMode',
    header:      'girviCashbook.table.paymentMode',
    accessorKey: 'paymentMode',
    sortable:    false,
    width:       '120px',
    cell: ({ row }) => (
      <Badge variant="outline" size="sm">
        {getPaymentModeLabel(row.paymentMode)}
      </Badge>
    ),
  },

  {
    id:       'girviCustomer',
    header:   'girviCashbook.table.girviCustomer',
    sortable: false,
    width:    '180px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        {row.girviNumber && (
          <span className="text-sm font-medium text-accent">
            {row.girviNumber}
          </span>
        )}
        {row.customerName && (
          <span className="text-xs text-text-secondary">
            {row.customerName}
          </span>
        )}
        {row.customerPhone && (
          <span className="text-xs text-text-tertiary">
            {row.customerPhone}
          </span>
        )}
        {!row.girviNumber && !row.customerName && (
          <span className="text-xs text-text-tertiary">-</span>
        )}
      </div>
    ),
  },

  {
    id:       'breakdown',
    header:   'girviCashbook.table.breakdown',
    sortable: false,
    width:    '160px',
    cell: ({ row }) => {
      const b = row.breakdown
      if (!b) return <span className="text-xs text-text-tertiary">-</span>
      return (
        <div className="flex flex-col gap-0.5 text-xs text-text-secondary">
          {b.principalAmount > 0 && (
            <span>Principal: {formatCurrency(b.principalAmount)}</span>
          )}
          {b.interestAmount > 0 && (
            <span>Interest: {formatCurrency(b.interestAmount)}</span>
          )}
          {b.discountAmount > 0 && (
            <span>Discount: {formatCurrency(b.discountAmount)}</span>
          )}
        </div>
      )
    },
  },

  {
    id:       'balance',
    header:   'girviCashbook.table.balance',
    sortable: false,
    align:    'right',
    width:    '150px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="text-xs text-text-tertiary">
          Op: {formatCurrency(row.openingBalance)}
        </span>
        <span className="font-semibold text-text-primary">
          Cl: {formatCurrency(row.closingBalance)}
        </span>
      </div>
    ),
  },

  // 9. Remarks
  {
    id:          'remarks',
    header:      'girviCashbook.table.remarks',
    accessorKey: 'remarks',
    sortable:    false,
    width:       '160px',
    cell: ({ row }) => (
      <span className="text-xs text-text-secondary">
        {row.remarks || '-'}
      </span>
    ),
  },
]