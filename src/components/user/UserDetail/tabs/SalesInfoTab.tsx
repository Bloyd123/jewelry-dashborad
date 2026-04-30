// FILE: src/components/user/UserDetail/tabs/SalesInfoTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, Target, DollarSign, Percent } from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { User } from '@/types/user.types'
import { useGetSalesPersonPerformanceQuery } from '@/store/api/salesApi'
import { useAuth } from '@/hooks/auth'

interface SalesInfoTabProps {
  user: User
}

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

export const SalesInfoTab: React.FC<SalesInfoTabProps> = ({ user }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()

  const { data: performance, isLoading } = useGetSalesPersonPerformanceQuery(
    { shopId: currentShopId, userId: user._id },
    { skip: !currentShopId || !user._id }
  )

  const showSalesFields =
    ['shop_admin', 'manager', 'staff'].includes(user.role) &&
    user.department === 'sales'

  if (!showSalesFields) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4">
        <div className="flex items-center justify-center rounded-md border border-border-primary bg-bg-tertiary p-12">
          <p className="text-center text-sm text-text-secondary">
            {t('user.salesInfoNotApplicable')}
          </p>
        </div>
      </div>
    )
  }

  const totalValue   = performance?.totalValue   || 0
  const totalSales   = performance?.totalSales   || 0
  const averageValue = performance?.averageValue || 0
  const salesTarget  = user.salesTarget          || 0
  const commissionRate = user.commissionRate     || 0
  const commissionsEarned = (totalValue * commissionRate) / 100
  const targetAchievedPct = salesTarget > 0
    ? Math.min(Math.round((totalValue / salesTarget) * 100), 100)
    : 0

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">

      {/* Targets Card */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <Target className="h-5 w-5" />
            {t('userProfile.performance.salesTarget')}
          </CardTitle>
          <CardDescription className="text-text-secondary">
            {t('user.salesInfoDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <Label className="flex items-center gap-1 text-xs text-text-secondary">
                <Target className="h-3 w-3" />
                {t('user.salesTarget')}
              </Label>
              <p className="text-2xl font-bold text-text-primary">
                {formatCurrency(salesTarget)}
              </p>
              <p className="text-xs text-text-tertiary">
                {t('user.salesTargetHelpText')}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <Label className="flex items-center gap-1 text-xs text-text-secondary">
                <Percent className="h-3 w-3" />
                {t('user.commissionRate')}
              </Label>
              <p className="text-2xl font-bold text-accent">
                {commissionRate}%
              </p>
              <p className="text-xs text-text-tertiary">
                {t('user.commissionRateHelpText')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <TrendingUp className="h-5 w-5" />
            {t('userProfile.performance.salesPerformance')}
          </CardTitle>
          <CardDescription className="text-text-secondary">
            {t('userProfile.performance.salesPerformanceDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg border border-border-primary bg-bg-tertiary"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
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

              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <p className="text-sm text-text-secondary">
                  {t('userProfile.performance.dealsCompleted')}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {totalSales.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
                <p className="text-sm text-text-secondary">
                  {t('userProfile.performance.avgDealSize')}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCurrency(Math.round(averageValue))}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SalesInfoTab