// FILE: src/components/girvi/GirviTable/GirviTableColumns.tsx
import { Copy, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Badge }         from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Girvi as GirviType } from '@/types/girvi.types'
import { GIRVI_STATUS_LABELS, GIRVI_ITEM_TYPE_LABELS } from '@/types/girvi.types'
 
const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
 
const formatDate = (d: string) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d))
 
const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)
 
const STATUS_VARIANTS: Record<string, any> = {
  active:           'success',
  released:         'completed',
  transferred:      'info',
  partial_released: 'warning',
  overdue:          'error',
  auctioned:        'inactive',
}
 
export const girviTableColumns: DataTableColumn<GirviType>[] = [
  {
    id: 'girviNumber',
    header: 'girvi.table.girviNumber',
    accessorKey: 'girviNumber',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-text-primary">{row.girviNumber}</span>
        <button
          onClick={e => { e.stopPropagation(); copyToClipboard(row.girviNumber) }}
          className="rounded p-1 text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
        >
          <Copy className="h-3 w-3" />
        </button>
      </div>
    ),
  },
  {
    id: 'girviDate',
    header: 'girvi.table.girviDate',
    accessorKey: 'girviDate',
    sortable: true,
    width: '130px',
    cell: ({ row }) => <span className="text-sm text-text-primary">{formatDate(row.girviDate)}</span>,
  },
  {
    id: 'customer',
    header: 'girvi.table.customer',
    accessorKey: 'customerId',
    sortable: true,
    width: '180px',
    cell: ({ row }) => {
      const c = typeof row.customerId === 'object' ? row.customerId as any : null
      return (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {c ? `${c.firstName} ${c.lastName}` : String(row.customerId)}
          </span>
          {c?.phone && <span className="text-xs text-text-tertiary">📱 {c.phone}</span>}
        </div>
      )
    },
  },
  {
    id: 'items',
    header: 'girvi.table.items',
    accessorKey: 'items',
    sortable: false,
    width: '130px',
    cell: ({ row }) => {
      const types = [...new Set(row.items.map(i => i.itemType))]
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-text-primary">
            {row.items.length} item{row.items.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-text-tertiary">
            {types.map(t => GIRVI_ITEM_TYPE_LABELS[t]).join(', ')}
          </span>
          <span className="text-xs text-text-tertiary">{row.totalNetWeight.toFixed(2)}g net</span>
        </div>
      )
    },
  },
  {
    id: 'principalAmount',
    header: 'girvi.table.principal',
    accessorKey: 'principalAmount',
    sortable: true,
    align: 'right',
    width: '140px',
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-bold text-text-primary">{formatCurrency(row.principalAmount)}</p>
        <p className="text-xs text-text-tertiary">{row.interestRate}% / mo</p>
      </div>
    ),
  },
  {
    id: 'totalAmountDue',
    header: 'girvi.table.amountDue',
    accessorKey: 'totalAmountDue',
    sortable: true,
    align: 'right',
    width: '140px',
    cell: ({ row }) => (
      <div className="text-right">
        <p className={`font-bold ${row.totalAmountDue > 0 ? 'text-status-error' : 'text-status-success'}`}>
          {formatCurrency(row.totalAmountDue)}
        </p>
        {row.accruedInterest > 0 && (
          <p className="text-xs text-text-tertiary">
            Interest: {formatCurrency(row.accruedInterest)}
          </p>
        )}
      </div>
    ),
  },
  {
    id: 'dueDate',
    header: 'girvi.table.dueDate',
    accessorKey: 'dueDate',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      if (!row.dueDate) return <span className="text-sm text-text-tertiary">—</span>
      const isOverdue = new Date(row.dueDate) < new Date() && row.status === 'active'
      return (
        <div className="flex items-center gap-1.5">
          {isOverdue
            ? <AlertCircle className="h-4 w-4 text-status-error" />
            : <Clock className="h-4 w-4 text-text-tertiary" />
          }
          <span className={`text-sm ${isOverdue ? 'font-semibold text-status-error' : 'text-text-primary'}`}>
            {formatDate(row.dueDate)}
          </span>
        </div>
      )
    },
  },
  {
    id: 'status',
    header: 'girvi.table.status',
    accessorKey: 'status',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANTS[row.status]} dot>
        {GIRVI_STATUS_LABELS[row.status]}
      </Badge>
    ),
  },
]
 