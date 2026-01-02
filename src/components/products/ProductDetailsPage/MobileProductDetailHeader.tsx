
// FILE: src/components/products/ProductDetailsPage/MobileProductDetailHeader.tsx
// Mobile Product Detail Header Component


import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Settings,
  Package,
  ChevronLeft,
  Info,
  TrendingUp,
  History,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import type { Product } from '@/types/product.types'
import { dummyProducts } from '@/pages/product/mock.data'


// COMPONENT PROPS


interface MobileProductDetailHeaderProps {
  productId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// MOBILE PRODUCT DETAIL HEADER COMPONENT

export const MobileProductDetailHeader: React.FC<
  MobileProductDetailHeaderProps
> = ({
  productId,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onSettingsClick,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Get product data from dummy data
  const product: Product = productId
    ? dummyProducts.find(p => p._id === productId) || dummyProducts[0]
    : dummyProducts[0]

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
      label: t('product.title'),
      onClick: onBackClick,
    },
    {
      label: product.name,
    },
  ]

  // Tab items
  const tabItems = [
    {
      value: 'overview',
      label: t('product.productDetail.tabs.overview'),
      icon: <Info className="h-4 w-4" />,
    },
    {
      value: 'pricing',
      label: t('product.productDetail.tabs.pricing'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'images',
      label: t('product.productDetail.tabs.images'),
      icon: <ImageIcon className="h-4 w-4" />,
    },
    {
      value: 'history',
      label: t('product.productDetail.tabs.history'),
      icon: <History className="h-4 w-4" />,
    },
  ]

  // Get category name
  const categoryName =
    typeof product.categoryId === 'object'
      ? product.categoryId.name.default
      : ''

  // Get metal display
  const metalDisplay = `${product.metal.purity} ${product.metal.type.charAt(0).toUpperCase() + product.metal.type.slice(1)}`

  // Get status badge variant
  const getStatusVariant = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'in_stock':
        return 'success'
      case 'low_stock':
        return 'warning'
      case 'out_of_stock':
        return 'error'
      default:
        return 'default'
    }
  }

  const getSaleStatusVariant = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'available':
        return 'success'
      case 'reserved':
        return 'warning'
      case 'sold':
        return 'info'
      default:
        return 'default'
    }
  }

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
              {t('product.common.backToList')}
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

          {/* Product Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {/* Product Image */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg-tertiary">
                {product.primaryImage ? (
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-text-tertiary" />
                )}
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1">
                  <h1 className="truncate text-lg font-bold text-text-primary">
                    {product.name}
                  </h1>
                  <span className="text-sm text-text-tertiary">
                    ({product.productCode})
                  </span>
                </div>

                {/* Badges - Mobile Compact */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={getStatusVariant(product.status)} size="sm">
                    {t(`product.status.${product.status}`)}
                  </Badge>

                  <Badge
                    variant={getSaleStatusVariant(product.saleStatus)}
                    size="sm"
                  >
                    {t(`product.saleStatus.${product.saleStatus}`)}
                  </Badge>

                  {product.isFeatured && (
                    <Badge variant="info" size="sm">
                      {t('product.common.featured')}
                    </Badge>
                  )}

                  {product.isNewArrival && (
                    <Badge variant="success" size="sm">
                      {t('product.common.new')}
                    </Badge>
                  )}

                  {product.isBestseller && (
                    <Badge variant="warning" size="sm">
                      {t('product.common.bestseller')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info - Mobile Card */}
            <div className="space-y-1.5 rounded-lg bg-bg-primary p-3 text-xs">
              {categoryName && (
                <div className="flex items-center justify-between">
                  <span className="text-text-tertiary">
                    {t('product.category')}:
                  </span>
                  <span className="font-medium text-text-secondary">
                    {categoryName}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">
                  {t('product.metal')}:
                </span>
                <span className="font-medium text-text-secondary">
                  {metalDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">
                  {t('product.weight')}:
                </span>
                <span className="font-medium text-text-secondary">
                  {product.weight.grossWeight} {product.weight.unit}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">
                  {t('product.price')}:
                </span>
                <span className="font-semibold text-accent">
                  ₹{product.pricing.sellingPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-tertiary">
                  {t('product.stock')}:
                </span>
                <span className="font-medium text-text-secondary">
                  {product.stock.quantity} {product.stock.unit}
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
          />
        </div>
      </div>
    </div>
  )
}

export default MobileProductDetailHeader
