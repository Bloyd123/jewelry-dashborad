// FILE: src/components/customer/CustomerPage/DesktopCustomerDetailHeader.tsx
// Desktop Customer Detail Header Component


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
  MapPin,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import type { Customer } from '@/types/customer.types'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'

// COMPONENT PROPS

interface DesktopCustomerDetailHeaderProps {
  customerId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// DESKTOP CUSTOMER DETAIL HEADER COMPONENT

export const DesktopCustomerDetailHeader: React.FC<
  DesktopCustomerDetailHeaderProps
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

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: t('customer.title'),
      onClick: onBackClick,
    },
    {
      label: `${customer.firstName} ${customer.lastName || ''}`.trim(),
    },
  ]

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
    <div className="space-y-4">
      {/* Header Section */}
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-4 px-6 py-4">
          {/* Back Button and Breadcrumb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('customer.common.backToList')}
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('customer.common.settings')}
            </Button>
          </div>

          <Separator />

          {/* Customer Details */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Customer Avatar */}
              <Avatar
                name={fullName}
                size="xl"
                status={customer.isActive ? 'online' : 'offline'}
              />

              {/* Customer Info */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {fullName}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Active Status */}
                    <Badge
                      variant={customer.isActive ? 'active' : 'inactive'}
                      size="sm"
                    >
                      {customer.isActive
                        ? t('customer.common.active')
                        : t('customer.common.inactive')}
                    </Badge>

                    {/* Customer Type */}
                    {customer.customerType && (
                      <Badge variant="default" size="sm">
                        {t(`customer.customerType.${customer.customerType}`)}
                      </Badge>
                    )}

                    {/* Category */}
                    {customer.customerCategory && (
                      <Badge variant="outline" size="sm">
                        {t(
                          `customer.customerCategory.${customer.customerCategory}`
                        )}
                      </Badge>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">
                        {t('customer.phone')}:
                      </span>
                      <span>{customer.phone}</span>
                    </div>

                    {customer.email && (
                      <div className="flex items-center gap-1">
                        <span className="text-text-tertiary">
                          {t('customer.email')}:
                        </span>
                        <span>{customer.email}</span>
                      </div>
                    )}

                    {customer.address?.city && customer.address?.state && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-text-tertiary" />
                        <span>
                          {customer.address.city}, {customer.address.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="flex gap-3">
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('customer.totalPurchases')}
                </p>
                <p className="text-lg font-bold text-text-primary">
                  ₹{customer.totalPurchases?.toLocaleString() || 0}
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('customer.loyaltyPoints')}
                </p>
                <p className="text-lg font-bold text-accent">
                  {customer.loyaltyPoints || 0}
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('customer.orders')}
                </p>
                <p className="text-lg font-bold text-text-primary">
                  {customer.totalPurchases ? '5' : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="md"
          />
        </div>
      </div>
    </div>
  )
}

export default DesktopCustomerDetailHeader
