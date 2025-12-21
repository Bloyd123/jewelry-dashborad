// ============================================================================
// FILE: src/components/metalrates/QuickInsights.tsx
// Metal Rates Quick Insights Dashboard Component
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
  Download,
  Bell,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Import reusable components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/ui/data-display/StatCard/StatCard'
import { StatCardGrid } from '@/components/ui/data-display/StatCard/StatCardGrid'

// Import mock data
import { mockCurrentRate } from '@/pages/metal-rates/metal-rate.mock'
import type { MetalRate } from '@/types/metalrate.types'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface QuickInsightsProps {
  className?: string
  shopId?: string
}

interface AlertItem {
  id: string
  type: 'success' | 'warning' | 'info'
  message: string
  percentage?: number
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (value: number, currency: string = 'INR'): string => {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
  }
  return `${symbols[currency] || '₹'}${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const calculateVolatility = (
  high: number,
  low: number,
  avg: number
): number => {
  return ((high - low) / avg) * 100
}

// ============================================================================
// QUICKINSIGHTS COMPONENT
// ============================================================================

export const QuickInsights: React.FC<QuickInsightsProps> = ({
  className,
  shopId = 'default-shop',
}) => {
  const { t } = useTranslation()

  // Using mock data (replace with API call later)
  const currentRate: MetalRate = mockCurrentRate

  // Calculate 7-day summary from mock data
  const gold24KAvg = 6425
  const gold24KHigh = 6470
  const gold24KLow = 6380
  const gold24KVolatility = calculateVolatility(
    gold24KHigh,
    gold24KLow,
    gold24KAvg
  )

  const silver999Avg = 82.15
  const silver999High = 83.0
  const silver999Low = 81.5
  const silver999Volatility = calculateVolatility(
    silver999High,
    silver999Low,
    silver999Avg
  )

  // Rate alerts (mock data)
  const alerts: AlertItem[] = [
    {
      id: '1',
      type: 'success',
      message: t('metalRates.quickInsights.rateAlerts.goldUp'),
      percentage: 2.7,
    },
    {
      id: '2',
      type: 'warning',
      message: t('metalRates.quickInsights.rateAlerts.silverDown'),
      percentage: 0.5,
    },
    {
      id: '3',
      type: 'info',
      message: t('metalRates.quickInsights.rateAlerts.platinumStable'),
    },
  ]

  // Quick actions
  const quickActions = [
    {
      id: 'compare',
      label: t('metalRates.quickInsights.quickActions.compareDates'),
      icon: Calendar,
    },
    {
      id: 'analytics',
      label: t('metalRates.quickInsights.quickActions.viewAnalytics'),
      icon: BarChart3,
    },
    {
      id: 'download',
      label: t('metalRates.quickInsights.quickActions.downloadReport'),
      icon: Download,
    },
    {
      id: 'settings',
      label: t('metalRates.quickInsights.quickActions.rateSettings'),
      icon: Bell,
    },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Current Rates - Main Stats */}
      <StatCardGrid columns={4} gap="md" className="overflow-hidden">
        <StatCard
          title={t('metalRates.quickInsights.gold24K')}
          value={formatCurrency(
            currentRate.gold.gold24K.sellingRate,
            currentRate.currency
          )}
          subtitle={t('metalRates.quickInsights.perGram')}
          trend={{
            value: currentRate.changes.goldChangePercentage,
            direction:
              currentRate.changes.goldChange > 0
                ? 'up'
                : currentRate.changes.goldChange < 0
                  ? 'down'
                  : 'neutral',
            label: t('metalRates.quickInsights.thisWeek'),
            showIcon: true,
          }}
          variant="default"
          size="md"
          icon={
            currentRate.changes.goldChange > 0
              ? TrendingUp
              : currentRate.changes.goldChange < 0
                ? TrendingDown
                : Minus
          }
        />

        <StatCard
          title={t('metalRates.quickInsights.gold22K')}
          value={formatCurrency(
            currentRate.gold.gold22K.sellingRate,
            currentRate.currency
          )}
          subtitle={t('metalRates.quickInsights.perGram')}
          trend={{
            value: Number(
              (currentRate.changes.goldChangePercentage * 0.916).toFixed(2)
            ),
            direction:
              currentRate.changes.goldChange > 0
                ? 'up'
                : currentRate.changes.goldChange < 0
                  ? 'down'
                  : 'neutral',
            label: t('metalRates.quickInsights.thisWeek'),
            showIcon: true,
          }}
          variant="default"
          size="md"
        />

        <StatCard
          title={t('metalRates.quickInsights.silver999')}
          value={formatCurrency(
            currentRate.silver.pure.sellingRate,
            currentRate.currency
          )}
          subtitle={t('metalRates.quickInsights.perGram')}
          trend={{
            value: Math.abs(currentRate.changes.silverChangePercentage),
            direction:
              currentRate.changes.silverChange > 0
                ? 'up'
                : currentRate.changes.silverChange < 0
                  ? 'down'
                  : 'neutral',
            label: t('metalRates.quickInsights.thisWeek'),
            showIcon: true,
          }}
          variant="default"
          size="md"
          icon={
            currentRate.changes.silverChange > 0
              ? TrendingUp
              : currentRate.changes.silverChange < 0
                ? TrendingDown
                : Minus
          }
        />

        <StatCard
          title={t('metalRates.quickInsights.platinum950')}
          value={formatCurrency(
            currentRate.platinum.sellingRate,
            currentRate.currency
          )}
          subtitle={t('metalRates.quickInsights.perGram')}
          trend={{
            value: 0,
            direction: 'neutral',
            label: t('metalRates.quickInsights.stable'),
            showIcon: true,
          }}
          variant="default"
          size="md"
        />
      </StatCardGrid>

      {/* 7-Day Summary and Rate Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 7-Day Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <Calendar className="h-5 w-5 text-accent" />
              {t('metalRates.quickInsights.sevenDaySummary.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gold 24K Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-primary">
                {t('metalRates.quickInsights.sevenDaySummary.gold24K')}
              </h4>
              <div className="space-y-1 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.avg7D')}
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(gold24KAvg, currentRate.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.high7D')}
                  </span>
                  <span className="font-medium text-status-success">
                    {formatCurrency(gold24KHigh, currentRate.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.low7D')}
                  </span>
                  <span className="font-medium text-status-error">
                    {formatCurrency(gold24KLow, currentRate.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.volatility')}
                  </span>
                  <span className="font-medium text-text-primary">
                    {gold24KVolatility.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border-secondary" />

            {/* Silver 999 Summary */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-primary">
                {t('metalRates.quickInsights.sevenDaySummary.silver999')}
              </h4>
              <div className="space-y-1 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.avg7D')}
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(silver999Avg, currentRate.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.high7D')}
                  </span>
                  <span className="font-medium text-status-success">
                    {formatCurrency(silver999High, currentRate.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.low7D')}
                  </span>
                  <span className="font-medium text-status-error">
                    {formatCurrency(silver999Low, currentRate.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t('metalRates.quickInsights.sevenDaySummary.volatility')}
                  </span>
                  <span className="font-medium text-text-primary">
                    {silver999Volatility.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <AlertCircle className="h-5 w-5 text-accent" />
              {t('metalRates.quickInsights.rateAlerts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3',
                  alert.type === 'success' &&
                    'bg-status-success/10 border-status-success/30',
                  alert.type === 'warning' &&
                    'bg-status-warning/10 border-status-warning/30',
                  alert.type === 'info' &&
                    'bg-status-info/10 border-status-info/30'
                )}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {alert.type === 'success' && (
                    <div className="h-2 w-2 rounded-full bg-status-success" />
                  )}
                  {alert.type === 'warning' && (
                    <div className="h-2 w-2 rounded-full bg-status-warning" />
                  )}
                  {alert.type === 'info' && (
                    <div className="h-2 w-2 rounded-full bg-status-info" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-text-primary">{alert.message}</p>
                  {alert.percentage !== undefined && (
                    <p className="text-xs text-text-tertiary">
                      {alert.percentage > 0 ? '+' : ''}
                      {alert.percentage}%
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <BarChart3 className="h-5 w-5 text-accent" />
            {t('metalRates.quickInsights.quickActions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border p-4 transition-all',
                    'border-border-primary bg-bg-tertiary',
                    'hover:bg-accent/10 hover:border-accent/50',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
                  )}
                >
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="text-center text-xs font-medium text-text-secondary">
                    {action.label}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

QuickInsights.displayName = 'QuickInsights'
