// ============================================================================
// FILE: src/components/features/PurchaseTable/PurchaseTableColumns.tsx
// Purchase Table Column Definitions
// ============================================================================

import { Copy, FileText, User } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { IPurchase } from '@/types/purchase.types'

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
 * Format date
 */
const formatDate = (dateString: string | Date): string => {
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

// ============================================================================
// COLUMN DEFINITIONS
// ============================================================================

export const purchaseTableColumns: DataTableColumn<IPurchase>[] = [
  // 1. Purchase Number with Icon
  {
    id: 'purchaseNumber',
    header: 'table.purchaseNumber',
    accessorKey: 'purchaseNumber',
    sortable: true,
    width: '160px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-accent" />
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {row.purchaseNumber}
          </span>
          <button
            onClick={e => {
              e.stopPropagation()
              copyToClipboard(row.purchaseNumber)
            }}
            className="text-xs text-text-tertiary hover:text-accent"
          >
            <Copy className="inline h-3 w-3" /> Copy
          </button>
        </div>
      </div>
    ),
  },

  // 2. Supplier Details
  {
    id: 'supplier',
    header: 'table.supplier',
    accessorKey: 'supplierDetails.supplierName',
    sortable: true,
    width: '200px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
          <User className="h-4 w-4 text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {row.supplierDetails.supplierName}
          </span>
          <span className="text-xs text-text-tertiary">
            {row.supplierDetails.supplierCode}
          </span>
        </div>
      </div>
    ),
  },

  // 3. Purchase Date
  {
    id: 'purchaseDate',
    header: 'table.purchaseDate',
    accessorKey: 'purchaseDate',
    sortable: true,
    width: '130px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {formatDate(row.purchaseDate)}
      </span>
    ),
  },

  // 4. Purchase Type
  {
    id: 'purchaseType',
    header: 'table.purchaseType',
    accessorKey: 'purchaseType',
    sortable: true,
    width: '140px',
    cell: ({ row }) => {
      const typeVariants: Record<string, any> = {
        new_stock: 'info',
        old_gold: 'warning',
        exchange: 'accent',
        consignment: 'default',
        repair_return: 'error',
        sample: 'default',
      }

      const typeLabels: Record<string, string> = {
        new_stock: 'New Stock',
        old_gold: 'Old Gold',
        exchange: 'Exchange',
        consignment: 'Consignment',
        repair_return: 'Repair Return',
        sample: 'Sample',
      }

      return (
        <Badge variant={typeVariants[row.purchaseType] || 'default'} size="sm">
          {typeLabels[row.purchaseType] || row.purchaseType}
        </Badge>
      )
    },
  },

  // 5. Items Count
  {
    id: 'itemsCount',
    header: 'table.items',
    accessorKey: 'items',
    sortable: false,
    align: 'center',
    width: '80px',
    cell: ({ row }) => (
      <div className="flex flex-col items-center">
        <span className="font-semibold text-text-primary">
          {row.items.length}
        </span>
        <span className="text-xs text-text-tertiary">items</span>
      </div>
    ),
  },

  // 6. Total Amount
  {
    id: 'grandTotal',
    header: 'table.totalAmount',
    accessorKey: 'financials.grandTotal',
    sortable: true,
    align: 'right',
    width: '140px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-bold text-text-primary">
          {formatCurrency(row.financials.grandTotal)}
        </span>
        {row.financials.totalGst > 0 && (
          <span className="text-xs text-text-tertiary">
            GST: {formatCurrency(row.financials.totalGst)}
          </span>
        )}
      </div>
    ),
  },

  // 7. Payment Status
  {
    id: 'paymentStatus',
    header: 'table.paymentStatus',
    accessorKey: 'payment.paymentStatus',
    sortable: true,
    align: 'center',
    width: '140px',
    cell: ({ row }) => {
      const statusVariants: Record<string, any> = {
        paid: 'success',
        partial: 'warning',
        unpaid: 'error',
        overdue: 'error',
      }

      const statusLabels: Record<string, string> = {
        paid: 'PAID',
        partial: 'PARTIAL',
        unpaid: 'UNPAID',
        overdue: 'OVERDUE',
      }

      return (
        <div className="flex flex-col items-center gap-1">
          <Badge
            variant={statusVariants[row.payment.paymentStatus] || 'default'}
            dot
            size="sm"
          >
            {statusLabels[row.payment.paymentStatus]}
          </Badge>
          {row.payment.paymentStatus === 'partial' && (
            <span className="text-xs text-text-tertiary">
              {formatCurrency(row.payment.dueAmount)} due
            </span>
          )}
        </div>
      )
    },
  },

  // 8. Purchase Status
  {
    id: 'status',
    header: 'table.status',
    accessorKey: 'status',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const statusVariants: Record<string, any> = {
        draft: 'default',
        pending: 'warning',
        ordered: 'info',
        received: 'success',
        partial_received: 'warning',
        completed: 'success',
        cancelled: 'error',
        returned: 'error',
      }

      const statusLabels: Record<string, string> = {
        draft: 'DRAFT',
        pending: 'PENDING',
        ordered: 'ORDERED',
        received: 'RECEIVED',
        partial_received: 'PARTIAL',
        completed: 'COMPLETED',
        cancelled: 'CANCELLED',
        returned: 'RETURNED',
      }

      return (
        <Badge
          variant={statusVariants[row.status] || 'default'}
          dot
          size="sm"
        >
          {statusLabels[row.status]}
        </Badge>
      )
    },
  },

  // 9. Approval Status
  {
    id: 'approvalStatus',
    header: 'table.approval',
    accessorKey: 'approvalStatus',
    sortable: true,
    width: '120px',
    cell: ({ row }) => {
      const approvalVariants: Record<string, any> = {
        pending: 'warning',
        approved: 'success',
        rejected: 'error',
      }

      const approvalLabels: Record<string, string> = {
        pending: 'PENDING',
        approved: 'APPROVED',
        rejected: 'REJECTED',
      }

      return (
        <Badge
          variant={approvalVariants[row.approvalStatus] || 'default'}
          size="sm"
        >
          {approvalLabels[row.approvalStatus]}
        </Badge>
      )
    },
  },

  // 10. Paid/Due Amount
  {
    id: 'paidAmount',
    header: 'table.paid',
    accessorKey: 'payment.paidAmount',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-semibold text-status-success">
          {formatCurrency(row.payment.paidAmount)}
        </span>
        {row.payment.dueAmount > 0 && (
          <span className="text-xs text-status-error">
            Due: {formatCurrency(row.payment.dueAmount)}
          </span>
        )}
      </div>
    ),
  },

  // 11. Delivery Status
  {
    id: 'delivery',
    header: 'table.delivery',
    sortable: false,
    width: '120px',
    cell: ({ row }) => {
      if (row.delivery?.receivedDate) {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-status-success">✓ Received</span>
            <span className="text-xs text-text-tertiary">
              {formatDate(row.delivery.receivedDate)}
            </span>
          </div>
        )
      }
      if (row.delivery?.expectedDate) {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-text-secondary">Expected</span>
            <span className="text-xs text-text-tertiary">
              {formatDate(row.delivery.expectedDate)}
            </span>
          </div>
        )
      }
      return <span className="text-xs text-text-tertiary">-</span>
    },
  },
]