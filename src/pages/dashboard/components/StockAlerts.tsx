// ============================================================================
// FILE: pages/Dashboard/components/StockAlerts.tsx
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
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={20} className="text-status-warning" />
        <h3 className="text-lg font-semibold text-text-primary">Low Stock Alerts</h3>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.product} className="p-3 bg-status-warning/5 rounded-lg">
            <p className="text-sm font-medium text-text-primary mb-1">{alert.product}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Current: {alert.current}</span>
              <span className="text-status-warning font-medium">Min: {alert.minimum}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-status-warning/10 hover:bg-status-warning/20 text-status-warning rounded-lg text-sm font-medium transition-colors">
        Restock Items
      </button>
    </div>
  )
}