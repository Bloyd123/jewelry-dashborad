// ============================================================================
// FILE: src/components/products/ProductForm/ProductForm.tsx
// Main ProductForm Component (Route Handler)
// ============================================================================

import { useMediaQuery } from '@/hooks/useMediaQuery'
import ProductFormDesktop from './ProductForm.desktop'
import ProductFormMobile from './ProductForm.mobile'
import type { ProductFormProps } from './ProductForm.types'

export const ProductForm = (props: ProductFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <ProductFormDesktop {...props} />
  ) : (
    <ProductFormMobile {...props} />
  )
}