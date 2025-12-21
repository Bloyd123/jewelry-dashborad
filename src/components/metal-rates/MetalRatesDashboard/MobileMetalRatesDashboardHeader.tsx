// ============================================================================
// FILE: src/components/features/MetalRates/MobileMetalRatesDashboardHeader.tsx
// Mobile Metal Rates Dashboard Header with Tabs and Shop Info
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  Coins,
  Calendar,
  TrendingUp,
  History,
  Zap,
  RefreshCw,
  Check,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { UpdateRatesModal } from '@/components/metal-rates/UpdateRatesModal/UpdateRatesModal'
import { CompareRatesModal } from '@/components/metal-rates/CompareRates'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface MobileMetalRatesDashboardHeaderProps {
  shopId?: string
  shopName?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  lastUpdated?: string
  updatedBy?: string
  isActive?: boolean
  children?: React.ReactNode
}

// ============================================================================
// MOBILE METAL RATES DASHBOARD HEADER COMPONENT
// ============================================================================

export const MobileMetalRatesDashboardHeader: React.FC<
  MobileMetalRatesDashboardHeaderProps
> = ({
  shopId,
  shopName = 'Main Showroom',
  activeTab = 'currentRates',
  onTabChange,
  onBackClick,
  lastUpdated = '15 Dec 2024, 10:30 AM',
  updatedBy = 'Rajesh Kumar',
  isActive = true,
  children,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // Handle update rates - opens modal
  const handleUpdateRates = () => {
    setIsModalOpen(true)
  }

  // Handle save rates
  const handleSaveRates = (data: any) => {
    console.log('Saving rates data:', data)
    // TODO: Call API to save rates
  }

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: t('shops.title'),
      onClick: onBackClick,
    },
    {
      label: shopName,
      onClick: onBackClick,
    },
    {
      label: t('metalRates.title'),
    },
  ]

  // Tab items
  const tabItems = [
    {
      value: 'currentRates',
      label: t('metalRates.tabs.currentRates'),
      icon: <Coins className="h-4 w-4" />,
    },
    {
      value: 'trendChart',
      label: t('metalRates.tabs.trendCharts'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'rateHistory',
      label: t('metalRates.tabs.rateHistory'),
      icon: <History className="h-4 w-4" />,
    },
    {
      value: 'quickInsights',
      label: t('metalRates.tabs.quickInsights'),
      icon: <Zap className="h-4 w-4" />,
    },
  ]

  return (
    <>
      <div className="space-y-0">
        {/* Header Section */}
        <div className="border-b border-border-secondary bg-bg-secondary">
          <div className="space-y-3 px-4 py-3">
            {/* Back Button */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('common.backToList')}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCompareOpen(true)}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpdateRates}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('metalRates.updateRates')}
                </Button>
              </div>
            </div>

            {/* Metal Rates Dashboard Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="bg-accent/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <Coins className="h-6 w-6 text-accent" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="truncate text-lg font-bold text-text-primary">
                      {t('metalRates.dashboard')}
                    </h1>
                    {isActive && (
                      <Badge
                        variant="active"
                        size="sm"
                        className="flex-shrink-0 gap-1"
                      >
                        <Check className="h-3 w-3" />
                        {t('common.active')}
                      </Badge>
                    )}
                  </div>

                  {/* Shop Name */}
                  <div className="text-sm text-text-secondary">
                    <span className="font-medium">{shopName}</span>
                  </div>
                </div>
              </div>

              {/* Last Updated Info - Mobile Compact */}
              <div className="space-y-1 rounded-lg bg-bg-primary p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">
                    {t('metalRates.lastUpdated')}
                  </span>
                  <span className="font-medium text-text-secondary">
                    {lastUpdated}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">{t('common.by')}</span>
                  <span className="font-medium text-text-secondary">
                    {updatedBy}
                  </span>
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
            >
              {children}
            </Tabs>
          </div>
        </div>
      </div>

      {/* Update Rates Modal */}
      <UpdateRatesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        shopName={shopName}
        onSave={handleSaveRates}
      />

      {/* Compare Rates Modal */}
      <CompareRatesModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        shopId={shopId || ''}
      />
    </>
  )
}

export default MobileMetalRatesDashboardHeader
