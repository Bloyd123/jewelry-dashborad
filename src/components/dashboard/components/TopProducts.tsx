// ============================================================================
// FILE: componens/dashboard/components/TopProducts.tsx
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <TrendingUp size={20} className="text-accent" />
            Top Products
          </h3>
          <p className="mt-1 text-sm text-text-tertiary">
            Best selling this month
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.name} className="flex items-center gap-4">
            <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-accent">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {product.name}
              </p>
              <p className="text-xs text-text-tertiary">
                {product.sales} sales
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary">
                {product.revenue}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
