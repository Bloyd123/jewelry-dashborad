
// FILE: src/components/payments/PaymentTable/PaymentTableColumns.tsx
// Payment Table Column Definitions

import {
  Copy,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Payment } from './PaymentTable.types'

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
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Format date only
 */
const formatDateOnly = (dateString: string): string => {
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


export const paymentTableColumns: DataTableColumn<Payment>[] = [
  // 1. Payment Number
  {
    id: 'paymentNumber',
    header: 'payment.table.paymentNumber',
    accessorKey: 'paymentNumber',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-text-primary">
          {row.paymentNumber}
        </span>
        <button
          onClick={e => {
            e.stopPropagation()
            copyToClipboard(row.paymentNumber)
          }}
          className="rounded p-1 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          aria-label="Copy payment number"
        >
          <Copy className="h-3 w-3" />
        </button>
      </div>
    ),
  },

  // 2. Payment Date
  {
    id: 'paymentDate',
    header: 'payment.table.paymentDate',
    accessorKey: 'paymentDate',
    sortable: true,
    width: '180px',
    cell: ({ row }) => (
      <span className="text-sm text-text-primary">
        {formatDate(row.paymentDate)}
      </span>
    ),
  },

  // 3. Transaction Type with Icon
  {
    id: 'transactionType',
    header: 'payment.table.transactionType',
    accessorKey: 'transactionType',
    sortable: true,
    width: '150px',
    cell: ({ row }) => {
      const isReceipt = row.transactionType === 'receipt'
      return (
        <div className="flex items-center gap-2">
          {isReceipt ? (
            <ArrowDownCircle className="h-4 w-4 text-status-success" />
          ) : (
            <ArrowUpCircle className="h-4 w-4 text-status-error" />
          )}
          <span
            className={`font-medium ${
              isReceipt ? 'text-status-success' : 'text-status-error'
            }`}
          >
            {isReceipt ? 'Money In' : 'Money Out'}
          </span>
        </div>
      )
    },
  },

  // 4. Party Name
  {
    id: 'partyName',
    header: 'payment.table.partyName',
    accessorKey: 'party.partyName',
    sortable: true,
    width: '180px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">
          {row.party.partyName}
        </span>
        <span className="text-xs text-text-tertiary">
          {row.party.partyType === 'customer' ? 'Customer' : 'Supplier'}
        </span>
      </div>
    ),
  },

  // 5. Amount with Direction Color
  {
    id: 'amount',
    header: 'payment.table.amount',
    accessorKey: 'amount',
    sortable: true,
    align: 'right',
    width: '150px',
    cell: ({ row }) => {
      const isReceipt = row.transactionType === 'receipt'
      return (
        <div className="text-right">
          <span
            className={`text-lg font-bold ${
              isReceipt ? 'text-status-success' : 'text-status-error'
            }`}
          >
            {isReceipt ? '+' : '-'} {formatCurrency(row.amount)}
          </span>
        </div>
      )
    },
  },

  // 6. Payment Mode Badge
  {
    id: 'paymentMode',
    header: 'payment.table.paymentMode',
    accessorKey: 'paymentMode',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const modeVariants: Record<string, any> = {
        cash: 'default',
        card: 'info',
        upi: 'success',
        cheque: 'warning',
        bank_transfer: 'info',
        wallet: 'retail',
        other: 'default',
      }

      const modeLabels: Record<string, string> = {
        cash: 'Cash',
        card: 'Card',
        upi: 'UPI',
        cheque: 'Cheque',
        bank_transfer: 'Bank',
        wallet: 'Wallet',
        other: 'Other',
      }

      return (
        <Badge variant={modeVariants[row.paymentMode]}>
          {modeLabels[row.paymentMode]}
        </Badge>
      )
    },
  },

  // 7. Payment Type
  {
    id: 'paymentType',
    header: 'payment.table.paymentType',
    accessorKey: 'paymentType',
    sortable: true,
    width: '140px',
    cell: ({ row }) => {
      const typeLabels: Record<string, string> = {
        sale_payment: 'Sale',
        purchase_payment: 'Purchase',
        scheme_payment: 'Scheme',
        advance_payment: 'Advance',
        refund: 'Refund',
        other: 'Other',
      }

      return (
        <span className="text-sm text-text-secondary">
          {typeLabels[row.paymentType]}
        </span>
      )
    },
  },

  // 8. Status Badge
  {
    id: 'status',
    header: 'payment.table.status',
    accessorKey: 'status',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const statusVariants: Record<string, any> = {
        pending: 'pending',
        completed: 'completed',
        failed: 'error',
        cancelled: 'inactive',
        refunded: 'warning',
      }

      const statusLabels: Record<string, string> = {
        pending: 'Pending',
        completed: 'Completed',
        failed: 'Failed',
        cancelled: 'Cancelled',
        refunded: 'Refunded',
      }

      return (
        <Badge variant={statusVariants[row.status]} dot>
          {statusLabels[row.status]}
        </Badge>
      )
    },
  },

  // 9. Reconciliation Status
  {
    id: 'reconciliation',
    header: 'payment.table.reconciliation',
    accessorKey: 'reconciliation.isReconciled',
    sortable: true,
    width: '140px',
    cell: ({ row }) => {
      const isReconciled = row.reconciliation.isReconciled
      return (
        <div className="flex items-center gap-2">
          {isReconciled ? (
            <CheckCircle2 className="h-4 w-4 text-status-success" />
          ) : (
            <AlertCircle className="h-4 w-4 text-status-warning" />
          )}
          <span
            className={`text-sm ${
              isReconciled ? 'text-status-success' : 'text-status-warning'
            }`}
          >
            {isReconciled ? 'Reconciled' : 'Pending'}
          </span>
        </div>
      )
    },
  },

  // 10. Reference Number
  {
    id: 'reference',
    header: 'payment.table.reference',
    accessorKey: 'reference.referenceNumber',
    sortable: true,
    width: '130px',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-text-secondary">
        {row.reference.referenceNumber || '-'}
      </span>
    ),
  },
]
