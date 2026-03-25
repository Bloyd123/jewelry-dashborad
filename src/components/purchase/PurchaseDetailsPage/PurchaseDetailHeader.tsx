// FILE: src/components/purchase/PurchaseDetailPage/PurchaseDetailHeader.tsx

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DesktopPurchaseDetailHeader } from './DesktopPurchaseDetailHeader'
import { MobilePurchaseDetailHeader } from './MobilePurchaseDetailHeader'
import type { IPurchase } from '@/types/purchase.types'

interface PurchaseDetailHeaderProps {
  purchase: IPurchase
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
}

export const PurchaseDetailHeader: React.FC<PurchaseDetailHeaderProps> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobilePurchaseDetailHeader {...props} />
  ) : (
    <DesktopPurchaseDetailHeader {...props} />
  )
}

export default PurchaseDetailHeader