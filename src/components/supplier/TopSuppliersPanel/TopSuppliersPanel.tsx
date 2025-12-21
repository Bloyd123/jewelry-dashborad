// FILE: src/components/supplier/TopSupp// ============================================================================
// FILE: src/components/supplier/TopSuppliersPanel/TopSuppliersPanel.tsx
// Top Suppliers Side Panel Component
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Trophy, TrendingUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dummyTopSuppliers } from '@/pages/suppliers/data'
import type { Supplier } from '@/types/supplier.types'

// ============================================================================
// TYPES
// ============================================================================

export interface TopSuppliersPanelProps {
  limit?: number
  showViewAll?: boolean
  onViewAll?: () => void
  onSupplierClick?: (supplier: Supplier) => void
  className?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(0)}L`
  }
  return `₹${(amount / 1000).toFixed(0)}K`
}

const getRankBadgeColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return 'bg-status-warning/10 text-status-warning border-status-warning/20'
    case 2:
      return 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20'
    case 3:
      return 'bg-status-error/10 text-status-error border-status-error/20'
    default:
      return 'bg-bg-tertiary text-text-secondary border-border-secondary'
  }
}

// ============================================================================
// TOP SUPPLIERS PANEL COMPONENT
// ============================================================================

export const TopSuppliersPanel: React.FC<TopSuppliersPanelProps> = ({
  limit = 5,
  showViewAll = true,
  onViewAll,
  onSupplierClick,
  className,
}) => {
  const { t } = useTranslation()

  // Get top suppliers with limit
  const topSuppliers = React.useMemo(() => {
    return dummyTopSuppliers.slice(0, limit)
  }, [limit])

  return (
    <div
      className={cn(
        'rounded-lg border border-border-primary bg-bg-secondary p-5 shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Trophy className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {t('suppliers.topSuppliers.title')}
            </h3>
            <p className="text-xs text-text-tertiary">
              {t('suppliers.topSuppliers.subtitle')}
            </p>
          </div>
        </div>

        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="hover:text-accent/80 flex items-center gap-1 text-xs font-medium text-accent transition-colors"
          >
            {t('common.viewAll')}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Suppliers List */}
      <div className="space-y-3">
        {topSuppliers.map((supplier, index) => {
          const rank = index + 1

          return (
            <div
              key={supplier._id}
              onClick={() => onSupplierClick?.(supplier)}
              className={cn(
                'group flex items-center gap-3 rounded-md border border-border-secondary bg-bg-primary p-3 transition-all',
                onSupplierClick &&
                  'hover:border-accent/30 cursor-pointer hover:bg-bg-tertiary hover:shadow-sm'
              )}
            >
              {/* Rank Badge */}
              <div
                className={cn(
                  'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border text-xs font-bold',
                  getRankBadgeColor(rank)
                )}
              >
                {rank}
              </div>

              {/* Supplier Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {supplier.displayName || supplier.businessName}
                  </p>
                  {supplier.isPreferred && (
                    <span className="bg-accent/10 flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      {t('suppliers.preferred')}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-text-tertiary">
                  <span>{supplier.supplierCategory}</span>
                  <span>•</span>
                  <span>
                    {supplier.statistics.totalOrders}{' '}
                    {t('suppliers.orders', {
                      count: supplier.statistics.totalOrders,
                    })}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="flex flex-col items-end">
                <p className="text-sm font-bold text-text-primary">
                  {formatCurrency(supplier.statistics.totalPurchased)}
                </p>
                {supplier.rating && (
                  <div className="mt-0.5 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-status-success" />
                    <span className="text-xs text-text-tertiary">
                      {supplier.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {topSuppliers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="mb-2 h-10 w-10 text-text-tertiary opacity-50" />
          <p className="text-sm text-text-secondary">
            {t('suppliers.topSuppliers.noData')}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            {t('suppliers.topSuppliers.noDataDescription')}
          </p>
        </div>
      )}
    </div>
  )
}

TopSuppliersPanel.displayName = 'TopSuppliersPanel'
