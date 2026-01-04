// FILE: src/components/products/ProductDetailsPage/ProductDetailHeader.tsx
// Responsive Product Detail Header (Main Component)
import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileProductDetailHeader } from './MobileProductDetailHeader'
import { DesktopProductDetailHeader } from './DesktopProductDetailHeader'

// COMPONENT PROPS

interface ProductDetailHeaderProps {
  productId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
  children?: React.ReactNode
}

// RESPONSIVE PRODUCT DETAIL HEADER COMPONENT

export const ProductDetailHeader: React.FC<
  ProductDetailHeaderProps
> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobileProductDetailHeader {...props} />
  ) : (
    <DesktopProductDetailHeader {...props} />
  )
}

export default ProductDetailHeader
