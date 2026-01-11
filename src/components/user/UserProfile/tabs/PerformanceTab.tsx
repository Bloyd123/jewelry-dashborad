// FILE: src/pages/UserProfile/tabs/PerformanceTab.tsx
// Performance & Sales Stats Tab Component

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
import { dummyUser } from '@/pages/user/data'

export const PerformanceTab = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatCardGrid columns={2}>
        <StatCard
          title={t('userProfile.performance.salesTarget')}
          value={`₹${(dummyUser.salesTarget / 1000).toFixed(0)}K`}
          icon={Target}
          variant="info"
          trend={{
            value: 12.5,
            direction: 'up',
            label: t('userProfile.performance.vsLastMonth'),
            showIcon: true,
          }}
        />
        <StatCard
          title={t('userProfile.performance.commissionRate')}
          value={`${dummyUser.commissionRate}%`}
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <p className="text-sm text-text-secondary">
                {t('userProfile.performance.totalSales')}
              </p>
              <p className="text-2xl font-bold text-text-primary">₹4,50,000</p>
              <p className="text-xs text-status-success">
                +15% {t('userProfile.performance.vsTarget')}
              </p>
            </div>

            <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <p className="text-sm text-text-secondary">
                {t('userProfile.performance.commissionsEarned')}
              </p>
              <p className="text-2xl font-bold text-text-primary">₹11,250</p>
              <p className="text-xs text-text-tertiary">
                {t('userProfile.performance.thisMonth')}
              </p>
            </div>

            <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <p className="text-sm text-text-secondary">
                {t('userProfile.performance.dealsCompleted')}
              </p>
              <p className="text-2xl font-bold text-text-primary">45</p>
              <p className="text-xs text-status-success">
                +8 {t('userProfile.performance.vsLastMonth')}
              </p>
            </div>

            <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
              <p className="text-sm text-text-secondary">
                {t('userProfile.performance.avgDealSize')}
              </p>
              <p className="text-2xl font-bold text-text-primary">₹10,000</p>
              <p className="text-xs text-text-tertiary">
                {t('userProfile.performance.perTransaction')}
              </p>
            </div>
          </div>
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
          <div className="flex items-center gap-3 rounded-lg border border-border-primary bg-bg-tertiary p-3">
            <div className="bg-status-success/20 flex h-10 w-10 items-center justify-center rounded-full">
              <Award className="h-5 w-5 text-status-success" />
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

          <div className="flex items-center gap-3 rounded-lg border border-border-primary bg-bg-tertiary p-3">
            <div className="bg-status-info/20 flex h-10 w-10 items-center justify-center rounded-full">
              <Target className="h-5 w-5 text-status-info" />
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
        </CardContent>
      </Card>
    </div>
  )
}
