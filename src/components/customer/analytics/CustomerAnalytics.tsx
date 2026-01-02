// FILE: src/components/customers/analytics/CustomerAnalytics.tsx
// Customer Analytics Dashboard Component

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users,
  UserCheck,
  Crown,
  TrendingUp,
  Gift,
  AlertCircle,
  DollarSign,
  Activity,
  MapPin,
  AlertTriangle,
  Receipt,
  Star,
  ShoppingBag,
  Calendar,
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  StatCard,
  StatCardGrid,
  StatCardSkeleton,
} from '@/components/ui/data-display/StatCard'
import { LineChart, AreaChart, BarChart } from '@/components/ui/charts'
import { DonutChart } from '@/components/ui/charts/DonutChart'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { Separator } from '@/components/ui/layout/Separator'
import { cn } from '@/lib/utils'
import {
  mockGrowthData,
  mockRetentionData,
  mockTopCustomers,
  mockSegmentationData,
  mockGeographyData,
  mockPurchasePatternData,
  mockRecentEvents,
  mockAtRiskCustomers,
  mockOutstandingPayments,
} from './customerAnalytics.mock'

// TYPES & INTERFACES

export interface CustomerStatistics {
  totalCustomers: number
  activeCustomers: number
  vipCustomers: number
  totalOutstanding: number
  totalLoyaltyPoints: number
  avgLifetimeValue: number
  // Growth & Retention data
  growthData?: Array<{
    month: string
    customers: number
    newCustomers: number
  }>
  retentionData?: Array<{
    month: string
    rate: number
  }>
  // Top customers data
  topCustomers?: Array<{
    _id: string
    customerCode: string
    fullName: string
    phone: string
    email?: string
    totalPurchases: number
    loyaltyPoints: number
    membershipTier: string
    lastOrderDate?: string
  }>
  // Segmentation data
  segmentationData?: {
    byTier?: Array<{
      name: string
      value: number
    }>
    byType?: Array<{
      name: string
      value: number
    }>
    byCategory?: Array<{
      name: string
      value: number
    }>
  }
  // Geography data
  geographyData?: Array<{
    city: string
    customers: number
    revenue: number
  }>
  // Purchase pattern data
  purchasePatternData?: Array<{
    month: string
    orders: number
    revenue: number
    averageOrderValue: number
  }>
  // Recent events
  recentEvents?: Array<{
    _id: string
    customerCode: string
    customerName: string
    eventType: 'anniversary' | 'birthday' | 'signup'
    date: string
    daysUntil: number
  }>
  // At-risk customers
  atRiskCustomers?: Array<{
    _id: string
    customerCode: string
    fullName: string
    phone: string
    lastOrderDate: string
    daysSinceLastOrder: number
    totalPurchases: number
    riskLevel: 'high' | 'medium' | 'low'
  }>
  // Outstanding payments
  outstandingPayments?: Array<{
    _id: string
    customerCode: string
    fullName: string
    phone: string
    totalDue: number
    overdueAmount: number
    lastPaymentDate?: string
    daysOverdue: number
  }>
}

export interface CustomerAnalyticsProps {
  shopId: string
  statistics?: CustomerStatistics
  loading?: boolean
  onRefresh?: () => void
  className?: string
}

// HELPER FUNCTIONS

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value)
}

// const calculateTrend = (current: number, previous: number = 0) => {
//   if (previous === 0) return { value: 0, direction: 'neutral' as const }
//   const change = ((current - previous) / previous) * 100
//   return {
//     value: Math.abs(Math.round(change)),
//     direction: change > 0 ? ('up' as const) : change < 0 ? ('down' as const) : ('neutral' as const),
//   }
// }

// CUSTOMERANALYTICS COMPONENT


export const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({
  shopId,
  statistics,
  loading = false,
  onRefresh,
  className,
}) => {
  const { t } = useTranslation()

  // Loading State
  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            {t('customer.analytics.title')}
          </h2>
        </div>
        <StatCardGrid columns={4} gap="md">
          <StatCardSkeleton size="md" showIcon showTrend />
          <StatCardSkeleton size="md" showIcon showTrend />
          <StatCardSkeleton size="md" showIcon showTrend />
          <StatCardSkeleton size="md" showIcon showTrend />
          <StatCardSkeleton size="md" showIcon showTrend />
          <StatCardSkeleton size="md" showIcon showTrend />
        </StatCardGrid>
      </div>
    )
  }

  // No Data State
  if (!statistics) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">
            {t('customer.analytics.title')}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-text-tertiary" />
          <p className="text-text-secondary">
            {t('customer.analytics.noData')}
          </p>
        </div>
      </div>
    )
  }

  // Calculate derived metrics
  const activePercentage =
    statistics.totalCustomers > 0
      ? Math.round(
          (statistics.activeCustomers / statistics.totalCustomers) * 100
        )
      : 0

  const vipPercentage =
    statistics.totalCustomers > 0
      ? Math.round((statistics.vipCustomers / statistics.totalCustomers) * 100)
      : 0

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {t('customer.analytics.title')}
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            {t('customer.analytics.subtitle')}
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="hover:bg-accent/90 rounded-lg bg-accent px-4 py-2 text-white transition-colors"
          >
            {t('customer.analytics.refresh')}
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <StatCardGrid columns={4} gap="md">
        {/* Total Customers */}
        <StatCard
          title={t('customer.analytics.totalCustomers')}
          value={formatNumber(statistics.totalCustomers)}
          icon={Users}
          variant="default"
          size="md"
          trend={{
            value: 12,
            direction: 'up',
            label: t('customer.analytics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('customer.analytics.totalCustomersDesc')}
        />

        {/* Active Customers */}
        <StatCard
          title={t('customer.analytics.activeCustomers')}
          value={formatNumber(statistics.activeCustomers)}
          icon={UserCheck}
          variant="success"
          size="md"
          subtitle={`${activePercentage}% ${t('customer.analytics.ofTotal')}`}
          trend={{
            value: 8,
            direction: 'up',
            label: t('customer.analytics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('customer.analytics.activeCustomersDesc')}
        />

        {/* VIP Customers */}
        <StatCard
          title={t('customer.analytics.vipCustomers')}
          value={formatNumber(statistics.vipCustomers)}
          icon={Crown}
          variant="warning"
          size="md"
          subtitle={`${vipPercentage}% ${t('customer.analytics.ofTotal')}`}
          trend={{
            value: 5,
            direction: 'up',
            label: t('customer.analytics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('customer.analytics.vipCustomersDesc')}
        />

        {/* Average Lifetime Value */}
        <StatCard
          title={t('customer.analytics.avgLifetimeValue')}
          value={formatCurrency(statistics.avgLifetimeValue)}
          icon={TrendingUp}
          variant="info"
          size="md"
          trend={{
            value: 15,
            direction: 'up',
            label: t('customer.analytics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('customer.analytics.avgLifetimeValueDesc')}
        />

        {/* Total Outstanding */}
        <StatCard
          title={t('customer.analytics.totalOutstanding')}
          value={formatCurrency(statistics.totalOutstanding)}
          icon={DollarSign}
          variant="error"
          size="md"
          trend={{
            value: 3,
            direction: 'down',
            label: t('customer.analytics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('customer.analytics.totalOutstandingDesc')}
        />

        {/* Total Loyalty Points */}
        <StatCard
          title={t('customer.analytics.totalLoyaltyPoints')}
          value={formatNumber(statistics.totalLoyaltyPoints)}
          icon={Gift}
          variant="success"
          size="md"
          trend={{
            value: 20,
            direction: 'up',
            label: t('customer.analytics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('customer.analytics.totalLoyaltyPointsDesc')}
        />

        {/* Customer Growth Rate */}
        <StatCard
          title={t('customer.analytics.growthRate')}
          value="+12%"
          icon={Activity}
          variant="success"
          size="md"
          subtitle={t('customer.analytics.last30Days')}
          description={t('customer.analytics.growthRateDesc')}
        />

        {/* Retention Rate */}
        <StatCard
          title={t('customer.analytics.retentionRate')}
          value="87%"
          icon={UserCheck}
          variant="info"
          size="md"
          subtitle={t('customer.analytics.last90Days')}
          trend={{
            value: 5,
            direction: 'up',
            label: t('customer.analytics.vsLastPeriod'),
            showIcon: true,
          }}
          description={t('customer.analytics.retentionRateDesc')}
        />
      </StatCardGrid>

      {/* Growth & Retention Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer Growth Chart */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {t('customer.analytics.customerGrowth')}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('customer.analytics.customerGrowthDesc')}
            </p>
          </div>
          <LineChart
            data={statistics.growthData || mockGrowthData}
            lines={[
              {
                dataKey: 'customers',
                name: t('customer.analytics.totalCustomers'),
                color: 'var(--accent-color)',
                strokeWidth: 3,
              },
              {
                dataKey: 'newCustomers',
                name: t('customer.analytics.newCustomers'),
                color: 'var(--status-success)',
                strokeWidth: 2,
              },
            ]}
            xAxisKey="month"
            height={300}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            formatYAxis={value => formatNumber(value)}
            formatTooltip={value => formatNumber(value)}
          />
        </div>

        {/* Retention Rate Chart */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {t('customer.analytics.retentionTrend')}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('customer.analytics.retentionTrendDesc')}
            </p>
          </div>
          <LineChart
            data={statistics.retentionData || mockRetentionData}
            lines={[
              {
                dataKey: 'rate',
                name: t('customer.analytics.retentionRate'),
                color: 'var(--status-info)',
                strokeWidth: 3,
              },
            ]}
            xAxisKey="month"
            height={300}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            formatYAxis={value => `${value}%`}
            formatTooltip={value => `${value}%`}
          />
        </div>
      </div>

      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Geographic Distribution Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-status-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <MapPin className="h-5 w-5 text-status-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('customer.analytics.geographicDistribution')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('customer.analytics.geographicDistributionDesc')}
            </p>
          </div>
        </div>

        <div className="chart-wrapper rounded-lg border border-border-primary bg-bg-secondary p-6">
          <BarChart
            data={statistics.geographyData || mockGeographyData}
            bars={[
              {
                dataKey: 'customers',
                name: t('customer.analytics.totalCustomers'),
                color: 'var(--accent-color)',
              },
            ]}
            xAxisKey="city"
            height={350}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            formatYAxis={value => formatNumber(value)}
            formatTooltip={value => `${formatNumber(value)} customers`}
          />
        </div>
      </div>

      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Customer Segmentation Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-status-info/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <PieChartIcon className="h-5 w-5 text-status-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('customer.analytics.customerSegmentation')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('customer.analytics.customerSegmentationDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* By Membership Tier */}
          <div className="chart-wrapper rounded-lg border border-border-primary bg-bg-secondary p-6">
            <h4 className="mb-4 text-base font-semibold text-text-primary">
              {t('customer.analytics.byMembershipTier')}
            </h4>
            <DonutChart
              data={
                statistics.segmentationData?.byTier ||
                mockSegmentationData.byTier
              }
              dataKey="value"
              nameKey="name"
              height={280}
              showLegend={true}
              showTooltip={true}
              innerRadius={60}
              outerRadius={90}
              colors={[
                'var(--status-info)',
                'var(--status-warning)',
                'var(--status-success)',
                'var(--accent-color)',
              ]}
              formatTooltip={value => `${formatNumber(value)} customers`}
            />
          </div>

          {/* By Customer Type */}
          <div className="chart-wrapper rounded-lg border border-border-primary bg-bg-secondary p-6">
            <h4 className="mb-4 text-base font-semibold text-text-primary">
              {t('customer.analytics.byCustomerType')}
            </h4>
            <DonutChart
              data={
                statistics.segmentationData?.byType ||
                mockSegmentationData.byType
              }
              dataKey="value"
              nameKey="name"
              height={280}
              showLegend={true}
              showTooltip={true}
              innerRadius={60}
              outerRadius={90}
              colors={[
                'var(--status-warning)',
                'var(--status-info)',
                'var(--status-success)',
                'var(--accent-color)',
              ]}
              formatTooltip={value => `${formatNumber(value)} customers`}
            />
          </div>

          {/* By Product Category */}
          <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
            <h4 className="mb-4 text-base font-semibold text-text-primary">
              {t('customer.analytics.byProductCategory')}
            </h4>
            <DonutChart
              data={
                statistics.segmentationData?.byCategory ||
                mockSegmentationData.byCategory
              }
              dataKey="value"
              nameKey="name"
              height={280}
              showLegend={true}
              showTooltip={true}
              innerRadius={60}
              outerRadius={90}
              colors={[
                'var(--status-warning)',
                'var(--status-info)',
                'var(--status-success)',
                'var(--status-error)',
                'var(--accent-color)',
              ]}
              formatTooltip={value => `${formatNumber(value)} customers`}
            />
          </div>
        </div>
      </div>

      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Top Customers Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('customer.analytics.topCustomers')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('customer.analytics.topCustomersDesc')}
              </p>
            </div>
          </div>
        </div>

        <DataTable
          data={statistics.topCustomers || mockTopCustomers}
          columns={[
            {
              id: 'rank',
              header: t('customer.analytics.rank'),
              cell: ({ row }) => {
                const index = (
                  statistics.topCustomers || mockTopCustomers
                ).indexOf(row)
                return (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-accent">
                      #{index + 1}
                    </span>
                  </div>
                )
              },
              width: '60px',
            },
            {
              id: 'customer',
              header: t('customer.analytics.customer'),
              accessorKey: 'fullName',
              cell: ({ row }) => (
                <div>
                  <div className="font-medium text-text-primary">
                    {row.fullName}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {row.customerCode}
                  </div>
                </div>
              ),
            },
            {
              id: 'contact',
              header: t('customer.analytics.contact'),
              accessorKey: 'phone',
              cell: ({ row }) => (
                <div>
                  <div className="text-sm text-text-primary">{row.phone}</div>
                  {row.email && (
                    <div className="text-xs text-text-tertiary">
                      {row.email}
                    </div>
                  )}
                </div>
              ),
            },
            {
              id: 'tier',
              header: t('customer.analytics.tier'),
              accessorKey: 'membershipTier',
              cell: ({ row }) => {
                const tierColors: Record<string, string> = {
                  platinum: 'bg-purple-100 text-purple-800 border-purple-200',
                  gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  silver: 'bg-gray-100 text-gray-800 border-gray-200',
                  standard: 'bg-blue-100 text-blue-800 border-blue-200',
                }
                return (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
                      tierColors[row.membershipTier] || tierColors.standard
                    )}
                  >
                    {row.membershipTier}
                  </span>
                )
              },
              align: 'center',
            },
            {
              id: 'totalPurchases',
              header: t('customer.analytics.totalPurchases'),
              accessorKey: 'totalPurchases',
              cell: ({ row }) => (
                <div className="font-semibold text-text-primary">
                  {formatCurrency(row.totalPurchases)}
                </div>
              ),
              align: 'right',
              sortable: true,
            },
            {
              id: 'loyaltyPoints',
              header: t('customer.analytics.loyaltyPoints'),
              accessorKey: 'loyaltyPoints',
              cell: ({ row }) => (
                <div className="flex items-center justify-end gap-1">
                  <Gift className="h-4 w-4 text-status-success" />
                  <span className="font-medium text-text-primary">
                    {formatNumber(row.loyaltyPoints)}
                  </span>
                </div>
              ),
              align: 'right',
            },
            {
              id: 'lastOrder',
              header: t('customer.analytics.lastOrder'),
              accessorKey: 'lastOrderDate',
              cell: ({ row }) => {
                if (!row.lastOrderDate) return '-'
                const date = new Date(row.lastOrderDate)
                return (
                  <div className="text-sm text-text-secondary">
                    {date.toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                )
              },
            },
          ]}
          pagination={{
            enabled: false,
          }}
          style={{
            hoverEffect: true,
            zebraStripes: false,
            className: 'shadow-sm',
          }}
        />
      </div>
      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Purchase Pattern Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-status-warning/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <ShoppingBag className="h-5 w-5 text-status-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('customer.analytics.purchasePattern')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('customer.analytics.purchasePatternDesc')}
            </p>
          </div>
        </div>

        <div className="chart-wrapper rounded-lg border border-border-primary bg-bg-secondary p-6">
          <AreaChart
            data={statistics.purchasePatternData || mockPurchasePatternData}
            areas={[
              {
                dataKey: 'orders',
                name: t('customer.analytics.totalOrders'),
                color: 'var(--accent-color)',
                fillOpacity: 0.3,
              },
              {
                dataKey: 'revenue',
                name: t('customer.analytics.revenue'),
                color: 'var(--status-success)',
                fillOpacity: 0.3,
              },
            ]}
            xAxisKey="month"
            height={350}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            stacked={false}
            formatYAxis={value => {
              if (value >= 1000000) {
                return `₹${(value / 1000000).toFixed(1)}M`
              }
              return formatNumber(value)
            }}
            formatTooltip={value => {
              if (value > 100000) {
                return formatCurrency(value)
              }
              return formatNumber(value)
            }}
          />
        </div>
      </div>
      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Customer Insights Grid - Events, At-Risk, Outstanding */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Events */}
          <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-secondary">
            <div className="bg-bg-tertiary/30 border-b border-border-primary p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-status-info" />
                <div>
                  <h4 className="font-semibold text-text-primary">
                    {t('customer.analytics.upcomingEvents')}
                  </h4>
                  <p className="text-xs text-text-tertiary">
                    {t('customer.analytics.upcomingEventsDesc')}
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border-secondary">
              {(statistics.recentEvents || mockRecentEvents).map(event => {
                const eventIcons = {
                  anniversary: '💍',
                  birthday: '🎂',
                  signup: '🎉',
                }
                const eventColors = {
                  anniversary: 'text-purple-600',
                  birthday: 'text-pink-600',
                  signup: 'text-blue-600',
                }
                return (
                  <div
                    key={event._id}
                    className="hover:bg-bg-tertiary/30 p-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {eventIcons[event.eventType]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-text-primary">
                          {event.customerName}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          {event.customerCode}
                        </div>
                        <div
                          className={cn(
                            'mt-1 text-xs font-medium capitalize',
                            eventColors[event.eventType]
                          )}
                        >
                          {event.eventType} • {event.daysUntil}{' '}
                          {t('customer.analytics.daysAway')}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* At-Risk Customers */}
          <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-secondary">
            <div className="bg-bg-tertiary/30 border-b border-border-primary p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                <div>
                  <h4 className="font-semibold text-text-primary">
                    {t('customer.analytics.atRiskCustomers')}
                  </h4>
                  <p className="text-xs text-text-tertiary">
                    {t('customer.analytics.atRiskCustomersDesc')}
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border-secondary">
              {(statistics.atRiskCustomers || mockAtRiskCustomers).map(
                customer => {
                  const riskColors = {
                    high: 'bg-status-error/10 text-status-error border-status-error/30',
                    medium:
                      'bg-status-warning/10 text-status-warning border-status-warning/30',
                    low: 'bg-status-info/10 text-status-info border-status-info/30',
                  }
                  return (
                    <div
                      key={customer._id}
                      className="hover:bg-bg-tertiary/30 p-3 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-text-primary">
                            {customer.fullName}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {customer.customerCode} • {customer.phone}
                          </div>
                          <div className="mt-1 text-xs text-text-secondary">
                            {t('customer.analytics.lastOrder')}:{' '}
                            {customer.daysSinceLastOrder}{' '}
                            {t('customer.analytics.daysAgo')}
                          </div>
                        </div>
                        <span
                          className={cn(
                            'inline-flex items-center rounded border px-2 py-1 text-xs font-medium capitalize',
                            riskColors[customer.riskLevel]
                          )}
                        >
                          {customer.riskLevel}
                        </span>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>

          {/* Outstanding Payments */}
          <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-secondary">
            <div className="bg-bg-tertiary/30 border-b border-border-primary p-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-status-error" />
                <div>
                  <h4 className="font-semibold text-text-primary">
                    {t('customer.analytics.outstandingPayments')}
                  </h4>
                  <p className="text-xs text-text-tertiary">
                    {t('customer.analytics.outstandingPaymentsDesc')}
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border-secondary">
              {(statistics.outstandingPayments || mockOutstandingPayments).map(
                payment => {
                  return (
                    <div
                      key={payment._id}
                      className="hover:bg-bg-tertiary/30 p-3 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-text-primary">
                            {payment.fullName}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {payment.customerCode} • {payment.phone}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-text-secondary">
                              {t('customer.analytics.due')}:{' '}
                              {formatCurrency(payment.totalDue)}
                            </span>
                            {payment.daysOverdue > 0 && (
                              <span className="text-xs font-medium text-status-error">
                                {payment.daysOverdue}{' '}
                                {t('customer.analytics.daysOverdue')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-status-error">
                            {formatCurrency(payment.overdueAmount)}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {t('customer.analytics.overdue')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CustomerAnalytics.displayName = 'CustomerAnalytics'
