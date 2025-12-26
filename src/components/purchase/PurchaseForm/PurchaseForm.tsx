// ============================================================================
// FILE: src/components/purchase/PurchaseForm/PurchaseForm.tsx
// Main PurchaseForm Component (Route Handler)
// ============================================================================

import { useMediaQuery } from '@/hooks/useMediaQuery'
import PurchaseFormDesktop from './PurchaseForm.desktop'
import PurchaseFormMobile from './PurchaseForm.mobile'
import type { PurchaseFormProps } from './PurchaseForm.types'

export const PurchaseForm = (props: PurchaseFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <PurchaseFormDesktop {...props} />
  ) : (
    <PurchaseFormMobile {...props} />
  )
}