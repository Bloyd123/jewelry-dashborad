// ============================================================================
// FILE: src/components/shop/ShopForm/ShopForm.tsx
// Main ShopForm Component (Route Handler)
// ============================================================================

import { useMediaQuery } from '@/hooks/useMediaQuery'
import ShopFormDesktop from './ShopForm.desktop'
import ShopFormMobile from './ShopForm.mobile'
import type { ShopFormProps } from './shopForm.types'

export const ShopForm = (props: ShopFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <ShopFormDesktop {...props} />
  ) : (
    <ShopFormMobile {...props} />
  )
}