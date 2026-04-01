// FILE: components/dashboard/components/TopProducts.tsx

import { TrendingUp } from 'lucide-react'
import type { TopProduct } from '@/store/api/salesApi'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface TopProductsProps {
  products:  TopProduct[]
  isLoading: boolean
}

// ─────────────────────────────────────────────
// FORMAT HELPER
// ─────────────────────────────────────────────
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`

// ─────────────────────────────────────────────
// METAL TYPE BADGE COLOR
// ─────────────────────────────────────────────
const metalColors: Record<string, string> = {
  gold:     'bg-yellow-100 text-yellow-700',
  silver:   'bg-gray-100 text-gray-600',
  platinum: 'bg-blue-100 text-blue-700',
  diamond:  'bg-purple-100 text-purple-700',
  mixed:    'bg-bg-secondary text-text-tertiary',
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const TopProducts = ({ products, isLoading }: TopProductsProps) => {
  return (
    <div className="card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <TrendingUp size={20} className="text-accent" />
            Top Products
          </h3>
          <p className="mt-1 text-sm text-text-tertiary">
            Best selling this period
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-8 w-8 animate-pulse rounded-full bg-bg-secondary" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 animate-pulse rounded bg-bg-secondary" />
                <div className="h-3 w-20 animate-pulse rounded bg-bg-secondary" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-bg-secondary" />
            </div>
          ))
        ) : products.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-tertiary">
            No sales data available
          </p>
        ) : (
          products.map((product, index) => (
            <div key={`${product.productCode}-${index}`} className="flex items-center gap-4">
              {/* Rank */}
              <div className="bg-accent/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-accent">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {product.productName}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-text-tertiary">
                    {product.totalQuantity} sales
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                      metalColors[product.metalType] || metalColors.mixed
                    }`}
                  >
                    {product.metalType}
                  </span>
                </div>
              </div>

              {/* Revenue */}
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(product.totalRevenue)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}