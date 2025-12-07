// ============================================================================
// FILE: componens/dashboard/components/StockAlerts.tsx
// Low Stock Alerts
// ============================================================================

import { AlertTriangle } from 'lucide-react'

interface StockAlert {
  product: string
  current: number
  minimum: number
}

const alerts: StockAlert[] = [
  { product: 'Gold Chains 18K', current: 5, minimum: 10 },
  { product: 'Silver Rings', current: 8, minimum: 15 },
  { product: 'Diamond Studs', current: 3, minimum: 8 },
]

export const StockAlerts = () => {
  return (
    <div className="card border-l-4 border-status-warning">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-status-warning" />
        <h3 className="text-lg font-semibold text-text-primary">
          Low Stock Alerts
        </h3>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <div
            key={alert.product}
            className="bg-status-warning/5 rounded-lg p-3"
          >
            <p className="mb-1 text-sm font-medium text-text-primary">
              {alert.product}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">
                Current: {alert.current}
              </span>
              <span className="font-medium text-status-warning">
                Min: {alert.minimum}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="bg-status-warning/10 hover:bg-status-warning/20 mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-status-warning transition-colors">
        Restock Items
      </button>
    </div>
  )
}
