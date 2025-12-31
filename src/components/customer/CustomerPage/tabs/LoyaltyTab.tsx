// ============================================================================
// FILE: src/components/features/Customers/tabs/LoyaltyTab.tsx
// Loyalty Program Tab
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Award, Gift, TrendingUp, Star } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'
import type { Customer } from '@/types/customer.types'

// ============================================================================
// MOCK LOYALTY HISTORY
// ============================================================================

interface LoyaltyTransaction {
  id: string
  date: string
  points: number
  type: 'earned' | 'redeemed'
  description: string
}

const MOCK_LOYALTY_HISTORY: LoyaltyTransaction[] = [
  {
    id: '1',
    date: '2024-12-15',
    points: 450,
    type: 'earned',
    description: 'Purchase of Gold Necklace',
  },
  {
    id: '2',
    date: '2024-11-20',
    points: -200,
    type: 'redeemed',
    description: 'Discount on Purchase',
  },
  {
    id: '3',
    date: '2024-10-10',
    points: 280,
    type: 'earned',
    description: 'Purchase of Diamond Ring',
  },
  {
    id: '4',
    date: '2024-09-05',
    points: 550,
    type: 'earned',
    description: 'Purchase of Gold Chain',
  },
]

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface LoyaltyTabProps {
  customerId?: string
}

// ============================================================================
// LOYALTY TAB COMPONENT
// ============================================================================

export const LoyaltyTab: React.FC<LoyaltyTabProps> = ({ customerId }) => {
  const { t } = useTranslation()

  // Get customer data from mock
  const customer: Customer = customerId
    ? MOCK_CUSTOMERS.find(c => c._id === customerId) || MOCK_CUSTOMERS[0]
    : MOCK_CUSTOMERS[0]

  const totalEarned = MOCK_LOYALTY_HISTORY.filter(
    t => t.type === 'earned'
  ).reduce((sum, t) => sum + t.points, 0)

  const totalRedeemed = Math.abs(
    MOCK_LOYALTY_HISTORY.filter(t => t.type === 'redeemed').reduce(
      (sum, t) => sum + t.points,
      0
    )
  )

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      {/* Loyalty Overview Cards */}
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

      {/* Loyalty History */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerLoyalty.recentActivity')}
        </h3>

        <div className="space-y-3">
          {MOCK_LOYALTY_HISTORY.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-border-secondary bg-bg-primary p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === 'earned'
                      ? 'bg-status-success/10'
                      : 'bg-status-warning/10'
                  }`}
                >
                  {transaction.type === 'earned' ? (
                    <TrendingUp className="h-5 w-5 text-status-success" />
                  ) : (
                    <Gift className="h-5 w-5 text-status-warning" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === 'earned'
                      ? 'text-status-success'
                      : 'text-status-warning'
                  }`}
                >
                  {transaction.points > 0 ? '+' : ''}
                  {transaction.points}
                </p>
                <p className="text-xs text-text-tertiary">
                  {t(`customerLoyalty.${transaction.type}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoyaltyTab
