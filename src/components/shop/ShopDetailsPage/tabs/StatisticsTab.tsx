// ============================================================================
// FILE: src/components/shops/statistics/StatisticsTab.tsx
// Shop Statistics Dashboard Component
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  AlertCircle,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
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
  mockSalesTrendData,
  mockRevenueTrendData,
  mockInventoryData,
  mockTopProducts,
  mockSalesByCategoryData,
  mockSalesByPaymentMethodData,
  mockMonthlyComparisonData,
  mockRecentTransactions,
} from '@/pages/shops/dummyStatistics'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ShopStatistics {
  totalSales: {
    amount: number
    growth: string
  }
  totalOrders: {
    count: number
    growth: string
  }
  revenue: {
    amount: number
    growth: string
  }
  customers: {
    count: number
    growth: string
  }
  // Sales Trend
  salesTrend?: {
    labels: string[]
    data: number[]
  }
  // Revenue Trend
  revenueTrend?: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
  // Inventory Overview
  inventoryOverview: {
    totalProducts: number
    stockValue: number
    lowStock: number
  }
  // Top Products
  topProducts?: Array<{
    _id: string
    productCode: string
    productName: string
    category: string
    totalSold: number
    revenue: number
    stockRemaining: number
  }>
  // Sales by Category
  salesByCategory?: Array<{
    name: string
    value: number
  }>
  // Sales by Payment Method
  salesByPaymentMethod?: Array<{
    name: string
    value: number
  }>
  // Monthly Comparison
  monthlyComparison?: Array<{
    month: string
    currentYear: number
    lastYear: number
  }>
  // Recent Transactions
  recentTransactions?: Array<{
    _id: string
    orderNumber: string
    customerName: string
    date: string
    amount: number
    status: 'completed' | 'pending' | 'cancelled'
    paymentMethod: string
  }>
}

export interface StatisticsTabProps {
  shopId: string
  statistics?: ShopStatistics
  loading?: boolean
  onRefresh?: () => void
  className?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

// ============================================================================
// STATISTICSTAB COMPONENT
// ============================================================================

const StatisticsTab: React.FC<StatisticsTabProps> = ({
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
            {t('shops.statistics.title')}
          </h2>
        </div>
        <StatCardGrid columns={4} gap="md">
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
            {t('shops.statistics.title')}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-text-tertiary" />
          <p className="text-text-secondary">{t('shops.statistics.noData')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            {t('shops.statistics.title')}
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            {t('shops.statistics.subtitle')}
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="hover:bg-accent/90 rounded-lg bg-accent px-4 py-2 text-white transition-colors"
          >
            {t('shops.statistics.refresh')}
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <StatCardGrid columns={4} gap="md">
        {/* Total Sales */}
        <StatCard
          title={t('shops.statistics.totalSales')}
          value={formatCurrency(statistics.totalSales.amount)}
          icon={TrendingUp}
          variant="default"
          size="md"
          trend={{
            value: parseFloat(
              statistics.totalSales.growth.replace('+', '').replace('%', '')
            ),
            direction: statistics.totalSales.growth.startsWith('+')
              ? 'up'
              : 'down',
            label: t('shops.statistics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('shops.statistics.totalSalesDesc')}
        />

        {/* Total Orders */}
        <StatCard
          title={t('shops.statistics.totalOrders')}
          value={formatNumber(statistics.totalOrders.count)}
          icon={ShoppingCart}
          variant="info"
          size="md"
          trend={{
            value: parseFloat(
              statistics.totalOrders.growth.replace('+', '').replace('%', '')
            ),
            direction: statistics.totalOrders.growth.startsWith('+')
              ? 'up'
              : 'down',
            label: t('shops.statistics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('shops.statistics.totalOrdersDesc')}
        />

        {/* Revenue */}
        <StatCard
          title={t('shops.statistics.revenue')}
          value={formatCurrency(statistics.revenue.amount)}
          icon={DollarSign}
          variant="success"
          size="md"
          trend={{
            value: parseFloat(
              statistics.revenue.growth.replace('+', '').replace('%', '')
            ),
            direction: statistics.revenue.growth.startsWith('+')
              ? 'up'
              : 'down',
            label: t('shops.statistics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('shops.statistics.revenueDesc')}
        />

        {/* Customers */}
        <StatCard
          title={t('shops.statistics.customers')}
          value={formatNumber(statistics.customers.count)}
          icon={Users}
          variant="warning"
          size="md"
          trend={{
            value: parseFloat(
              statistics.customers.growth.replace('+', '').replace('%', '')
            ),
            direction: statistics.customers.growth.startsWith('+')
              ? 'up'
              : 'down',
            label: t('shops.statistics.vsLastMonth'),
            showIcon: true,
          }}
          description={t('shops.statistics.customersDesc')}
        />
      </StatCardGrid>

      {/* Inventory Stats */}
      <StatCardGrid columns={3} gap="md" className="mt-6">
        {/* Total Products */}
        <StatCard
          title={t('shops.statistics.totalProducts')}
          value={formatNumber(statistics.inventoryOverview.totalProducts)}
          icon={Package}
          variant="default"
          size="md"
          description={t('shops.statistics.totalProductsDesc')}
        />

        {/* Stock Value */}
        <StatCard
          title={t('shops.statistics.stockValue')}
          value={formatCurrency(statistics.inventoryOverview.stockValue)}
          icon={BarChart3}
          variant="success"
          size="md"
          description={t('shops.statistics.stockValueDesc')}
        />

        {/* Low Stock */}
        <StatCard
          title={t('shops.statistics.lowStock')}
          value={formatNumber(statistics.inventoryOverview.lowStock)}
          icon={AlertCircle}
          variant="error"
          size="md"
          description={t('shops.statistics.lowStockDesc')}
        />
      </StatCardGrid>

      {/* Sales & Revenue Trend Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Trend Chart */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {t('shops.statistics.salesTrend')}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('shops.statistics.salesTrendDesc')}
            </p>
          </div>
          <LineChart
            data={
              statistics.salesTrend
                ? statistics.salesTrend.labels.map((label, idx) => ({
                    month: label,
                    sales: statistics.salesTrend!.data[idx],
                  }))
                : mockSalesTrendData
            }
            lines={[
              {
                dataKey: 'sales',
                name: t('shops.statistics.sales'),
                color: 'var(--accent-color)',
                strokeWidth: 3,
              },
            ]}
            xAxisKey="month"
            height={300}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            formatYAxis={value => formatCurrency(value)}
            formatTooltip={value => formatCurrency(value)}
          />
        </div>

        {/* Revenue vs Expenses Chart */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {t('shops.statistics.revenueVsExpenses')}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('shops.shopsstatistics.revenueVsExpensesDesc')}
            </p>
          </div>
          <AreaChart
            data={statistics.revenueTrend || mockRevenueTrendData}
            areas={[
              {
                dataKey: 'revenue',
                name: t('shops.statistics.revenue'),
                color: 'var(--status-success)',
                fillOpacity: 0.3,
              },
              {
                dataKey: 'expenses',
                name: t('shops.statistics.expenses'),
                color: 'var(--status-error)',
                fillOpacity: 0.3,
              },
              {
                dataKey: 'profit',
                name: t('shops.statistics.profit'),
                color: 'var(--accent-color)',
                fillOpacity: 0.3,
              },
            ]}
            xAxisKey="month"
            height={300}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            stacked={false}
            formatYAxis={value => formatCurrency(value)}
            formatTooltip={value => formatCurrency(value)}
          />
        </div>
      </div>

      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Sales Analysis Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-status-info/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <PieChartIcon className="h-5 w-5 text-status-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('shops.statistics.salesAnalysis')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('shops.statistics.salesAnalysisDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Sales by Category */}
          <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
            <h4 className="mb-4 text-base font-semibold text-text-primary">
              {t('shops.statistics.salesByCategory')}
            </h4>
            <DonutChart
              data={statistics.salesByCategory || mockSalesByCategoryData}
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
              formatTooltip={value => formatCurrency(value)}
            />
          </div>

          {/* Sales by Payment Method */}
          <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
            <h4 className="mb-4 text-base font-semibold text-text-primary">
              {t('shops.statistics.salesByPaymentMethod')}
            </h4>
            <DonutChart
              data={
                statistics.salesByPaymentMethod || mockSalesByPaymentMethodData
              }
              dataKey="value"
              nameKey="name"
              height={280}
              showLegend={true}
              showTooltip={true}
              innerRadius={60}
              outerRadius={90}
              colors={[
                'var(--accent-color)',
                'var(--status-success)',
                'var(--status-info)',
                'var(--status-warning)',
              ]}
              formatTooltip={value => formatCurrency(value)}
            />
          </div>
        </div>
      </div>

      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Monthly Comparison Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-status-success/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Calendar className="h-5 w-5 text-status-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('shops.statistics.monthlyComparison')}
            </h3>
            <p className="text-sm text-text-tertiary">
              {t('shops.statistics.monthlyComparisonDesc')}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <BarChart
            data={statistics.monthlyComparison || mockMonthlyComparisonData}
            bars={[
              {
                dataKey: 'currentYear',
                name: t('shops.statistics.currentYear'),
                color: 'var(--accent-color)',
              },
              {
                dataKey: 'lastYear',
                name: t('shops.statistics.lastYear'),
                color: 'var(--status-info)',
              },
            ]}
            xAxisKey="month"
            height={350}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            formatYAxis={value => formatCurrency(value)}
            formatTooltip={value => formatCurrency(value)}
          />
        </div>
      </div>

      {/* Separator */}
      <Separator spacing="lg" className="mt-8" />

      {/* Top Products Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('shops.statistics.topProducts')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('shops.statistics.topProductsDesc')}
              </p>
            </div>
          </div>
        </div>

        <DataTable
          data={statistics.topProducts || mockTopProducts}
          columns={[
            {
              id: 'rank',
              header: t('shops.statistics.rank'),
              cell: ({ row }) => {
                const index = (
                  statistics.topProducts || mockTopProducts
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
              id: 'product',
              header: t('shops.statistics.product'),
              accessorKey: 'productName',
              cell: ({ row }) => (
                <div>
                  <div className="font-medium text-text-primary">
                    {row.productName}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {row.productCode}
                  </div>
                </div>
              ),
            },
            {
              id: 'category',
              header: t('shops.statistics.category'),
              accessorKey: 'category',
              cell: ({ row }) => (
                <span className="bg-accent/10 border-accent/20 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize text-accent">
                  {row.category}
                </span>
              ),
              align: 'center',
            },
            {
              id: 'totalSold',
              header: t('shops.statistics.totalSold'),
              accessorKey: 'totalSold',
              cell: ({ row }) => (
                <div className="font-medium text-text-primary">
                  {formatNumber(row.totalSold)} {t('shops.statistics.units')}
                </div>
              ),
              align: 'center',
              sortable: true,
            },
            {
              id: 'revenue',
              header: t('shops.statistics.revenue'),
              accessorKey: 'revenue',
              cell: ({ row }) => (
                <div className="font-semibold text-status-success">
                  {formatCurrency(row.revenue)}
                </div>
              ),
              align: 'right',
              sortable: true,
            },
            {
              id: 'stockRemaining',
              header: t('shops.statistics.stockRemaining'),
              accessorKey: 'stockRemaining',
              cell: ({ row }) => {
                const isLowStock = row.stockRemaining < 10
                return (
                  <div
                    className={cn(
                      'font-medium',
                      isLowStock ? 'text-status-error' : 'text-text-primary'
                    )}
                  >
                    {formatNumber(row.stockRemaining)}
                    {isLowStock && <span className="ml-1 text-xs">⚠️</span>}
                  </div>
                )
              },
              align: 'right',
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

      {/* Recent Transactions Section */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-status-info/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <ShoppingCart className="h-5 w-5 text-status-info" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('shops.statistics.recentTransactions')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('shops.statistics.recentTransactionsDesc')}
              </p>
            </div>
          </div>
        </div>

        <DataTable
          data={statistics.recentTransactions || mockRecentTransactions}
          columns={[
            {
              id: 'orderNumber',
              header: t('shops.statistics.orderNumber'),
              accessorKey: 'orderNumber',
              cell: ({ row }) => (
                <div className="font-mono text-sm font-medium text-accent">
                  {row.orderNumber}
                </div>
              ),
            },
            {
              id: 'customer',
              header: t('shops.statistics.customer'),
              accessorKey: 'customerName',
              cell: ({ row }) => (
                <div className="font-medium text-text-primary">
                  {row.customerName}
                </div>
              ),
            },
            {
              id: 'date',
              header: t('shops.statistics.date'),
              accessorKey: 'date',
              cell: ({ row }) => {
                const date = new Date(row.date)
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
            {
              id: 'amount',
              header: t('shops.statistics.amount'),
              accessorKey: 'amount',
              cell: ({ row }) => (
                <div className="font-semibold text-text-primary">
                  {formatCurrency(row.amount)}
                </div>
              ),
              align: 'right',
            },
            {
              id: 'paymentMethod',
              header: t('shops.statistics.paymentMethod'),
              accessorKey: 'paymentMethod',
              cell: ({ row }) => (
                <span className="text-sm capitalize text-text-secondary">
                  {row.paymentMethod}
                </span>
              ),
              align: 'center',
            },
            {
              id: 'status',
              header: t('shops.statistics.status'),
              accessorKey: 'status',
              cell: ({ row }) => {
                const statusColors = {
                  completed:
                    'bg-status-success/10 text-status-success border-status-success/30',
                  pending:
                    'bg-status-warning/10 text-status-warning border-status-warning/30',
                  cancelled:
                    'bg-status-error/10 text-status-error border-status-error/30',
                }
                return (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
                      statusColors[row.status]
                    )}
                  >
                    {row.status}
                  </span>
                )
              },
              align: 'center',
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
    </div>
  )
}

export default StatisticsTab
