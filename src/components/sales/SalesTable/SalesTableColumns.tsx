//
// FILE: src/components/features/SalesTable/SalesTableColumns.tsx
// Sales Table Column Definitions
//

import { Copy, FileText, User, Package } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Sale } from '@/types/sale.types'

//
// HELPER FUNCTIONS
//

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

//
// COLUMN DEFINITIONS
//

export const salesTableColumns: DataTableColumn<Sale>[] = [
  // 1. Invoice Number
  {
    id: 'invoiceNumber',
    header: 'sales.table.invoiceNumber',
    accessorKey: 'invoiceNumber',
    sortable: true,
    width: '150px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-accent" />
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {row.invoiceNumber}
          </span>
          <button
            onClick={e => {
              e.stopPropagation()
              copyToClipboard(row.invoiceNumber)
            }}
            className="text-xs text-text-tertiary hover:text-accent"
          >
            <Copy className="inline h-3 w-3" /> Copy
          </button>
        </div>
      </div>
    ),
  },

  // 2. Customer Details
  {
    id: 'customer',
    header: 'sales.table.customer',
    accessorKey: 'customerDetails.customerName',
    sortable: true,
    width: '200px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-full">
          <User className="h-4 w-4 text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {row.customerDetails.customerName}
          </span>
          <span className="text-xs text-text-tertiary">
            {row.customerDetails.phone}
          </span>
        </div>
      </div>
    ),
  },

  // 3. Sale Date
  {
    id: 'saleDate',
    header: 'sales.table.saleDate',
    accessorKey: 'saleDate',
    sortable: true,
    width: '120px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {formatDate(row.saleDate)}
      </span>
    ),
  },

  // 4. Sale Type
  {
    id: 'saleType',
    header: 'sales.table.saleType',
    accessorKey: 'saleType',
    sortable: true,
    width: '120px',
    cell: ({ row }) => {
      const typeVariants: Record<string, any> = {
        retail: 'info',
        wholesale: 'accent',
        exchange: 'warning',
        order_fulfillment: 'default',
        repair_billing: 'error',
        estimate: 'default',
      }

      return (
        <Badge variant={typeVariants[row.saleType] || 'default'} size="sm">
          {row.saleType.toUpperCase().replace('_', ' ')}
        </Badge>
      )
    },
  },

  // 5. Items Count
  {
    id: 'itemsCount',
    header: 'sales.table.items',
    sortable: false,
    align: 'center',
    width: '80px',
    cell: ({ row }) => (
      <div className="flex flex-col items-center">
        <Package className="h-4 w-4 text-text-tertiary" />
        <span className="text-sm font-semibold text-text-primary">
          {row.items.length}
        </span>
      </div>
    ),
  },

  // 6. Total Amount
  {
    id: 'grandTotal',
    header: 'sales.table.totalAmount',
    accessorKey: 'financials.grandTotal',
    sortable: true,
    align: 'right',
    width: '140px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-bold text-text-primary">
          {formatCurrency(row.financials.grandTotal)}
        </span>
        {row.financials.totalDiscount > 0 && (
          <span className="text-xs text-status-success">
            Disc: {formatCurrency(row.financials.totalDiscount)}
          </span>
        )}
      </div>
    ),
  },

  // 7. Payment Status
  {
    id: 'paymentStatus',
    header: 'sales.table.paymentStatus',
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

      return (
        <div className="flex flex-col items-center gap-1">
          <Badge
            variant={statusVariants[row.payment.paymentStatus] || 'default'}
            dot
            size="sm"
          >
            {row.payment.paymentStatus.toUpperCase()}
          </Badge>
          {row.payment.dueAmount > 0 && (
            <span className="text-xs text-status-error">
              {formatCurrency(row.payment.dueAmount)} due
            </span>
          )}
        </div>
      )
    },
  },

  // 8. Sale Status
  {
    id: 'status',
    header: 'sales.table.status',
    accessorKey: 'status',
    sortable: true,
    width: '120px',
    cell: ({ row }) => {
      const statusVariants: Record<string, any> = {
        draft: 'default',
        pending: 'warning',
        confirmed: 'info',
        delivered: 'success',
        completed: 'success',
        cancelled: 'error',
        returned: 'error',
      }

      return (
        <Badge variant={statusVariants[row.status] || 'default'} dot size="sm">
          {row.status.toUpperCase()}
        </Badge>
      )
    },
  },

  // 9. Payment Mode
  {
    id: 'paymentMode',
    header: 'sales.table.paymentMode',
    accessorKey: 'payment.paymentMode',
    sortable: true,
    width: '110px',
    cell: ({ row }) => (
      <span className="text-sm capitalize text-text-secondary">
        {row.payment.paymentMode.replace('_', ' ')}
      </span>
    ),
  },

  // 10. Paid Amount
  {
    id: 'paidAmount',
    header: 'sales.table.paid',
    accessorKey: 'payment.paidAmount',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-semibold text-status-success">
          {formatCurrency(row.payment.paidAmount)}
        </span>
        {row.payment.paymentStatus !== 'paid' && (
          <span className="text-xs text-text-tertiary">
            of {formatCurrency(row.payment.totalAmount)}
          </span>
        )}
      </div>
    ),
  },

  // 11. Old Gold Exchange
  {
    id: 'oldGold',
    header: 'sales.table.oldGold',
    sortable: false,
    width: '110px',
    cell: ({ row }) => {
      if (!row.oldGoldExchange.hasExchange) {
        return <span className="text-xs text-text-tertiary">-</span>
      }
      return (
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-accent">
            {formatCurrency(row.oldGoldExchange.totalValue)}
          </span>
          <span className="text-xs text-text-tertiary">Exchanged</span>
        </div>
      )
    },
  },

  // 12. Delivery Status
  {
    id: 'delivery',
    header: 'sales.table.delivery',
    sortable: false,
    width: '120px',
    cell: ({ row }) => {
      if (row.delivery?.deliveredAt) {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-status-success">✓ Delivered</span>
            <span className="text-xs text-text-tertiary">
              {formatDate(row.delivery.deliveredAt)}
            </span>
          </div>
        )
      }
      if (row.delivery?.deliveryDate) {
        return (
          <div className="flex flex-col">
            <span className="text-xs text-text-secondary">Scheduled</span>
            <span className="text-xs text-text-tertiary">
              {formatDate(row.delivery.deliveryDate)}
            </span>
          </div>
        )
      }
      if (row.status === 'completed') {
        return <span className="text-xs text-status-success">Immediate</span>
      }
      return <span className="text-xs text-text-tertiary">Pending</span>
    },
  },

  // 13. GST Amount
  {
    id: 'gstAmount',
    header: 'sales.table.gst',
    accessorKey: 'financials.totalGST',
    sortable: true,
    align: 'right',
    width: '100px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {formatCurrency(row.financials.totalGST)}
      </span>
    ),
  },
]
