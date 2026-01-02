// FILE: src/components/customer/CustomerPage/CustomerDetailHeader.tsx
// Responsive Customer Detail Header (Main Component)

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileCustomerDetailHeader } from './MobileCustomerDetailHeader'
import { DesktopCustomerDetailHeader } from './DesktopCustomerDetailHeader'


// COMPONENT PROPS

interface CustomerDetailHeaderProps {
  customerId?: string
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// RESPONSIVE CUSTOMER DETAIL HEADER COMPONENT

export const CustomerDetailHeader: React.FC<
  CustomerDetailHeaderProps
> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobileCustomerDetailHeader {...props} />
  ) : (
    <DesktopCustomerDetailHeader {...props} />
  )
}

export default CustomerDetailHeader
