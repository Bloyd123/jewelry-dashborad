// ============================================================================
// FILE: pages/Dashboard/components/TopProducts.tsx
// Top Selling Products
// ============================================================================

import { TrendingUp } from 'lucide-react'

interface Product {
  name: string
  sales: number
  revenue: string
}

const products: Product[] = [
  { name: 'Gold Rings 22K', sales: 145, revenue: '₹6,52,500' },
  { name: 'Diamond Necklace', sales: 89, revenue: '₹11,12,500' },
  { name: 'Silver Chains', sales: 234, revenue: '₹1,98,900' },
  { name: 'Gold Earrings', sales: 176, revenue: '₹5,63,200' },
]

export const TopProducts = () => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <TrendingUp size={20} className="text-accent" />
            Top Products
          </h3>
          <p className="text-sm text-text-tertiary mt-1">Best selling this month</p>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.name} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{product.name}</p>
              <p className="text-xs text-text-tertiary">{product.sales} sales</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary">{product.revenue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}