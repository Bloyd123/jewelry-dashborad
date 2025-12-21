// ============================================================================
// FILE: src/components/features/MetalRates/MetalRatesDashboardHeader.tsx
// Responsive Metal Rates Dashboard Header (Main Component)
// ============================================================================

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileMetalRatesDashboardHeader } from './MobileMetalRatesDashboardHeader'
import { DesktopMetalRatesDashboardHeader } from './DesktopMetalRatesDashboardHeader'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface MetalRatesDashboardHeaderProps {
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
// RESPONSIVE METAL RATES DASHBOARD HEADER COMPONENT
// ============================================================================

export const MetalRatesDashboardHeader: React.FC<
  MetalRatesDashboardHeaderProps
> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobileMetalRatesDashboardHeader {...props} />
  ) : (
    <DesktopMetalRatesDashboardHeader {...props} />
  )
}

export default MetalRatesDashboardHeader
