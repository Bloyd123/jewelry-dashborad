// ============================================================================
// FILE: src/components/features/Customers/tabs/FinancialTab.tsx
// Financial Information Tab
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Wallet, TrendingUp, CreditCard, AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'
import type { Customer } from '@/types/customer.types'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface FinancialTabProps {
  customerId?: string
}

// ============================================================================
// FINANCIAL TAB COMPONENT
// ============================================================================

export const FinancialTab: React.FC<FinancialTabProps> = ({ customerId }) => {
  const { t } = useTranslation()

  // Get customer data from mock
  const customer: Customer = customerId
    ? MOCK_CUSTOMERS.find(c => c._id === customerId) || MOCK_CUSTOMERS[0]
    : MOCK_CUSTOMERS[0]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      {/* Financial Summary Cards */}
      <StatCardGrid columns={3}>
        <StatCard
          title={t('customerFinancial.totalPurchases')}
          value={`₹${customer.totalPurchases?.toLocaleString() || 0}`}
          icon={TrendingUp}
          variant="success"
          size="md"
        />

        <StatCard
          title={t('customerFinancial.creditLimit')}
          value={`₹${customer.creditLimit?.toLocaleString() || 0}`}
          icon={CreditCard}
          variant="info"
          size="md"
        />

        <StatCard
          title={t('customerFinancial.outstandingBalance')}
          value={`₹${customer.totalDue?.toLocaleString() || 0}`}
          icon={Wallet}
          variant="warning"
          size="md"
        />
      </StatCardGrid>

      {/* Financial Details */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerFinancial.financialDetails')}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Credit Limit */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerFinancial.creditLimit')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              ₹{customer.creditLimit?.toLocaleString() || 0}
            </p>
          </div>

          {/* Total Purchases */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerFinancial.totalPurchases')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              ₹{customer.totalPurchases?.toLocaleString() || 0}
            </p>
          </div>

          {/* Last Purchase Date */}
          {customer.lastPurchaseDate && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('customerFinancial.lastPurchaseDate')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {new Date(customer.lastPurchaseDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Customer Type */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerFinancial.customerType')}
            </Label>
            <Badge variant={customer.customerType as any} size="sm">
              {t(`customers.customerType.${customer.customerType}`)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Payment Terms & Notes */}
      {customer.customerType === 'wholesale' && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-status-info" />
            <div className="flex-1">
              <h4 className="mb-2 text-sm font-semibold text-text-primary">
                {t('customerFinancial.paymentTerms')}
              </h4>
              <p className="text-sm text-text-secondary">
                {t('customerFinancial.wholesalePaymentInfo')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinancialTab
