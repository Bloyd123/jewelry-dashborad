// 
// FILE: src/components/shop/ShopDetailsPages/DesktopShopDetailHeader.tsx
// Desktop Shop Detail Header Component
// 

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Settings,
  Store,
  ChevronLeft,
  TrendingUp,
  Coins,
  Building2,
  ScrollText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import type { Shop } from '@/types/shop.types'
import { dummyShops } from '@/pages/shops/data'

// 
// COMPONENT PROPS
// 

interface DesktopShopDetailHeaderProps {
  shopId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
  // children?: React.ReactNode
}

// 
// DESKTOP SHOP DETAIL HEADER COMPONENT
// 

export const DesktopShopDetailHeader: React.FC<
  DesktopShopDetailHeaderProps
> = ({
  shopId,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onSettingsClick,
  // children,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Get shop data from dummy data
  const shop: Shop = shopId
    ? dummyShops.find(s => s._id === shopId) || dummyShops[0]
    : dummyShops[0]

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
      label: t('shops.title'),
      onClick: onBackClick,
    },
    {
      label: shop.name,
    },
  ]

  // Tab items
  const tabItems = [
    {
      value: 'overview',
      label: t('shopDetail.tabs.overview'),
      icon: <Store className="h-4 w-4" />,
    },
    {
      value: 'statistics',
      label: t('shopDetail.tabs.statistics'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'bankDetails',
      label: t('shopDetail.tabs.bankDetails'),
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      value: 'logs',
      label: t('shopDetail.tabs.logs'),
      icon: <ScrollText className="h-4 w-4" />,
    },
  ]

  // Get organization name
  const organizationName =
    typeof shop.organizationId === 'object' ? shop.organizationId.name : ''

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
                {t('shops.common.backToList')}
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
              {t('shops.common.settings')}
            </Button>
          </div>

          <Separator />

          {/* Shop Details */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Shop Icon */}
              <div className="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-lg">
                <Store className="h-8 w-8 text-accent" />
              </div>

              {/* Shop Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {shop.name}
                  </h1>
                  <span className="text-text-tertiary">({shop.code})</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Active Status */}
                  <Badge
                    variant={shop.isActive ? 'active' : 'inactive'}
                    size="sm"
                  >
                    {shop.isActive
                      ? t('shops.common.active')
                      : t('shops.common.inactive')}
                  </Badge>

                  {/* Verified Status */}
                  {shop.isVerified && (
                    <Badge variant="success" size="sm">
                      {t('shops.common.verified')}
                    </Badge>
                  )}

                  {/* Shop Type */}
                  {shop.shopType && (
                    <Badge variant="retail" size="sm">
                      {t(`shops.shopType.${shop.shopType}`)}
                    </Badge>
                  )}

                  {/* Category */}
                  {shop.category && (
                    <Badge variant="outline" size="sm">
                      {t(`shops.shopCategory.${shop.category}`)}
                    </Badge>
                  )}
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  {organizationName && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">
                        {t('shops.organization')}:
                      </span>
                      <span>{organizationName}</span>
                    </div>
                  )}

                  {shop.address?.city && shop.address?.state && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">
                        {t('shops.location')}:
                      </span>
                      <span>
                        {shop.address.city}, {shop.address.state}
                      </span>
                    </div>
                  )}

                  {shop.establishedYear && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">
                        {t('shops.established')}:
                      </span>
                      <span>{shop.establishedYear}</span>
                    </div>
                  )}
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
            {/* {children} */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default DesktopShopDetailHeader
