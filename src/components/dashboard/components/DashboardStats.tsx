// ============================================================================
// FILE: componens/Dashboard/components/DashboardStats.tsx
// Stats Cards Component
// ============================================================================

import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingBag } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  trend: 'up' | 'down'
}

const StatCard = ({ title, value, change, icon, trend }: StatCardProps) => {
  const isPositive = trend === 'up'
  
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-tertiary mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary mb-2">{value}</h3>
          
          {/* Trend */}
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp size={16} className="text-status-success" />
            ) : (
              <TrendingDown size={16} className="text-status-error" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-status-success' : 'text-status-error'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-text-tertiary ml-1">vs last month</span>
          </div>
        </div>
        
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
          {icon}
        </div>
      </div>
    </div>
  )
}

export const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: 12.5,
      icon: <DollarSign size={24} />,
      trend: 'up' as const,
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: 8.2,
      icon: <ShoppingBag size={24} />,
      trend: 'up' as const,
    },
    {
      title: 'Products',
      value: '248',
      change: -3.1,
      icon: <Package size={24} />,
      trend: 'down' as const,
    },
    {
      title: 'Customers',
      value: '892',
      change: 15.8,
      icon: <Users size={24} />,
      trend: 'up' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}