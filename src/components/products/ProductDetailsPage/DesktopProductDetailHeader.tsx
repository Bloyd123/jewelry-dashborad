// ============================================================================
// FILE: src/components/features/Products/DesktopProductDetailHeader.tsx
// Desktop Product Detail Header Component
// ============================================================================

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

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface DesktopProductDetailHeaderProps {
  productId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// ============================================================================
// DESKTOP PRODUCT DETAIL HEADER COMPONENT
// ============================================================================

export const DesktopProductDetailHeader: React.FC<
  DesktopProductDetailHeaderProps
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
    saleStatus: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (saleStatus) {
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
                {t('product.common.backToList')}
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
              {t('product.common.settings')}
            </Button>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-bg-tertiary">
                {product.primaryImage ? (
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-text-tertiary" />
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {product.name}
                  </h1>
                  <span className="text-text-tertiary">
                    ({product.productCode})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <Badge variant={getStatusVariant(product.status)} size="sm">
                    {t(`product.status.${product.status}`)}
                  </Badge>

                  {/* Sale Status Badge */}
                  <Badge
                    variant={getSaleStatusVariant(product.saleStatus)}
                    size="sm"
                  >
                    {t(`product.saleStatus.${product.saleStatus}`)}
                  </Badge>

                  {/* Active Status */}
                  <Badge
                    variant={product.isActive ? 'success' : 'error'}
                    size="sm"
                  >
                    {product.isActive
                      ? t('product.common.active')
                      : t('product.common.inactive')}
                  </Badge>

                  {/* Featured */}
                  {product.isFeatured && (
                    <Badge variant="info" size="sm">
                      {t('product.common.featured')}
                    </Badge>
                  )}

                  {/* New Arrival */}
                  {product.isNewArrival && (
                    <Badge variant="success" size="sm">
                      {t('product.common.newArrival')}
                    </Badge>
                  )}

                  {/* Bestseller */}
                  {product.isBestseller && (
                    <Badge variant="warning" size="sm">
                      {t('product.common.bestseller')}
                    </Badge>
                  )}
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  {categoryName && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">
                        {t('product.category')}:
                      </span>
                      <span>{categoryName}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <span className="text-text-tertiary">
                      {t('product.metaltext')}:
                    </span>
                    <span>{metalDisplay}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-text-tertiary">
                      {t('product.weight')}:
                    </span>
                    <span>
                      {product.weight.grossWeight} {product.weight.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-text-tertiary">
                      {t('product.price')}:
                    </span>
                    <span className="font-semibold text-text-primary">
                      ₹{product.pricing.sellingPrice.toLocaleString()}
                    </span>
                  </div>
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
          />
        </div>
      </div>
    </div>
  )
}

export default DesktopProductDetailHeader
