// FILE: src/components/customer/CustomerPage/tabs/LoyaltyTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Award, Gift, TrendingUp, Star } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import type { Customer } from '@/types/customer.types'
import { useCustomerLoyaltySummary } from '@/hooks/customer'
import { useAuth } from '@/hooks/auth'

interface LoyaltyTabProps {
  customer: Customer
}

export const LoyaltyTab: React.FC<LoyaltyTabProps> = ({ customer }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()

  const { totalEarned, totalRedeemed, recentActivity, isLoading } =
    useCustomerLoyaltySummary(currentShopId!, customer._id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      <StatCardGrid columns={3}>
        <StatCard
          title={t('customerLoyalty.currentPoints')}
          value={customer.loyaltyPoints || 0}
          icon={Award}
          variant="info"
          size="md"
          badge={
            <Badge variant="accent" size="sm">
              {t('customerLoyalty.activeStatus')}
            </Badge>
          }
        />

        <StatCard
          title={t('customerLoyalty.totalEarned')}
          value={totalEarned}
          icon={TrendingUp}
          variant="success"
          size="md"
        />

        <StatCard
          title={t('customerLoyalty.totalRedeemed')}
          value={totalRedeemed}
          icon={Gift}
          variant="warning"
          size="md"
        />
      </StatCardGrid>

      {/* Membership Tier */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-accent/10 flex h-14 w-14 items-center justify-center rounded-full">
              <Star className="h-7 w-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">
                {t('customerLoyalty.membershipTier')}
              </p>
              <p className="text-xl font-bold capitalize text-text-primary">
                {customer.customerCategory || 'Standard'}
              </p>
            </div>
          </div>
          <Badge variant="accent" size="lg">
            {t('customerLoyalty.activeStatus')}
          </Badge>
        </div>
      </div>

      {/* Points Value */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerLoyalty.pointsValue')}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerLoyalty.currentPoints')}
            </Label>
            <p className="text-2xl font-bold text-accent">
              {customer.loyaltyPoints || 0}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerLoyalty.pointsWorth')}
            </Label>
            <p className="text-2xl font-bold text-text-primary">
              ₹{((customer.loyaltyPoints || 0) * 1).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-text-tertiary">
          {t('customerLoyalty.conversionRate')}
        </p>
      </div>

      {/* Recent Activity - REAL DATA */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerLoyalty.recentActivity')}
        </h3>

        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Gift className="mb-3 h-10 w-10 text-text-tertiary" />
            <p className="text-sm text-text-tertiary">
              {t('customerLoyalty.noActivity')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((log: any) => {
              const isEarned = log.action === 'add_loyalty_points'
              return (
                <div
                  key={log._id}
                  className="flex items-center justify-between rounded-lg border border-border-secondary bg-bg-primary p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isEarned
                          ? 'bg-status-success/10'
                          : 'bg-status-warning/10'
                      }`}
                    >
                      {isEarned ? (
                        <TrendingUp className="h-5 w-5 text-status-success" />
                      ) : (
                        <Gift className="h-5 w-5 text-status-warning" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {log.description}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        isEarned
                          ? 'text-status-success'
                          : 'text-status-warning'
                      }`}
                    >
                      {isEarned ? '+' : '-'}
                      {log.metadata?.points || 0}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {t(`customerLoyalty.${isEarned ? 'earned' : 'redeemed'}`)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoyaltyTab