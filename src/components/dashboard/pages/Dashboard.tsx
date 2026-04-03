// FILE: components/dashboard/pages/Dashboard.tsx

import { useState } from 'react'
import { DashboardStats } from '../components/DashboardStats'
import { SalesChart } from '../components/SalesChart'
import { RecentOrders } from '../components/RecentOrders'
import { QuickActions } from '../components/QuickActions'
import { StockAlerts } from '../components/StockAlerts'
import { TopProducts } from '../components/TopProducts'
import { useAuth } from '@/hooks/auth'
import { useDashboard } from '@/hooks/dashboard/Dashboard'
import { useTranslation } from 'react-i18next'

// ─────────────────────────────────────────────
// Date range options
// ─────────────────────────────────────────────
const getDateRange = (range: string) => {
  const endDate   = new Date()
  const startDate = new Date()

  switch (range) {
    case '7':   startDate.setDate(endDate.getDate() - 7);   break
    case '30':  startDate.setDate(endDate.getDate() - 30);  break
    case '90':  startDate.setDate(endDate.getDate() - 90);  break
    case '365': startDate.setDate(endDate.getDate() - 365); break
    default:    startDate.setDate(endDate.getDate() - 7);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate:   endDate.toISOString().split('T')[0],
  }
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const Dashboard = () => {
    const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const [selectedRange, setSelectedRange] = useState('7')

  const { startDate, endDate } = getDateRange(selectedRange)

const dashboard = useDashboard(currentShopId ?? '', {
    startDate,
    endDate,
    groupBy: 'day',
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{t('dashboard.title')}</h1>
          <p className="mt-1 text-text-secondary">
       {t('dashboard.welcomeMessage')}
          </p>
        </div>

        {/* Date Range Selector */}
        <select
          className="input max-w-xs"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="7">{t('dashboard.dateRange.last7Days')}</option>
          <option value="30">{t('dashboard.dateRange.last30Days')}</option>
          <option value="90">{t('dashboard.dateRange.last3Months')}</option>
          <option value="365">{t('dashboard.dateRange.lastYear')}</option>
        </select>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        stats={dashboard.stats}
        isLoading={dashboard.isSalesAnalyticsLoading || dashboard.isCustomerAnalyticsLoading || dashboard.isProductAnalyticsLoading}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesChart
          salesAnalytics={dashboard.salesAnalytics}
          isLoading={dashboard.isSalesAnalyticsLoading}
          startDate={startDate}
          endDate={endDate}
        />
        <TopProducts
          products={dashboard.topProducts}
          isLoading={dashboard.isTopProductsLoading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Takes 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          <RecentOrders
            orders={dashboard.recentOrders}
            isLoading={dashboard.isRecentOrdersLoading}
          />
        </div>

        {/* Right Column - Takes 1/3 */}
        <div className="space-y-6">
          <QuickActions />
          <StockAlerts
            products={dashboard.lowStockProducts}
            isLoading={dashboard.isLowStockLoading}
          />
        </div>
      </div>
    </div>
  )
}