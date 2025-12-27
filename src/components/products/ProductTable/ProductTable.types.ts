// ============================================================================
// FILE: src/components/products/ProductTable/ProductTable.types.ts
// Product Table TypeScript Types
// ============================================================================

import type { Product } from '@/types/product.types'

// Re-export Product type for convenience
export type { Product } from '@/types/product.types'

// ============================================================================
// TABLE-SPECIFIC TYPES
// ============================================================================

export interface ProductTableFilters {
  search: string
  category?: string
  subCategory?: string
  metalType?: string
  purity?: string
  status?: string
  saleStatus?: string
  minPrice?: number
  maxPrice?: number
  gender?: string
  productType?: string
  isActive?: boolean
  isFeatured?: boolean
}

export interface ProductTableSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface ProductTableProps {
  onProductSelect?: (product: Product) => void
  onProductEdit?: (product: Product) => void
  hideActions?: boolean
  compactView?: boolean
}
