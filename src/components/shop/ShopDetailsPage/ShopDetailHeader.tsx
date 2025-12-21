// ============================================================================
// FILE: src/components/features/Shops/ShopDetailHeader.tsx
// Responsive Shop Detail Header (Main Component)
// ============================================================================

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileShopDetailHeader } from './MobileShopDetailHeader'
import { DesktopShopDetailHeader } from './DesktopShopDetailHeader'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ShopDetailHeaderProps {
  shopId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
  children?: React.ReactNode
}

// ============================================================================
// RESPONSIVE SHOP DETAIL HEADER COMPONENT
// ============================================================================

export const ShopDetailHeader: React.FC<ShopDetailHeaderProps> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobileShopDetailHeader {...props} />
  ) : (
    <DesktopShopDetailHeader {...props} />
  )
}

export default ShopDetailHeader
