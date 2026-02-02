// FILE: components/dashboard/pages/Dashboard.tsx
// Dashboard

import { DashboardStats } from '../components/DashboardStats'
import { SalesChart } from '../components/SalesChart'
import { RecentOrders } from '../components/RecentOrders'
import { QuickActions } from '../components/QuickActions'
import { StockAlerts } from '../components/StockAlerts'
import { TopProducts } from '../components/TopProducts'
import { useAuth } from '@/hooks/auth'
export const Dashboard = () => {
   const { currentShopId } = useAuth()
     console.log('Current Shop ID:', currentShopId)
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-text-secondary">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Date Range Selector */}
        <select className="input max-w-xs">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesChart />
        <TopProducts />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Takes 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Right Column - Takes 1/3 */}
        <div className="space-y-6">
          <QuickActions />
          <StockAlerts />
        </div>
      </div>
    </div>
  )
}
