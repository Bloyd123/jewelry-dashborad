// ============================================================================
// FILE: src/pages/customers/CustomerDetailsPage.tsx
// Customer Details Page with Tabbed Interface
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Users, BarChart3 } from 'lucide-react'
import { Tabs, TabsContent } from '@/components/ui/navigation/Tabs'
import { CustomerTable } from '@/components/customer/CustomerTable'
import { CustomerAnalytics } from '@/components/customer/analytics'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hooks'
import type { CustomerStatistics } from '@/components/customer/analytics'
import { useNavigate } from 'react-router-dom'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CustomerDetailsPageProps {
  className?: string
}

// ============================================================================
// MOCK DATA (Replace with actual API data)
// ============================================================================

const MOCK_STATISTICS: CustomerStatistics = {
  totalCustomers: 1247,
  activeCustomers: 892,
  vipCustomers: 156,
  totalOutstanding: 234500,
  totalLoyaltyPoints: 45670,
  avgLifetimeValue: 45230,
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({
  className,
}) => {
  const { t } = useTranslation()

  const navigate = useNavigate()
  // Redux State
  const currentShop = useAppSelector(state => state.shop?.currentShop)

  // Local UI State
  const [activeTab, setActiveTab] = useState('table')
  const [isLoading, setIsLoading] = useState(false)

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleAddCustomer = () => {
    console.log('Add New Customer clicked')
    navigate('/customers/add')
    // TODO: Open add customer modal
  }

  const handleRefreshAnalytics = async () => {
    setIsLoading(true)
    // TODO: Call API to refresh analytics
    setTimeout(() => {
      setIsLoading(false)
      console.log('Analytics refreshed')
    }, 1000)
  }

  // ========================================================================
  // TAB CONFIGURATION
  // ========================================================================

  const tabs = [
    {
      value: 'table',
      label: t('tabs.table'),
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: 'analytics',
      label: t('tabs.analytics'),
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ]

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className={`min-h-screen bg-bg-primary ${className || ''}`}>
      {/* Page Header */}
      <div className="sticky top-0 z-30 border-b border-border-primary bg-bg-secondary shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
                {t('page.title')}
              </h1>
              <p className="mt-1 text-sm text-text-tertiary">
                {t('page.subtitle')}
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleAddCustomer}
              variant="default"
              size="default"
              className="whitespace-nowrap"
              aria-label={t('actions.addNew')}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('actions.addNew')}</span>
              <span className="sm:hidden">{t('actions.add')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tabs
          tabs={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          variant="underline"
          size="md"
          fullWidth={false}
          className="w-full"
        >
          {/* Customer Table Tab */}
          <TabsContent value="table" className="focus-visible:outline-none">
            <div className="mt-4">
              <CustomerTable />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="focus-visible:outline-none">
            <div className="mt-4">
              <CustomerAnalytics
                shopId={currentShop?._id || 'default-shop-id'}
                statistics={MOCK_STATISTICS}
                loading={isLoading}
                onRefresh={handleRefreshAnalytics}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

CustomerDetailsPage.displayName = 'CustomerDetailsPage'
