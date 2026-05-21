// FILE: src/components/scheme/SchemePage/tabs/AnalyticsTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle }    from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { BarChart }  from '@/components/ui/charts'
import { LineChart } from '@/components/ui/charts'
import { Separator } from '@/components/ui/layout/Separator'
import { useSchemeSpecificAnalytics } from '@/hooks/scheme/useSchemeAnalytics'
import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react'
import type { Scheme } from '@/types/scheme.types'

interface AnalyticsTabProps {
  scheme: Scheme
  shopId: string
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  scheme,
  shopId,
}) => {
  const { t } = useTranslation()

  const { analytics, isLoading } = useSchemeSpecificAnalytics(
    shopId,
    scheme._id
  )

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-text-tertiary" />
        <p className="text-text-secondary">{t('scheme.analytics.noData')}</p>
      </div>
    )
  }

  const enrollmentData = [
    { name: t('scheme.enrollment.active'),    value: analytics.activeEnrollments    },
    { name: t('scheme.enrollment.completed'), value: analytics.completedEnrollments },
    { name: t('scheme.enrollment.cancelled'), value: analytics.cancelledEnrollments },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4">
      {/* Stats */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('scheme.analytics.totalEnrollments')}
          value={analytics.totalEnrollments}
          icon={Users}
          variant="info"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.completionRate')}
          value={`${analytics.completionRate}%`}
          icon={CheckCircle}
          variant="success"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.earlyRedemptionRate')}
          value={`${analytics.earlyRedemptionRate}%`}
          icon={XCircle}
          variant="warning"
          size="md"
        />
        <StatCard
          title={t('scheme.analytics.totalRevenue')}
          value={formatCurrency(analytics.totalRevenue)}
          icon={TrendingUp}
          variant="default"
          size="md"
        />
      </StatCardGrid>

      <Separator spacing="lg" />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            {t('scheme.analytics.enrollmentBreakdown')}
          </h3>
          <BarChart
            data={enrollmentData}
            bars={[{
              dataKey: 'value',
              name:    t('scheme.analytics.enrollments'),
              color:   'var(--accent-color)',
            }]}
            xAxisKey="name"
            height={280}
            showGrid
            showTooltip
            showLegend={false}
          />
        </div>

        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            {t('scheme.analytics.revenueStats')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-bg-tertiary p-4">
              <span className="text-sm text-text-secondary">
                {t('scheme.analytics.totalRevenue')}
              </span>
              <span className="text-base font-bold text-text-primary">
                {formatCurrency(analytics.totalRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-bg-tertiary p-4">
              <span className="text-sm text-text-secondary">
                {t('scheme.analytics.avgCollection')}
              </span>
              <span className="text-base font-bold text-text-primary">
                {formatCurrency(analytics.avgCollectionPerMonth)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-bg-tertiary p-4">
              <span className="text-sm text-text-secondary">
                {t('scheme.analytics.completionRate')}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-bg-primary">
                  <div
                    className="h-full rounded-full bg-status-success"
                    style={{ width: `${analytics.completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-status-success">
                  {analytics.completionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}