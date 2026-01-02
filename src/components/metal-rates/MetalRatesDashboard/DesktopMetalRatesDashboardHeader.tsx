
// FILE: src/components/metal-rates/MetalRatesDashboard/DesktopMetalRatesDashboardHeader.tsx
// Desktop Metal Rates Dashboard Header with Tabs and Shop Info

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

interface DesktopMetalRatesDashboardHeaderProps {
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

// DESKTOP METAL RATES DASHBOARD HEADER COMPONENT

export const DesktopMetalRatesDashboardHeader: React.FC<
  DesktopMetalRatesDashboardHeaderProps
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
                  {t('metalRates.common.backToList')}
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Breadcrumb items={breadcrumbItems} showHome={true} />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCompareOpen(true)}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  {t('metalRates.compareRates')}
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

            <Separator />

            {/* Metal Rates Dashboard Info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-lg">
                  <Coins className="h-8 w-8 text-accent" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {t('metalRates.dashboard')}
                    </h1>
                  </div>

                  {/* Last Updated Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="text-text-tertiary">
                        {t('metalRates.lastUpdated')}:
                      </span>
                      <span className="font-medium">{lastUpdated}</span>
                      <span className="text-text-tertiary">
                        {t('metalRates.common.by')}
                      </span>
                      <span className="font-medium">{updatedBy}</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Active Status */}
                    {isActive && (
                      <Badge variant="active" size="sm" className="gap-1">
                        <Check className="h-3 w-3" />
                        {t('common.active')}
                      </Badge>
                    )}

                    {/* View Trends Badge */}
                    <Badge variant="info" size="sm" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {t('metalRates.viewTrends')}
                    </Badge>
                  </div>
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

export default DesktopMetalRatesDashboardHeader
