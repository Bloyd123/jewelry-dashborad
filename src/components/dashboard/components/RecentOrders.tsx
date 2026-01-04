// FILE: componens/dashboard/components/RecentOrders.tsx
// Recent Orders Table

import { Package, Eye } from 'lucide-react'

interface Order {
  id: string
  customer: string
  product: string
  amount: string
  status: 'completed' | 'pending' | 'processing'
  date: string
}

const orders: Order[] = [
  {
    id: '#ORD-001',
    customer: 'John Doe',
    product: 'Gold Ring 22K',
    amount: '₹45,000',
    status: 'completed',
    date: '2 hours ago',
  },
  {
    id: '#ORD-002',
    customer: 'Jane Smith',
    product: 'Diamond Necklace',
    amount: '₹1,25,000',
    status: 'processing',
    date: '5 hours ago',
  },
  {
    id: '#ORD-003',
    customer: 'Mike Johnson',
    product: 'Silver Chain',
    amount: '₹8,500',
    status: 'pending',
    date: '1 day ago',
  },
  {
    id: '#ORD-004',
    customer: 'Sarah Williams',
    product: 'Gold Earrings',
    amount: '₹32,000',
    status: 'completed',
    date: '1 day ago',
  },
]

const statusColors = {
  completed: 'bg-status-success/10 text-status-success',
  pending: 'bg-status-warning/10 text-status-warning',
  processing: 'bg-status-info/10 text-status-info',
}

export const RecentOrders = () => {
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

        <button className="text-sm text-accent hover:underline">
          View All Orders
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-primary">
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr
                key={order.id}
                className="border-b border-border-primary transition-colors hover:bg-bg-secondary"
              >
                <td className="px-4 py-3 text-sm font-medium text-text-primary">
                  {order.id}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {order.customer}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {order.product}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-text-primary">
                  {order.amount}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-tertiary">
                  {order.date}
                </td>
                <td className="px-4 py-3">
                  <button className="rounded p-1.5 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-accent">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
