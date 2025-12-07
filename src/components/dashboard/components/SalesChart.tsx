// ============================================================================
// FILE: componens/dashboard/components/SalesChart.tsx
// Sales Chart Component
// ============================================================================

import { BarChart3 } from 'lucide-react'

export const SalesChart = () => {
  // Dummy data - replace with real data
  const data = [
    { day: 'Mon', sales: 45 },
    { day: 'Tue', sales: 62 },
    { day: 'Wed', sales: 38 },
    { day: 'Thu', sales: 78 },
    { day: 'Fri', sales: 95 },
    { day: 'Sat', sales: 120 },
    { day: 'Sun', sales: 85 },
  ]

  const maxSales = Math.max(...data.map(d => d.sales))

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <BarChart3 size={20} className="text-accent" />
            Sales Overview
          </h3>
          <p className="mt-1 text-sm text-text-tertiary">
            Weekly sales performance
          </p>
        </div>

        <button className="text-sm text-accent hover:underline">
          View All
        </button>
      </div>

      {/* Chart */}
      <div className="space-y-2">
        {data.map(item => (
          <div key={item.day} className="flex items-center gap-3">
            <span className="w-12 text-sm text-text-secondary">{item.day}</span>
            <div className="h-8 flex-1 overflow-hidden rounded-full bg-bg-secondary">
              <div
                className="flex h-full items-center justify-end rounded-full bg-accent px-3"
                style={{ width: `${(item.sales / maxSales) * 100}%` }}
              >
                <span className="text-xs font-medium text-white">
                  ₹{item.sales}k
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center justify-between border-t border-border-primary pt-4">
        <div>
          <p className="text-sm text-text-tertiary">Total This Week</p>
          <p className="text-xl font-bold text-text-primary">₹5,23,000</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-tertiary">Average/Day</p>
          <p className="text-xl font-bold text-text-primary">₹74,714</p>
        </div>
      </div>
    </div>
  )
}
