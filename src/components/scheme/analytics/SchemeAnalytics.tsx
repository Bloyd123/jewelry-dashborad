// FILE: src/components/scheme/analytics/SchemeAnalytics.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users, TrendingUp, DollarSign,
  Activity, CheckCircle, AlertCircle,
  BarChart3 as BarChartIcon, Star,
} from 'lucide-react'
import {
  StatCard,
  StatCardGrid,
  StatCardSkeleton,
} from '@/components/ui/data-display/StatCard'
import { LineChart }  from '@/components/ui/charts'
import { BarChart }   from '@/components/ui/charts'
import { DonutChart } from '@/components/ui/charts/DonutChart'
import { DataTable }  from '@/components/ui/data-display/DataTable'
import { Separator }  from '@/components/ui/layout/Separator'
import { Badge }      from '@/components/ui/data-display/Badge'
import { cn }         from '@/lib/utils'
import { useSchemeAnalytics } from '@/hooks/scheme/useSchemeAnalytics'
import type { SchemeAnalyticsData } from '@/types/scheme.types'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'

interface SchemeAnalyticsProps {
  shopId:     string
  className?: string
  onRefresh?: () => void
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(value)

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-IN').format(value)

export const SchemeAnalytics: React.FC<SchemeAnalyticsProps> = ({
  shopId,
  className,
  onRefresh,
}) => {
  const { t } = useTranslation()

  const { analytics, isLoading, refetch } = useSchemeAnalytics(shopId)

  const handleRefresh = () => {
    refetch()
    onRefresh?.()
  }

  // ── Loading ──────────────────────────────────
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            {t('scheme.analytics.title')}
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

  // ── No Data ──────────────────────────────────
  if (!analytics) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-text-tertiary" />
          <p className="text-text-secondary">
            {t('scheme.analytics.noData')}
          </p>
        </div>
      </div>
    )
  }

  // ── Monthly Trend Data ───────────────────────
  const monthlyTrendData = (analytics.monthlyTrend || []).map(item => ({
    month:       `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    enrollments: item.newEnrollments,
    revenue:     item.revenue,
  }))

  // ── Enrollment Status Donut ──────────────────
  const enrollmentStatusData = [
    {
      name:  t('scheme.enrollment.active'),
      value: analytics.enrollmentStats?.activeEnrollments || 0,
    },
    {
      name:  t('scheme.enrollment.completed'),
      value: analytics.enrollmentStats?.completedEnrollments || 0,
    },
    {
      name:  t('scheme.enrollment.cancelled'),
      value: analytics.enrollmentStats?.cancelledEnrollments || 0,
    },
  ].filter(d => d.value > 0)

  // ── Scheme Status Donut ──────────────────────
  const schemeStatusData = [
    {
      name:  t('scheme.status.active'),
      value: analytics.schemeStats?.activeSchemes || 0,
    },
    {
      name:  t('scheme.status.paused'),
      value: analytics.schemeStats?.pausedSchemes || 0,
    },
    {
      name:  t('scheme.status.draft'),
      value: analytics.schemeStats?.draftSchemes || 0,
    },
  ].filter(d => d.value > 0)

  // ── Top Schemes Columns ──────────────────────
  const topSchemeColumns: DataTableColumn<any>[] = [
    {
      id:   'rank',
      header: t('scheme.analytics.rank'),
      width:  '60px',
      cell: ({ row }) => {
        const index = (analytics.topSchemes || []).indexOf(row)
        return (
          <span className="font-semibold text-accent">#{index + 1}</span>
        )
      },
    },
    {
      id:          'scheme',
      header:      t('scheme.analytics.scheme'),
      accessorKey: 'schemeName',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {row.schemeName}
          </p>
          <p className="font-mono text-xs text-text-tertiary">
            {row.schemeCode}
          </p>
        </div>
      ),
    },
    {
      id:          'enrollments',
      header:      t('scheme.analytics.enrollments'),
      accessorKey: 'enrollments',
      align:       'center',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Users className="h-3.5 w-3.5 text-text-tertiary" />
          <span className="text-sm font-medium text-text-primary">
            {formatNumber(row.enrollments)}
          </span>
        </div>
      ),
    },
    {
      id:          'revenue',
      header:      t('scheme.analytics.revenue'),
      accessorKey: 'totalRevenue',
      align:       'right',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-text-primary">
          {formatCurrency(row.totalRevenue)}
        </span>
      ),
    },
  ]

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className={cn('space-y-6', className)}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {t('scheme.analytics.title')}
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            {t('scheme.analytics.subtitle')}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="hover:bg-accent/90 rounded-lg bg-accent px-4 py-2 text-white transition-colors"
        >
          {t('scheme.analytics.refresh')}
        </button>
      </div>

      {/* ── SECTION 1: Scheme Stats ────────────── */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('scheme.analytics.totalSchemes')}
          value={formatNumber(analytics.schemeStats?.totalSchemes || 0)}
          icon={BarChartIcon}
          variant="default"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.activeSchemes')}
          value={formatNumber(analytics.schemeStats?.activeSchemes || 0)}
          icon={CheckCircle}
          variant="success"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.totalEnrollments')}
          value={formatNumber(analytics.enrollmentStats?.totalEnrollments || 0)}
          icon={Users}
          variant="info"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.activeEnrollments')}
          value={formatNumber(analytics.enrollmentStats?.activeEnrollments || 0)}
          icon={Activity}
          variant="warning"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.totalRevenue')}
          value={formatCurrency(analytics.enrollmentStats?.totalRevenue || 0)}
          icon={TrendingUp}
          variant="success"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.totalCollected')}
          value={formatCurrency(analytics.totalCollected || 0)}
          icon={DollarSign}
          variant="info"
          size="md"
        />
      </StatCardGrid>

      <Separator spacing="lg" />

      {/* ── SECTION 2: Monthly Trend Charts ───── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {t('scheme.analytics.enrollmentTrend')}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('scheme.analytics.enrollmentTrendDesc')}
            </p>
          </div>
          {monthlyTrendData.length > 0 ? (
            <LineChart
              data={monthlyTrendData}
              lines={[{
                dataKey:     'enrollments',
                name:        t('scheme.analytics.newEnrollments'),
                color:       'var(--accent-color)',
                strokeWidth: 3,
              }]}
              xAxisKey="month"
              height={300}
              showGrid
              showLegend
              showTooltip
              formatYAxis={v => formatNumber(v)}
              formatTooltip={v => formatNumber(v)}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-text-tertiary">
              {t('common.noData')}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {t('scheme.analytics.revenueTrend')}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('scheme.analytics.revenueTrendDesc')}
            </p>
          </div>
          {monthlyTrendData.length > 0 ? (
            <BarChart
              data={monthlyTrendData}
              bars={[{
                dataKey: 'revenue',
                name:    t('scheme.analytics.revenue'),
                color:   'var(--status-success)',
              }]}
              xAxisKey="month"
              height={300}
              showGrid
              showLegend
              showTooltip
              formatYAxis={v =>
                v >= 1000000
                  ? `₹${(v / 1000000).toFixed(1)}M`
                  : formatCurrency(v)
              }
              formatTooltip={v => formatCurrency(v)}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-text-tertiary">
              {t('common.noData')}
            </div>
          )}
        </div>
      </div>

      <Separator spacing="lg" />

      {/* ── SECTION 3: Donut Charts ────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <h4 className="mb-4 text-base font-semibold text-text-primary">
            {t('scheme.analytics.enrollmentStatus')}
          </h4>
          {enrollmentStatusData.length > 0 ? (
            <DonutChart
              data={enrollmentStatusData}
              dataKey="value"
              nameKey="name"
              height={280}
              showLegend
              showTooltip
              innerRadius={60}
              outerRadius={90}
              colors={[
                'var(--status-success)',
                'var(--status-info)',
                'var(--status-error)',
              ]}
              formatTooltip={v => `${formatNumber(v)} enrollments`}
            />
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-text-tertiary">
              {t('common.noData')}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <h4 className="mb-4 text-base font-semibold text-text-primary">
            {t('scheme.analytics.schemeStatus')}
          </h4>
          {schemeStatusData.length > 0 ? (
            <DonutChart
              data={schemeStatusData}
              dataKey="value"
              nameKey="name"
              height={280}
              showLegend
              showTooltip
              innerRadius={60}
              outerRadius={90}
              colors={[
                'var(--accent-color)',
                'var(--status-warning)',
                'var(--status-info)',
              ]}
              formatTooltip={v => `${formatNumber(v)} schemes`}
            />
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-text-tertiary">
              {t('common.noData')}
            </div>
          )}
        </div>
      </div>

      <Separator spacing="lg" />

      {/* ── SECTION 4: Top Schemes ─────────────── */}
      {analytics.topSchemes && analytics.topSchemes.length > 0 && (
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('scheme.analytics.topSchemes')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('scheme.analytics.topSchemesDesc')}
              </p>
            </div>
          </div>

          <DataTable
            data={analytics.topSchemes}
            columns={topSchemeColumns}
            pagination={{ enabled: false }}
            style={{
              hoverEffect:  true,
              zebraStripes: false,
              showBorder:   true,
              rounded:      true,
              shadow:       true,
            }}
          />
        </div>
      )}
    </div>
  )
}

SchemeAnalytics.displayName = 'SchemeAnalytics'