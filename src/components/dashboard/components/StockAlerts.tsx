// FILE: components/dashboard/components/StockAlerts.tsx

import { AlertTriangle } from 'lucide-react'
import type { Product } from '@/types/product.types'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '@/constants/routePaths'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
// interface LowStockProduct {
//   _id:         string
//   name:        string
//   productCode: string
//   stock: {
//     quantity:     number
//     reorderLevel: number
//     status:       string
//   }
// }

type LowStockProduct = Pick<Product, '_id' | 'name' | 'productCode' | 'stock' | 'pricing' | 'primaryImage' | 'categoryId' | 'subCategoryId'>

interface StockAlertsProps {
  products:  LowStockProduct[]
  isLoading: boolean
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const StockAlerts = ({ products, isLoading }: StockAlertsProps) => {
  const navigate = useNavigate()

  return (
    <div className="card border-l-4 border-status-warning">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-status-warning" />
        <h3 className="text-lg font-semibold text-text-primary">
          Low Stock Alerts
        </h3>
        {!isLoading && products.length > 0 && (
          <span className="ml-auto rounded-full bg-status-warning/10 px-2 py-0.5 text-xs font-medium text-status-warning">
            {products.length}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-bg-secondary" />
          ))
        ) : products.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-tertiary">
            All products are well stocked 🎉
          </p>
        ) : (
          products.slice(0, 5).map(product => (
            <div
              key={product._id}
              className="bg-status-warning/5 rounded-lg p-3"
            >
              <p className="mb-1 text-sm font-medium text-text-primary">
                {product.name}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary">
                  Current: {product.stock.quantity}
                </span>
                <span className="font-medium text-status-warning">
                  Min: {product.stock.reorderLevel ?? 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        className="bg-status-warning/10 hover:bg-status-warning/20 mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-status-warning transition-colors"
        onClick={() => navigate(ROUTE_PATHS.PRODUCTS.LIST)}
      >
        View All Low Stock
      </button>
    </div>
  )
}