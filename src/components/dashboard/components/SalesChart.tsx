// FILE: components/dashboard/components/SalesChart.tsx

import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '@/constants/routePaths'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface SalesAnalytics {
  totalAmount?:       number
  totalSales?:        number
  averageOrderValue?: number
}

interface SalesChartProps {
  salesAnalytics: SalesAnalytics | null
  isLoading:      boolean
  startDate:      string
  endDate:        string
}

// ─────────────────────────────────────────────
// FORMAT HELPER
// ─────────────────────────────────────────────
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const SalesChart = ({
  salesAnalytics,
  isLoading,
  startDate,
  endDate,
}: SalesChartProps) => {
  const { t }    = useTranslation()
  const navigate = useNavigate()

  const totalRevenue      = salesAnalytics?.totalAmount       || 0
  const totalOrders       = salesAnalytics?.totalSales        || 0
  const averageOrderValue = salesAnalytics?.averageOrderValue || 0

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <BarChart3 size={20} className="text-accent" />
            {t('dashboard.salesChart.title')}
          </h3>
          <p className="mt-1 text-sm text-text-tertiary">
            {startDate} — {endDate}
          </p>
        </div>

        <button
          className="text-sm text-accent hover:underline"
          onClick={() => navigate(ROUTE_PATHS.SALES.LIST)}
        >
          {t('dashboard.salesChart.viewAll')}
        </button>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 animate-pulse rounded bg-bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-bg-secondary p-4">
            <p className="text-xs text-text-tertiary">
              {t('dashboard.salesChart.totalRevenue')}
            </p>
            <p className="mt-1 text-lg font-bold text-text-primary">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="rounded-lg bg-bg-secondary p-4">
            <p className="text-xs text-text-tertiary">
              {t('dashboard.salesChart.totalOrders')}
            </p>
            <p className="mt-1 text-lg font-bold text-text-primary">
              {totalOrders.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="rounded-lg bg-bg-secondary p-4">
            <p className="text-xs text-text-tertiary">
              {t('dashboard.salesChart.avgOrderValue')}
            </p>
            <p className="mt-1 text-lg font-bold text-text-primary">
              {formatCurrency(Math.round(averageOrderValue))}
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 flex items-center justify-between border-t border-border-primary pt-4">
        <div>
          <p className="text-sm text-text-tertiary">
            {t('dashboard.salesChart.totalRevenue')}
          </p>
          {isLoading ? (
            <div className="h-7 w-28 animate-pulse rounded bg-bg-secondary" />
          ) : (
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(totalRevenue)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-text-tertiary">
            {t('dashboard.salesChart.avgOrderValue')}
          </p>
          {isLoading ? (
            <div className="h-7 w-24 animate-pulse rounded bg-bg-secondary" />
          ) : (
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(Math.round(averageOrderValue))}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}