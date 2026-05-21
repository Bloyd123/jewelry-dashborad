// FILE: src/components/scheme/SchemeTable/SchemeTableColumns.tsx

import { Badge }  from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Scheme } from '@/types/scheme.types'
import { Calendar, Users, TrendingUp } from 'lucide-react'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(dateString))

export const schemeTableColumns: DataTableColumn<Scheme>[] = [
  // ── Scheme Code ───────────────────────────
  {
    id:          'schemeCode',
    header:      'scheme.table.schemeCode',
    accessorKey: 'schemeCode',
    sortable:    true,
    width:       '140px',
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-text-primary">
        {row.schemeCode}
      </span>
    ),
  },

  // ── Scheme Name ───────────────────────────
  {
    id:          'schemeName',
    header:      'scheme.table.schemeName',
    accessorKey: 'schemeName',
    sortable:    true,
    width:       '220px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-text-primary">
          {row.schemeName}
        </span>
        {row.description && (
          <span className="mt-0.5 truncate text-xs text-text-tertiary max-w-[200px]">
            {row.description}
          </span>
        )}
      </div>
    ),
  },

  // ── Scheme Type ───────────────────────────
  {
    id:          'schemeType',
    header:      'scheme.table.schemeType',
    accessorKey: 'schemeType',
    sortable:    true,
    width:       '160px',
    cell: ({ row }) => {
      const typeVariants: Record<string, string> = {
        gold_saving:      'warning',
        installment:      'info',
        advance_booking:  'accent',
        festival_scheme:  'success',
        custom:           'default',
      }
      const typeLabels: Record<string, string> = {
        gold_saving:      'Gold Saving',
        installment:      'Installment',
        advance_booking:  'Advance Booking',
        festival_scheme:  'Festival',
        custom:           'Custom',
      }
      return (
        <Badge variant={typeVariants[row.schemeType] as any}>
          {typeLabels[row.schemeType] || row.schemeType}
        </Badge>
      )
    },
  },

  // ── Duration ─────────────────────────────
  {
    id:          'duration',
    header:      'scheme.table.duration',
    accessorKey: 'duration',
    sortable:    false,
    width:       '120px',
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-text-secondary">
        <Calendar className="h-3.5 w-3.5 text-text-tertiary" />
        <span>{row.duration.months}M</span>
        {row.duration.weeks > 0 && (
          <span className="text-text-tertiary">+ {row.duration.weeks}W</span>
        )}
      </div>
    ),
  },

  // ── Installment ───────────────────────────
  {
    id:          'installmentAmount',
    header:      'scheme.table.installmentAmount',
    accessorKey: 'installments',
    sortable:    true,
    width:       '160px',
    align:       'right',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="text-sm font-semibold text-text-primary">
          {formatCurrency(row.installments.installmentAmount)}
        </span>
        <p className="text-xs text-text-tertiary">
          × {row.installments.totalInstallments} {row.installments.frequency}
        </p>
      </div>
    ),
  },

  // ── Maturity Value ────────────────────────
  {
    id:          'totalMaturityValue',
    header:      'scheme.table.maturityValue',
    accessorKey: 'maturity',
    sortable:    true,
    width:       '160px',
    align:       'right',
    cell: ({ row }) => (
      <div className="text-right">
        <span className="text-sm font-semibold text-status-success">
          {formatCurrency(row.maturity.totalMaturityValue)}
        </span>
        {row.bonus.hasBonus && (
          <p className="text-xs text-text-tertiary">
            +{row.bonus.bonusValue}
            {row.bonus.bonusType === 'percentage' ? '%' : '₹'} bonus
          </p>
        )}
      </div>
    ),
  },

  // ── Enrollments ───────────────────────────
  {
    id:          'enrollments',
    header:      'scheme.table.enrollments',
    accessorKey: 'statistics',
    sortable:    false,
    width:       '130px',
    align:       'center',
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1.5">
        <Users className="h-3.5 w-3.5 text-text-tertiary" />
        <span className="text-sm font-medium text-text-primary">
          {row.statistics.activeEnrollments}
        </span>
        <span className="text-xs text-text-tertiary">
          / {row.statistics.totalEnrollments}
        </span>
      </div>
    ),
  },

  // ── Revenue ───────────────────────────────
  {
    id:          'totalRevenue',
    header:      'scheme.table.revenue',
    accessorKey: 'statistics',
    sortable:    false,
    width:       '140px',
    align:       'right',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <TrendingUp className="h-3.5 w-3.5 text-status-success" />
        <span className="text-sm font-semibold text-text-primary">
          {formatCurrency(row.statistics.totalRevenue)}
        </span>
      </div>
    ),
  },

  // ── Status ────────────────────────────────
  {
    id:          'status',
    header:      'scheme.table.status',
    accessorKey: 'status',
    sortable:    true,
    width:       '120px',
    cell: ({ row }) => {
      const statusVariants: Record<string, string> = {
        active:   'active',
        draft:    'default',
        paused:   'warning',
        expired:  'error',
        archived: 'inactive',
      }
      return (
        <Badge variant={statusVariants[row.status] as any} dot>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    },
  },

  // ── Approval ─────────────────────────────
  {
    id:          'approvalStatus',
    header:      'scheme.table.approval',
    accessorKey: 'approvalStatus',
    sortable:    true,
    width:       '120px',
    cell: ({ row }) => {
      const approvalVariants: Record<string, string> = {
        approved: 'success',
        pending:  'warning',
        rejected: 'error',
      }
      return (
        <Badge variant={approvalVariants[row.approvalStatus] as any}>
          {row.approvalStatus.charAt(0).toUpperCase() + row.approvalStatus.slice(1)}
        </Badge>
      )
    },
  },

  // ── Validity ─────────────────────────────
  {
    id:          'validity',
    header:      'scheme.table.validity',
    accessorKey: 'validity',
    sortable:    false,
    width:       '180px',
    cell: ({ row }) => (
      <div className="flex flex-col text-xs text-text-secondary">
        <span>{formatDate(row.validity.startDate)}</span>
        <span className="text-text-tertiary">→ {formatDate(row.validity.endDate)}</span>
      </div>
    ),
  },
]