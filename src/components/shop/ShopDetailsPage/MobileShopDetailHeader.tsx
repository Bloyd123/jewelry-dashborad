// 
// FILE: src/components/shop/ShopDetailsPages/MobileShopDetailHeader.tsx
// Mobile Shop Detail Header Component
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

interface MobileShopDetailHeaderProps {
  shopId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
  // children?: React.ReactNode
}

// 
// MOBILE SHOP DETAIL HEADER COMPONENT
// 

export const MobileShopDetailHeader: React.FC<MobileShopDetailHeaderProps> = ({
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
              {t('shops.common.backToList')}
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

          {/* Shop Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {/* Shop Icon */}
              <div className="bg-accent/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <Store className="h-6 w-6 text-accent" />
              </div>

              {/* Shop Info */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1">
                  <h1 className="truncate text-lg font-bold text-text-primary">
                    {shop.name}
                  </h1>
                  <span className="text-sm text-text-tertiary">
                    ({shop.code})
                  </span>
                </div>

                {/* Badges - Mobile Compact */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant={shop.isActive ? 'active' : 'inactive'}
                    size="sm"
                  >
                    {shop.isActive
                      ? t('shops.common.active')
                      : t('shops.common.inactive')}
                  </Badge>

                  {shop.isVerified && (
                    <Badge variant="success" size="sm">
                      {t('shops.common.verified')}
                    </Badge>
                  )}

                  {shop.shopType && (
                    <Badge variant="retail" size="sm">
                      {t(`shops.shopType.${shop.shopType}`)}
                    </Badge>
                  )}

                  {shop.category && (
                    <Badge variant="outline" size="sm">
                      {t(`shops.shopCategory.${shop.category}`)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info - Mobile Card */}
            <div className="space-y-1.5 rounded-lg bg-bg-primary p-3 text-xs">
              {organizationName && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">
                    {t('shops.organization')}:
                  </span>
                  <span className="font-medium text-text-secondary">
                    {organizationName}
                  </span>
                </div>
              )}

              {shop.address?.city && shop.address?.state && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">
                    {t('shops.location')}:
                  </span>
                  <span className="font-medium text-text-secondary">
                    {shop.address.city}, {shop.address.state}
                  </span>
                </div>
              )}

              {shop.establishedYear && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">
                    {t('shops.established')}:
                  </span>
                  <span className="font-medium text-text-secondary">
                    {shop.establishedYear}
                  </span>
                </div>
              )}
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
            {/* {children} */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default MobileShopDetailHeader
