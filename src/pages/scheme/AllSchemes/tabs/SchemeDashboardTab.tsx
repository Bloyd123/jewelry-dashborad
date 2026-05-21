// FILE: src/pages/scheme/AllSchemes/tabs/SchemeDashboardTab.tsx

import React from 'react'
import { useTranslation }    from 'react-i18next'
import { useNavigate }       from 'react-router-dom'
import {
  Calendar, AlertTriangle, TrendingUp,
  Clock, Users, CheckCircle,
} from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Badge }   from '@/components/ui/data-display/Badge'
import { Button }  from '@/components/ui/button'
import { useSchemeDashboard } from '@/hooks/scheme/useSchemeAnalytics'
import { useDuesToday, useOverdueDues, useMaturingSoon } from '@/hooks/scheme'

interface SchemeDashboardTabProps {
  shopId: string
}

export const SchemeDashboardTab: React.FC<SchemeDashboardTabProps> = ({
  shopId,
}) => {
  const { t }       = useTranslation()
  const navigate    = useNavigate()

  const { dashboard, isLoading } = useSchemeDashboard(shopId)
  const { dues: duesToday }      = useDuesToday(shopId)
  const { dues: overdue }        = useOverdueDues(shopId)
  const { enrollments: maturing } = useMaturingSoon(shopId, 30)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('scheme.dashboard.activeSchemes')}
          value={dashboard?.activeSchemes || 0}
          icon={CheckCircle}
          variant="success"
          size="md"
        />
        <StatCard
          title={t('scheme.dashboard.totalEnrollments')}
          value={dashboard?.totalEnrollments || 0}
          icon={Users}
          variant="info"
          size="md"
        />
        <StatCard
          title={t('scheme.dashboard.duesToday')}
          value={dashboard?.dueCollectionsToday?.count || 0}
          icon={Calendar}
          variant="warning"
          size="md"
          subtitle={`₹${(dashboard?.dueCollectionsToday?.amount || 0).toLocaleString('en-IN')}`}
        />
        <StatCard
          title={t('scheme.dashboard.maturingThisMonth')}
          value={dashboard?.maturingThisMonth?.count || 0}
          icon={TrendingUp}
          variant="default"
          size="md"
        />
      </StatCardGrid>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dues Today */}
        <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-secondary">
          <div className="border-b border-border-primary bg-bg-tertiary/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-status-warning" />
                <h4 className="font-semibold text-text-primary">
                  {t('scheme.dashboard.duesToday')}
                </h4>
              </div>
              <Badge variant="warning" size="sm">
                {duesToday.length}
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-border-secondary">
            {duesToday.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-tertiary">
                {t('scheme.dashboard.noDues')}
              </div>
            ) : (
              duesToday.slice(0, 5).map(due => (
                <div
                  key={due._id}
                  className="flex items-center justify-between p-3 hover:bg-bg-tertiary/30"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {due.customerDetails?.customerName}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {due.enrollmentNumber}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-status-warning">
                    ₹{due.installmentAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
          {duesToday.length > 5 && (
            <div className="border-t border-border-primary p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-accent"
                onClick={() => navigate('/schemes?tab=dues')}
              >
                {t('common.viewAll')} ({duesToday.length})
              </Button>
            </div>
          )}
        </div>

        {/* Overdue */}
        <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-secondary">
          <div className="border-b border-border-primary bg-bg-tertiary/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-error" />
                <h4 className="font-semibold text-text-primary">
                  {t('scheme.dashboard.overdue')}
                </h4>
              </div>
              <Badge variant="error" size="sm">
                {overdue.length}
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-border-secondary">
            {overdue.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-tertiary">
                {t('scheme.dashboard.noOverdue')}
              </div>
            ) : (
              overdue.slice(0, 5).map(due => (
                <div
                  key={due._id}
                  className="flex items-center justify-between p-3 hover:bg-bg-tertiary/30"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {due.customerDetails?.customerName}
                    </p>
                    <p className="text-xs text-status-error">
                      {due.daysOverdue} {t('scheme.dashboard.daysOverdue')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-status-error">
                    ₹{due.installmentAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
          {overdue.length > 5 && (
            <div className="border-t border-border-primary p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-accent"
                onClick={() => navigate('/schemes?tab=overdue')}
              >
                {t('common.viewAll')} ({overdue.length})
              </Button>
            </div>
          )}
        </div>

        {/* Maturing Soon */}
        <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-secondary">
          <div className="border-b border-border-primary bg-bg-tertiary/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-status-info" />
                <h4 className="font-semibold text-text-primary">
                  {t('scheme.dashboard.maturingSoon')}
                </h4>
              </div>
              <Badge variant="info" size="sm">
                {maturing.length}
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-border-secondary">
            {maturing.length === 0 ? (
              <div className="p-4 text-center text-sm text-text-tertiary">
                {t('scheme.dashboard.noMaturing')}
              </div>
            ) : (
              maturing.slice(0, 5).map(enrollment => (
                <div
                  key={enrollment._id}
                  className="flex items-center justify-between p-3 hover:bg-bg-tertiary/30"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {enrollment.customerDetails?.customerName}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {enrollment.enrollmentNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-status-info">
                      ₹{enrollment.maturity?.totalMaturityValue?.toLocaleString('en-IN') || 0}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(enrollment.maturityDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          {maturing.length > 5 && (
            <div className="border-t border-border-primary p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-accent"
                onClick={() => navigate('/schemes?tab=maturing')}
              >
                {t('common.viewAll')} ({maturing.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Enrollments */}
      {dashboard?.recentEnrollments && dashboard.recentEnrollments.length > 0 && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary">
          <div className="border-b border-border-primary p-4">
            <h4 className="font-semibold text-text-primary">
              {t('scheme.dashboard.recentEnrollments')}
            </h4>
          </div>
          <div className="divide-y divide-border-secondary">
            {dashboard.recentEnrollments.map(enrollment => {
              const customer = enrollment.customerId as any
              const scheme   = enrollment.schemeId as any
              return (
                <div
                  key={enrollment._id}
                  className="flex items-center justify-between p-4 hover:bg-bg-tertiary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {customer?.firstName} {customer?.lastName || ''}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {scheme?.schemeName} • {enrollment.enrollmentNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      ₹{enrollment.installmentAmount?.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-text-tertiary">
                        /{t('scheme.dashboard.month')}
                      </span>
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(enrollment.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}