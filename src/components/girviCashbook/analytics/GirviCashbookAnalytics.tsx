// FILE: src/components/girviCashbook/analytics/GirviCashbookAnalytics.tsx

import * as React         from 'react'
import { useTranslation } from 'react-i18next'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Percent,
  Tag,
  AlertCircle,
  Users,
  Calendar,
  BarChart2,
  PieChart as PieChartIcon,
  RefreshCw,
} from 'lucide-react'
import {
  StatCard,
  StatCardGrid,
  StatCardSkeleton,
} from '@/components/ui/data-display/StatCard'
import { AreaChart, BarChart }  from '@/components/ui/charts'
import { DonutChart }           from '@/components/ui/charts/DonutChart'
import { DataTable }            from '@/components/ui/data-display/DataTable'
import { Separator }            from '@/components/ui/layout/Separator'
import { cn }                   from '@/lib/utils'
import type { GirviCashbookAnalyticsProps } from './GirviCashbookAnalytics.types'

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style:                'currency',
    currency:             'INR',
    maximumFractionDigits: 0,
  }).format(value)

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-IN').format(value)

const MONTH_NAMES = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
]

const formatMonthLabel = (label: string): string => {
  // label = "2026-4" or "2026-04"
  const parts = label.split('-')
  if (parts.length === 2) {
    const monthIndex = parseInt(parts[1], 10) - 1
    return `${MONTH_NAMES[monthIndex] ?? label} ${parts[0]}`
  }
  return label
}

// ─── Entry Type Label Map ─────────────────────────────────────────────────────

const ENTRY_TYPE_LABELS: Record<string, string> = {
  girvi_jama:           'Girvi Jama',
  interest_received:    'Interest',
  principal_received:   'Principal',
  release_received:     'Release',
  discount_given:       'Discount',
  transfer_out:         'Transfer Out',
  transfer_in:          'Transfer In',
  transfer_return_in:   'Return In',
  transfer_return_out:  'Return Out',
}

const PAYMENT_MODE_LABELS: Record<string, string> = {
  cash:          'Cash',
  upi:           'UPI',
  bank_transfer: 'Bank Transfer',
  cheque:        'Cheque',
}

// ─── Component ────────────────────────────────────────────────────────────────

export const GirviCashbookAnalytics: React.FC<GirviCashbookAnalyticsProps> = ({
  statistics,
  loading = false,
  onRefresh,
  className,
}) => {
  const { t } = useTranslation()

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            {t('girviCashbook.analytics.title', 'Cashbook Analytics')}
          </h2>
        </div>
        <StatCardGrid columns={4} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} size="md" showIcon showTrend />
          ))}
        </StatCardGrid>
      </div>
    )
  }

  // ── No Data ────────────────────────────────────────────────────────────────
  if (!statistics) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            {t('girviCashbook.analytics.title', 'Cashbook Analytics')}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-text-tertiary" />
          <p className="text-text-secondary">
            {t('girviCashbook.analytics.noData', 'No analytics data available')}
          </p>
        </div>
      </div>
    )
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const isBalancePositive = statistics.currentBalance >= 0

  // Normalize monthly trend labels
  const monthlyData = (statistics.monthlyTrendData || []).map(d => ({
    ...d,
    month: formatMonthLabel(d.month),
  }))

  // Normalize entry type labels for donut
  const entryTypeData = (statistics.segmentationData?.byEntryType || []).map(d => ({
    ...d,
    name: ENTRY_TYPE_LABELS[d.name] ?? d.name,
  }))

  const paymentModeData = (statistics.segmentationData?.byPaymentMode || []).map(d => ({
    ...d,
    name: PAYMENT_MODE_LABELS[d.name] ?? d.name,
  }))

  return (
    <div className={cn('space-y-6', className)}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {t('girviCashbook.analytics.title', 'Cashbook Analytics')}
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            {t('girviCashbook.analytics.subtitle', 'Complete overview of all cash flows')}
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent/90"
          >
            <RefreshCw className="h-4 w-4" />
            {t('common.refresh', 'Refresh')}
          </button>
        )}
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <StatCardGrid columns={4} gap="md">

        <StatCard
          title={t('girviCashbook.analytics.currentBalance', 'Current Balance')}
          value={formatCurrency(statistics.currentBalance)}
          icon={Wallet}
          variant={isBalancePositive ? 'success' : 'error'}
          size="md"
          subtitle={isBalancePositive
            ? t('girviCashbook.analytics.balancePositive', 'Cash surplus')
            : t('girviCashbook.analytics.balanceNegative', 'Cash given out')}
          trend={statistics.trends?.currentBalance ? {
            value:     statistics.trends.currentBalance.value,
            direction: statistics.trends.currentBalance.direction,
            label:     t('girviCashbook.analytics.vsLastMonth', 'vs last month'),
            showIcon:  true,
          } : undefined}
        />

        <StatCard
          title={t('girviCashbook.analytics.totalInflow', 'Total Inflow')}
          value={formatCurrency(statistics.totalInflow)}
          icon={TrendingUp}
          variant="success"
          size="md"
          subtitle={t('girviCashbook.analytics.cashReceived', 'Cash received')}
          trend={statistics.trends?.totalInflow ? {
            value:     statistics.trends.totalInflow.value,
            direction: statistics.trends.totalInflow.direction,
            label:     t('girviCashbook.analytics.vsLastMonth', 'vs last month'),
            showIcon:  true,
          } : undefined}
        />

        <StatCard
          title={t('girviCashbook.analytics.totalOutflow', 'Total Outflow')}
          value={formatCurrency(statistics.totalOutflow)}
          icon={TrendingDown}
          variant="error"
          size="md"
          subtitle={t('girviCashbook.analytics.cashGiven', 'Cash given out')}
          trend={statistics.trends?.totalOutflow ? {
            value:     statistics.trends.totalOutflow.value,
            direction: statistics.trends.totalOutflow.direction,
            label:     t('girviCashbook.analytics.vsLastMonth', 'vs last month'),
            showIcon:  true,
          } : undefined}
        />

        <StatCard
          title={t('girviCashbook.analytics.totalEntries', 'Total Entries')}
          value={formatNumber(statistics.totalEntries)}
          icon={BookOpen}
          variant="default"
          size="md"
          subtitle={t('girviCashbook.analytics.allTransactions', 'All transactions')}
        />

        <StatCard
          title={t('girviCashbook.analytics.totalInterest', 'Interest Earned')}
          value={formatCurrency(statistics.totalInterestEarned)}
          icon={Percent}
          variant="warning"
          size="md"
          subtitle={t('girviCashbook.analytics.interestCollected', 'Interest collected')}
          trend={statistics.trends?.totalInterestEarned ? {
            value:     statistics.trends.totalInterestEarned.value,
            direction: statistics.trends.totalInterestEarned.direction,
            label:     t('girviCashbook.analytics.vsLastMonth', 'vs last month'),
            showIcon:  true,
          } : undefined}
        />

        <StatCard
          title={t('girviCashbook.analytics.totalPrincipal', 'Principal Given')}
          value={formatCurrency(statistics.totalPrincipalGiven)}
          icon={Tag}
          variant="info"
          size="md"
          subtitle={t('girviCashbook.analytics.principalLoaned', 'Total loaned out')}
        />

      </StatCardGrid>

      {/* ── Monthly Inflow vs Outflow Chart ─────────────────────────────────── */}
      <Separator spacing="lg" className="mt-8" />

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('girviCashbook.analytics.monthlyTrend', 'Monthly Cash Flow Trend')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('girviCashbook.analytics.monthlyTrendDesc', 'Inflow vs outflow over last 12 months')}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          {monthlyData.length > 0 ? (
            <AreaChart
              data={monthlyData}
              areas={[
                {
                  dataKey:     'totalInflow',
                  name:        t('girviCashbook.analytics.inflow', 'Inflow'),
                  color:       'var(--status-success)',
                  fillOpacity: 0.25,
                },
                {
                  dataKey:     'totalOutflow',
                  name:        t('girviCashbook.analytics.outflow', 'Outflow'),
                  color:       'var(--status-error)',
                  fillOpacity: 0.25,
                },
              ]}
              xAxisKey="month"
              height={320}
              showGrid={true}
              showLegend={true}
              showTooltip={true}
              stacked={false}
              formatYAxis={value => {
                if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
                if (value >= 1000)   return `₹${(value / 1000).toFixed(0)}K`
                return `₹${value}`
              }}
              formatTooltip={value => formatCurrency(value)}
            />
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm text-text-tertiary">
              {t('common.noData', 'No data available')}
            </div>
          )}
        </div>
      </div>

      {/* ── Yearly Breakdown Chart ───────────────────────────────────────────── */}
      <Separator spacing="lg" className="mt-8" />

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-info/10">
            <BarChart2 className="h-5 w-5 text-status-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('girviCashbook.analytics.yearlyBreakdown', 'Yearly Breakdown')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('girviCashbook.analytics.yearlyBreakdownDesc', 'Year-wise inflow and outflow comparison')}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          {(statistics.yearlyBreakdown || []).length > 0 ? (
            <BarChart
              data={(statistics.yearlyBreakdown || []).map(d => ({
                ...d,
                year: String(d.year),
              }))}
              bars={[
                {
                  dataKey: 'totalInflow',
                  name:    t('girviCashbook.analytics.inflow', 'Inflow'),
                  color:   'var(--status-success)',
                },
                {
                  dataKey: 'totalOutflow',
                  name:    t('girviCashbook.analytics.outflow', 'Outflow'),
                  color:   'var(--status-error)',
                },
              ]}
              xAxisKey="year"
              height={320}
              showGrid={true}
              showLegend={true}
              showTooltip={true}
              formatYAxis={value => {
                if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
                if (value >= 1000)   return `₹${(value / 1000).toFixed(0)}K`
                return `₹${value}`
              }}
              formatTooltip={value => formatCurrency(value)}
            />
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm text-text-tertiary">
              {t('common.noData', 'No data available')}
            </div>
          )}
        </div>
      </div>

      {/* ── Segmentation Donuts ─────────────────────────────────────────────── */}
      <Separator spacing="lg" className="mt-8" />

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-warning/10">
            <PieChartIcon className="h-5 w-5 text-status-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('girviCashbook.analytics.segmentation', 'Entry Segmentation')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('girviCashbook.analytics.segmentationDesc', 'Breakdown by entry type and payment mode')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* By Entry Type */}
          <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
            <h4 className="mb-4 text-base font-semibold text-text-primary">
              {t('girviCashbook.analytics.byEntryType', 'By Entry Type')}
            </h4>
            {entryTypeData.length > 0 ? (
              <DonutChart
                data={entryTypeData}
                dataKey="value"
                nameKey="name"
                height={280}
                showLegend={true}
                showTooltip={true}
                innerRadius={60}
                outerRadius={90}
                colors={[
                  'var(--status-error)',
                  'var(--status-success)',
                  'var(--status-info)',
                  'var(--status-warning)',
                  'var(--accent-color)',
                ]}
                formatTooltip={value => `${formatNumber(value)} entries`}
              />
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-text-tertiary">
                {t('common.noData', 'No data available')}
              </div>
            )}
          </div>

          {/* By Payment Mode */}
          <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
            <h4 className="mb-4 text-base font-semibold text-text-primary">
              {t('girviCashbook.analytics.byPaymentMode', 'By Payment Mode')}
            </h4>
            {paymentModeData.length > 0 ? (
              <DonutChart
                data={paymentModeData}
                dataKey="value"
                nameKey="name"
                height={280}
                showLegend={true}
                showTooltip={true}
                innerRadius={60}
                outerRadius={90}
                colors={[
                  'var(--accent-color)',
                  'var(--status-info)',
                  'var(--status-success)',
                  'var(--status-warning)',
                ]}
                formatTooltip={value => `${formatNumber(value)} entries`}
              />
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-text-tertiary">
                {t('common.noData', 'No data available')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Girvis By Year Table ─────────────────────────────────────────────── */}
      <Separator spacing="lg" className="mt-8" />

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-info/10">
            <Calendar className="h-5 w-5 text-status-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('girviCashbook.analytics.girvisByYear', 'Girvis by Year')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('girviCashbook.analytics.girvisByYearDesc', 'Year-wise girvi count and total amount')}
            </p>
          </div>
        </div>

        <DataTable
          data={statistics.girvisByYear || []}
          columns={[
            {
              id:          'year',
              header:      t('girviCashbook.analytics.year', 'Year'),
              accessorKey: 'year',
              cell: ({ row }) => (
                <span className="font-semibold text-accent">{row.year}</span>
              ),
            },
            {
              id:          'count',
              header:      t('girviCashbook.analytics.girviCount', 'Girvis'),
              accessorKey: 'count',
              cell: ({ row }) => (
                <span className="font-medium text-text-primary">
                  {formatNumber(row.count)}
                </span>
              ),
              align: 'center',
            },
            {
              id:          'totalAmount',
              header:      t('girviCashbook.analytics.totalAmount', 'Total Amount'),
              accessorKey: 'totalAmount',
              cell: ({ row }) => (
                <span className="font-semibold text-status-error">
                  {formatCurrency(row.totalAmount)}
                </span>
              ),
              align: 'right',
              sortable: true,
            },
          ]}
          pagination={{ enabled: false }}
          style={{ hoverEffect: true, zebraStripes: true, className: 'shadow-sm' }}
        />
      </div>

      {/* ── Top Customers Table ──────────────────────────────────────────────── */}
      <Separator spacing="lg" className="mt-8" />

      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('girviCashbook.analytics.topCustomers', 'Top Customers')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('girviCashbook.analytics.topCustomersDesc', 'Customers with highest girvi activity')}
            </p>
          </div>
        </div>

        <DataTable
          data={statistics.topCustomers || []}
          columns={[
            {
              id:     'rank',
              header: t('girviCashbook.analytics.rank', '#'),
              cell: ({ row }) => {
                const index = (statistics.topCustomers || []).indexOf(row)
                return (
                  <span className="font-semibold text-accent">#{index + 1}</span>
                )
              },
              width: '60px',
            },
            {
              id:          'customer',
              header:      t('girviCashbook.analytics.customer', 'Customer'),
              accessorKey: 'customerName',
              cell: ({ row }) => (
                <div>
                  <div className="font-medium text-text-primary">{row.customerName}</div>
                  {row.customerPhone && (
                    <div className="text-xs text-text-tertiary">{row.customerPhone}</div>
                  )}
                </div>
              ),
            },
            {
              id:          'totalGirvis',
              header:      t('girviCashbook.analytics.totalGirvis', 'Girvis'),
              accessorKey: 'totalGirvis',
              cell: ({ row }) => (
                <span className="font-medium text-text-primary">
                  {formatNumber(row.totalGirvis)}
                </span>
              ),
              align:    'center',
              sortable: true,
            },
            {
              id:          'totalPrincipal',
              header:      t('girviCashbook.analytics.totalPrincipal', 'Principal'),
              accessorKey: 'totalPrincipal',
              cell: ({ row }) => (
                <span className="font-semibold text-status-error">
                  {formatCurrency(row.totalPrincipal)}
                </span>
              ),
              align:    'right',
              sortable: true,
            },
            {
              id:          'totalInterestPaid',
              header:      t('girviCashbook.analytics.interestPaid', 'Interest Paid'),
              accessorKey: 'totalInterestPaid',
              cell: ({ row }) => (
                <span className="font-semibold text-status-success">
                  {formatCurrency(row.totalInterestPaid)}
                </span>
              ),
              align: 'right',
            },
            {
              id:          'lastGirviDate',
              header:      t('girviCashbook.analytics.lastGirvi', 'Last Girvi'),
              accessorKey: 'lastGirviDate',
              cell: ({ row }) => {
                if (!row.lastGirviDate) return <span className="text-text-tertiary">—</span>
                return (
                  <span className="text-sm text-text-secondary">
                    {new Date(row.lastGirviDate).toLocaleDateString('en-IN', {
                      day:   '2-digit',
                      month: 'short',
                      year:  'numeric',
                    })}
                  </span>
                )
              },
            },
          ]}
          pagination={{ enabled: false }}
          style={{ hoverEffect: true, zebraStripes: false, className: 'shadow-sm' }}
        />
      </div>

    </div>
  )
}

GirviCashbookAnalytics.displayName = 'GirviCashbookAnalytics'