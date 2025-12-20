// ============================================================================
// FILE: src/components/customer/CustomerForm/CustomerForm.tsx
// Main CustomerForm Component (Route Handler)
// ============================================================================

import { useMediaQuery } from '@/hooks/useMediaQuery'
import CustomerFormDesktop from './CustomerForm.desktop'
import CustomerFormMobile from './CustomerForm.mobile'
import type { CustomerFormProps } from './CustomerForm.types'

export const CustomerForm = (props: CustomerFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <CustomerFormDesktop {...props} />
  ) : (
    <CustomerFormMobile {...props} />
  )
}
