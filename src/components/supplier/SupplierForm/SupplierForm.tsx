// 
// FILE: src/components/supplier/SupplierForm/SupplierForm.tsx
// Main SupplierForm Component (Route Handler)
// 

import { useMediaQuery } from '@/hooks/useMediaQuery'
import SupplierFormDesktop from './SupplierForm.desktop'
import SupplierFormMobile from './SupplierForm.mobile'
import type { SupplierFormProps } from './SupplierForm.types'

export const SupplierForm = (props: SupplierFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <SupplierFormDesktop {...props} />
  ) : (
    <SupplierFormMobile {...props} />
  )
}
