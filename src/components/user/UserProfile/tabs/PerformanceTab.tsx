// FILE: src/pages/UserProfile/tabs/PerformanceTab.tsx

import { useTranslation } from 'react-i18next'
import { TrendingUp, Target, DollarSign, Award } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatCard } from '@/components/ui/data-display/StatCard/StatCard'
import { StatCardGrid } from '@/components/ui/data-display/StatCard/StatCardGrid'
import { useAppSelector } from '@/store/hooks'
import { selectUserProfile } from '@/store/slices/userSlice'
import { useGetSalesPersonPerformanceQuery } from '@/store/api/salesApi'
import { useAuth } from '@/hooks/auth'

// ─────────────────────────────────────────────
// FORMAT HELPERS
// ─────────────────────────────────────────────
const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const PerformanceTab = () => {
  const { t }           = useTranslation()
  const user            = useAppSelector(selectUserProfile)
  const { currentShopId } = useAuth()

  // ── Sales Performance Data ────────────────
  const {
    data:      performance,
    isLoading: isPerfLoading,
  } = useGetSalesPersonPerformanceQuery(
    {
      shopId: currentShopId,
      userId: user?._id || '',
    },
    { skip: !currentShopId || !user?._id }
  )

  // ── Computed Values ───────────────────────
  const totalValue    = performance?.totalValue    || 0
  const totalSales    = performance?.totalSales    || 0
  const averageValue  = performance?.averageValue  || 0
  const commissionRate = user?.commissionRate      || 0
  const salesTarget   = user?.salesTarget          || 0

  // Commission = totalValue * commissionRate / 100
  const commissionsEarned = (totalValue * commissionRate) / 100

  // Target achievement percentage
  const targetAchievedPct = salesTarget > 0
    ? Math.min(Math.round((totalValue / salesTarget) * 100), 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatCardGrid columns={2}>
        <StatCard
          title={t('userProfile.performance.salesTarget')}
          value={formatCurrency(salesTarget)}
          icon={Target}
          variant="info"
          trend={{
            value:     targetAchievedPct,
            direction: targetAchievedPct >= 100 ? 'up' : 'down',
            label:     t('userProfile.performance.vsTarget'),
            showIcon:  true,
          }}
        />
        <StatCard
          title={t('userProfile.performance.commissionRate')}
          value={`${commissionRate}%`}
          icon={DollarSign}
          variant="success"
        />
      </StatCardGrid>

      {/* Performance Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="mr-2 inline h-5 w-5" />
            {t('userProfile.performance.salesPerformance')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.performance.salesPerformanceDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPerfLoading ? (
            // ── Loading Skeleton ─────────────
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg border border-border-primary bg-bg-secondary"
                />
              ))}
            </div>
          ) : (
            // ── Real Data ────────────────────
            <div className="grid gap-4 md:grid-cols-2">
              {/* Total Sales Revenue */}
              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <p className="text-sm text-text-secondary">
                  {t('userProfile.performance.totalSales')}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCurrency(totalValue)}
                </p>
                {salesTarget > 0 && (
                  <p className={`text-xs ${targetAchievedPct >= 100 ? 'text-status-success' : 'text-status-warning'}`}>
                    {targetAchievedPct}% {t('userProfile.performance.vsTarget')}
                  </p>
                )}
              </div>

              {/* Commissions Earned */}
              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <p className="text-sm text-text-secondary">
                  {t('userProfile.performance.commissionsEarned')}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCurrency(Math.round(commissionsEarned))}
                </p>
                <p className="text-xs text-text-tertiary">
                  {commissionRate}% {t('userProfile.performance.ofRevenue')}
                </p>
              </div>

              {/* Deals Completed */}
              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <p className="text-sm text-text-secondary">
                  {t('userProfile.performance.dealsCompleted')}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {totalSales.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.performance.totalTransactions')}
                </p>
              </div>

              {/* Avg Deal Size */}
              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <p className="text-sm text-text-secondary">
                  {t('userProfile.performance.avgDealSize')}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCurrency(Math.round(averageValue))}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.performance.perTransaction')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Award className="mr-2 inline h-5 w-5" />
            {t('userProfile.performance.achievements')}
          </CardTitle>
          <CardDescription>
            {t('userProfile.performance.achievementsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Target Achieved Badge */}
          {targetAchievedPct >= 100 && (
            <div className="flex items-center gap-3 rounded-lg border border-border-primary bg-bg-tertiary p-3">
              <div className="bg-status-success/20 flex h-10 w-10 items-center justify-center rounded-full">
                <Award className="h-5 w-5 text-status-success" />
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {t('userProfile.performance.targetAchieved')}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.performance.targetAchievedDesc')}
                </p>
              </div>
            </div>
          )}

          {/* Top Performer Badge — 50+ deals */}
          {totalSales >= 50 && (
            <div className="flex items-center gap-3 rounded-lg border border-border-primary bg-bg-tertiary p-3">
              <div className="bg-status-info/20 flex h-10 w-10 items-center justify-center rounded-full">
                <Target className="h-5 w-5 text-status-info" />
              </div>
              <div>
                <p className="font-medium text-text-primary">
                  {t('userProfile.performance.topPerformer')}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.performance.topPerformerDesc')}
                </p>
              </div>
            </div>
          )}

          {/* No achievements yet */}
          {targetAchievedPct < 100 && totalSales < 50 && !isPerfLoading && (
            <p className="py-4 text-center text-sm text-text-tertiary">
              {t('userProfile.performance.noAchievementsYet')}
            </p>
          )}

          {/* Loading state */}
          {isPerfLoading && (
            <div className="h-16 animate-pulse rounded-lg bg-bg-secondary" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}