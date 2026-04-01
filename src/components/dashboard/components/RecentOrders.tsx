// FILE: components/dashboard/components/RecentOrders.tsx

import { Package, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS, buildRoute } from '@/constants/routePaths'
import type { Sale } from '@/types/sale.types'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface RecentOrdersProps {
  orders:    Sale[]
  isLoading: boolean
}

// ─────────────────────────────────────────────
// STATUS COLORS
// ─────────────────────────────────────────────
const statusColors: Record<string, string> = {
  completed: 'bg-status-success/10 text-status-success',
  pending:   'bg-status-warning/10 text-status-warning',
  confirmed: 'bg-status-info/10 text-status-info',
  delivered: 'bg-status-info/10 text-status-info',
  cancelled: 'bg-status-error/10 text-status-error',
  returned:  'bg-status-error/10 text-status-error',
  draft:     'bg-bg-tertiary text-text-tertiary',
}

// ─────────────────────────────────────────────
// FORMAT HELPERS
// ─────────────────────────────────────────────
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now  = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (hours < 1)   return 'Just now'
  if (hours < 24)  return `${hours} hour${hours > 1 ? 's' : ''} ago`

  const days = Math.floor(hours / 24)
  if (days < 7)    return `${days} day${days > 1 ? 's' : ''} ago`

  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

// ─────────────────────────────────────────────
// SKELETON ROW
// ─────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-border-primary">
    {[1, 2, 3, 4, 5, 6, 7].map(i => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 animate-pulse rounded bg-bg-secondary" />
      </td>
    ))}
  </tr>
)

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const RecentOrders = ({ orders, isLoading }: RecentOrdersProps) => {
  const navigate = useNavigate()

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Package size={20} className="text-accent" />
            Recent Orders
          </h3>
          <p className="mt-1 text-sm text-text-tertiary">Latest transactions</p>
        </div>

        <button
          className="text-sm text-accent hover:underline"
          onClick={() => navigate(ROUTE_PATHS.SALES.LIST)}
        >
          View All Orders
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-primary">
              {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date', 'Action'].map(
                col => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-sm font-semibold text-text-secondary"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-text-tertiary">
                  No recent orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr
                  key={order._id}
                  className="border-b border-border-primary transition-colors hover:bg-bg-secondary"
                >
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">
                    {order.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {order.customerDetails?.customerName || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {order.items?.[0]?.productName || '—'}
                    {order.items?.length > 1 && (
                      <span className="ml-1 text-xs text-text-tertiary">
                        +{order.items.length - 1} more
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-text-primary">
                    {formatCurrency(order.financials?.grandTotal || 0)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[order.status] || statusColors.draft
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-tertiary">
                    {formatDate(order.saleDate)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="rounded p-1.5 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-accent"
                      onClick={() => navigate(buildRoute.sale.detail(order._id))}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}