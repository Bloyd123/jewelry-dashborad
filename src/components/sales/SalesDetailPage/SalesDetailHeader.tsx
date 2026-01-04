// FILE: src/components/sales/SalesDetailPage/SalesDetailHeader.tsx
// Responsive Sales Detail Header (Main Component)

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileSalesDetailHeader } from './MobileSalesDetailHeader'
import { DesktopSalesDetailHeader } from './DesktopSalesDetailHeader'

// COMPONENT PROPS

interface SalesDetailHeaderProps {
  saleId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onEditClick?: () => void
  onDeleteClick?: () => void
  onPrintClick?: () => void
  onSendClick?: () => void
}

// RESPONSIVE SALES DETAIL HEADER COMPONENT

export const SalesDetailHeader: React.FC<SalesDetailHeaderProps> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobileSalesDetailHeader {...props} />
  ) : (
    <DesktopSalesDetailHeader {...props} />
  )
}

export default SalesDetailHeader
