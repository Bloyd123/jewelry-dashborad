// 
// FILE: src/components/sales/SaleForm/SaleForm.tsx
// Main SaleForm Component (Route Handler)
// 

import { useMediaQuery } from '@/hooks/useMediaQuery'
import SaleFormDesktop from './SaleForm.desktop'
import SaleFormMobile from './SaleForm.mobile'
import type { SaleFormProps } from './SaleForm.types'

export const SaleForm = (props: SaleFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <SaleFormDesktop {...props} />
  ) : (
    <SaleFormMobile {...props} />
  )
}
