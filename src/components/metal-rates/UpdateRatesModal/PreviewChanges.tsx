// ============================================================================
// FILE: src/components/features/MetalRates/PreviewChanges.tsx
// Preview Changes - Shows rate changes before saving
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface RateChange {
  metal: string
  oldRate: number
  newRate: number
}

interface PreviewChangesProps {
  changes: RateChange[]
  className?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PreviewChanges: React.FC<PreviewChangesProps> = ({
  changes,
  className,
}) => {
  const { t } = useTranslation()

  // Calculate change details
  const getChangeDetails = (oldRate: number, newRate: number) => {
    const change = newRate - oldRate
    const changePercentage = oldRate > 0 ? (change / oldRate) * 100 : 0
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable'

    return {
      change,
      changePercentage,
      trend,
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Section Header */}
      <div className="pb-2">
        <h3 className="text-base font-semibold text-text-primary">
          {t('metalRates.previewChanges')}
        </h3>
      </div>

      {/* Changes List */}
      <div className="divide-y divide-border-primary rounded-lg border border-border-primary bg-bg-secondary">
        {changes.map((change, index) => {
          const details = getChangeDetails(change.oldRate, change.newRate)

          return (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Metal Name */}
                <div className="min-w-[100px] font-medium text-text-primary">
                  {change.metal}
                </div>

                {/* Rate Change */}
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm text-text-secondary">
                    {formatCurrency(change.oldRate)}
                  </span>
                  <span className="text-text-tertiary">→</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCurrency(change.newRate)}
                  </span>
                </div>

                {/* Change Amount & Percentage */}
                <div
                  className={cn(
                    'flex min-w-[140px] items-center justify-end gap-2',
                    details.trend === 'up' && 'text-status-success',
                    details.trend === 'down' && 'text-status-error',
                    details.trend === 'stable' && 'text-text-tertiary'
                  )}
                >
                  {details.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                  {details.trend === 'down' && (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {details.trend === 'stable' && <Minus className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {details.change > 0 && '+'}
                    {formatCurrency(Math.abs(details.change))}
                  </span>
                  <span className="text-xs">
                    ({formatPercentage(details.changePercentage)})
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-3">
          <div className="mb-1 text-xs text-text-tertiary">
            {t('metalRates.totalChanges')}
          </div>
          <div className="text-lg font-semibold text-text-primary">
            {changes.length}
          </div>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-3">
          <div className="mb-1 text-xs text-text-tertiary">
            {t('metalRates.increased')}
          </div>
          <div className="text-lg font-semibold text-status-success">
            {
              changes.filter(
                c => getChangeDetails(c.oldRate, c.newRate).trend === 'up'
              ).length
            }
          </div>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-3">
          <div className="mb-1 text-xs text-text-tertiary">
            {t('metalRates.decreased')}
          </div>
          <div className="text-lg font-semibold text-status-error">
            {
              changes.filter(
                c => getChangeDetails(c.oldRate, c.newRate).trend === 'down'
              ).length
            }
          </div>
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-3">
          <div className="mb-1 text-xs text-text-tertiary">
            {t('metalRates.unchanged')}
          </div>
          <div className="text-lg font-semibold text-text-tertiary">
            {
              changes.filter(
                c => getChangeDetails(c.oldRate, c.newRate).trend === 'stable'
              ).length
            }
          </div>
        </div>
      </div>
    </div>
  )
}

PreviewChanges.displayName = 'PreviewChanges'

// ============================================================================
// TRANSLATION KEYS
// ============================================================================

/*
{
  "metalRates": {

  }
}
*/
