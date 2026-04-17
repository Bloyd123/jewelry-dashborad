// FILE: src/components/girvi/GirviShopPayments/GirviShopPaymentsColumns.tsx
 
import { Copy } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { GirviPayment } from '@/types/girvi.types'
 
const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
 
const formatDate = (d: string) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
 
const TYPE_VARIANTS: Record<string, any> = {
  interest_only:      'info',
  principal_partial:  'warning',
  principal_full:     'success',
  interest_principal: 'retail',
  release_payment:    'completed',
}
 
const TYPE_LABELS: Record<string, string> = {
  interest_only:      'Interest',
  principal_partial:  'Part. Principal',
  principal_full:     'Full Principal',
  interest_principal: 'Int + Principal',
  release_payment:    'Release',
}
 
const MODE_LABELS: Record<string, string> = {
  cash:          ' Cash',
  upi:           'UPI',
  bank_transfer: 'Bank',
  cheque:        'Cheque',
}
 
export const girviShopPaymentsColumns: DataTableColumn<GirviPayment>[] = [
  {
    id: 'receiptNumber',
    header: 'girviPayment.table.receipt',
    accessorKey: 'receiptNumber',
    sortable: true,
    width: '150px',
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-sm font-semibold text-text-primary">
          {row.receiptNumber}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(row.receiptNumber) }}
          className="rounded p-0.5 text-text-tertiary hover:text-text-primary"
        >
          <Copy className="h-3 w-3" />
        </button>
      </div>
    ),
  },
  {
    id: 'paymentDate',
    header: 'girviPayment.table.date',
    accessorKey: 'paymentDate',
    sortable: true,
    width: '120px',
    cell: ({ row }) => (
      <span className="text-sm text-text-primary">{formatDate(row.paymentDate)}</span>
    ),
  },
  {
    id: 'girvi',
    header: 'girviPayment.table.girvi',
    accessorKey: 'girviId',
    sortable: false,
    width: '140px',
    cell: ({ row }) => {
      const girvi = typeof row.girviId === 'object' ? (row.girviId as any) : null
      return (
        <span className="font-mono text-sm font-medium text-text-primary">
          {girvi?.girviNumber ?? String(row.girviId)}
        </span>
      )
    },
  },
  {
    id: 'customer',
    header: 'girviPayment.table.customer',
    accessorKey: 'customerId',
    sortable: false,
    width: '170px',
    cell: ({ row }) => {
      const c = typeof row.customerId === 'object' ? (row.customerId as any) : null
      return c ? (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {c.firstName} {c.lastName}
          </p>
          <p className="text-xs text-text-tertiary">{c.phone}</p>
        </div>
      ) : (
        <span className="text-sm text-text-tertiary">{String(row.customerId)}</span>
      )
    },
  },
  {
    id: 'paymentType',
    header: 'girviPayment.table.type',
    accessorKey: 'paymentType',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <Badge variant={TYPE_VARIANTS[row.paymentType]}>
        {TYPE_LABELS[row.paymentType]}
      </Badge>
    ),
  },
  {
    id: 'interestReceived',
    header: 'girviPayment.table.interest',
    accessorKey: 'interestReceived',
    sortable: true,
    align: 'right',
    width: '120px',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-status-success">
        {formatCurrency(row.interestReceived)}
      </span>
    ),
  },
  {
    id: 'principalReceived',
    header: 'girviPayment.table.principal',
    accessorKey: 'principalReceived',
    sortable: true,
    align: 'right',
    width: '120px',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-accent">
        {formatCurrency(row.principalReceived)}
      </span>
    ),
  },
  {
    id: 'netAmountReceived',
    header: 'girviPayment.table.net',
    accessorKey: 'netAmountReceived',
    sortable: true,
    align: 'right',
    width: '130px',
    cell: ({ row }) => (
      <span className="text-base font-bold text-text-primary">
        {formatCurrency(row.netAmountReceived)}
      </span>
    ),
  },
  {
    id: 'paymentMode',
    header: 'girviPayment.table.mode',
    accessorKey: 'paymentMode',
    sortable: true,
    width: '110px',
    cell: ({ row }) => (
      <span className="text-sm text-text-secondary">
        {MODE_LABELS[row.paymentMode]}
      </span>
    ),
  },
]