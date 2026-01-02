// FILE: src/components/customer/CustomerPage/MobileCustomerDetailHeader.tsx
// Mobile Customer Detail Header Component

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Settings,
  User,
  ChevronLeft,
  TrendingUp,
  Wallet,
  FileText,
  Award,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import type { Customer } from '@/types/customer.types'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'

// COMPONENT PROPS

interface MobileCustomerDetailHeaderProps {
  customerId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// MOBILE CUSTOMER DETAIL HEADER COMPONENT

export const MobileCustomerDetailHeader: React.FC<
  MobileCustomerDetailHeaderProps
> = ({
  customerId,
  activeTab = 'personal',
  onTabChange,
  onBackClick,
  onSettingsClick,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Get customer data from mock data
  const customer: Customer = customerId
    ? MOCK_CUSTOMERS.find(c => c._id === customerId) || MOCK_CUSTOMERS[0]
    : MOCK_CUSTOMERS[0]

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // Tab items
  const tabItems = [
    {
      value: 'personal',
      label: t('customerDetail.tabs.personal'),
      icon: <User className="h-4 w-4" />,
    },
    {
      value: 'financial',
      label: t('customerDetail.tabs.financial'),
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      value: 'orders',
      label: t('customerDetail.tabs.orders'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'loyalty',
      label: t('customerDetail.tabs.loyalty'),
      icon: <Award className="h-4 w-4" />,
    },
    {
      value: 'documents',
      label: t('customerDetail.tabs.documents'),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: 'activity',
      label: t('customerDetail.tabs.activity'),
      icon: <Activity className="h-4 w-4" />,
    },
  ]

  // Get customer full name
  const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim()

  return (
    <div className="space-y-0">
      {/* Header Section */}
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-3 px-4 py-3">
          {/* Back Button and Settings */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="gap-2 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('customer.common.backToList')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {/* Customer Avatar */}
              <Avatar
                name={fullName}
                size="lg"
                status={customer.isActive ? 'online' : 'offline'}
              />

              {/* Customer Info */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1">
                  <h1 className="truncate text-lg font-bold text-text-primary">
                    {fullName}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-text-tertiary">
                    <span>{customer.phone}</span>
                    {customer.email && (
                      <>
                        <span>•</span>
                        <span className="truncate">{customer.email}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badges - Mobile Compact */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant={customer.isActive ? 'active' : 'inactive'}
                    size="sm"
                  >
                    {customer.isActive
                      ? t('customer.common.active')
                      : t('customer.common.inactive')}
                  </Badge>

                  {customer.customerType && (
                    <Badge variant="default" size="sm">
                      {t(`customer.customerType.${customer.customerType}`)}
                    </Badge>
                  )}

                  {customer.customerCategory && (
                    <Badge variant="outline" size="sm">
                      {t(
                        `customer.customerCategory.${customer.customerCategory}`
                      )}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats - Mobile Card */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-bg-primary p-2 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('customer.totalPurchases')}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  ₹{customer.totalPurchases?.toLocaleString() || 0}
                </p>
              </div>

              <div className="rounded-lg bg-bg-primary p-2 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('customer.loyaltyPoints')}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {customer.loyaltyPoints || 0}
                </p>
              </div>

              <div className="rounded-lg bg-bg-primary p-2 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('customer.orders')}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {customer.totalPurchases ? '5' : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile Scrollable */}
        <div className="overflow-x-auto px-4">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}

export default MobileCustomerDetailHeader
