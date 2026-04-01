// FILE: components/dashboard/components/DashboardStats.tsx

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingBag,
} from 'lucide-react'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Stats {
  totalRevenue:   number
  totalOrders:    number
  totalProducts:  number
  totalCustomers: number
}

interface StatCardProps {
  title:     string
  value:     string
  icon:      React.ReactNode
  isLoading: boolean
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
const StatCard = ({ title, value, icon, isLoading }: StatCardProps) => {
  return (
    <div className="card transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm text-text-tertiary">{title}</p>

          {isLoading ? (
            <div className="mb-2 h-8 w-24 animate-pulse rounded bg-bg-secondary" />
          ) : (
            <h3 className="mb-2 text-2xl font-bold text-text-primary">{value}</h3>
          )}
        </div>

        {/* Icon */}
        <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-lg text-accent">
          {icon}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FORMAT HELPERS
// ─────────────────────────────────────────────
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`

const formatNumber = (num: number) =>
  num.toLocaleString('en-IN')

// ─────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────
interface DashboardStatsProps {
  stats:     Stats
  isLoading: boolean
}

export const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon:  <DollarSign size={24} />,
    },
    {
      title: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      icon:  <ShoppingBag size={24} />,
    },
    {
      title: 'Products',
      value: formatNumber(stats.totalProducts),
      icon:  <Package size={24} />,
    },
    {
      title: 'Customers',
      value: formatNumber(stats.totalCustomers),
      icon:  <Users size={24} />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => (
        <StatCard key={card.title} {...card} isLoading={isLoading} />
      ))}
    </div>
  )
}