// ============================================================================
// FILE: src/components/customer/CustomerCard/CustomerCard.tsx
// Main CustomerCard Component (Route Handler)
// ============================================================================

import { useMediaQuery } from '@/hooks/useMediaQuery'
import CustomerCardDesktop from './CustomerCard.desktop'
import CustomerCardMobile from './CustomerCard.mobile'
import type { Customer, CustomerListItem } from '@/types'

interface CustomerCardProps {
  customer: Customer | CustomerListItem
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  variant?: 'default' | 'compact'
}

export const CustomerCard = (props: CustomerCardProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  
  return isDesktop ? (
    <CustomerCardDesktop {...props} />
  ) : (
    <CustomerCardMobile {...props} />
  )
}