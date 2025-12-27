// ============================================================================
// FILE: src/components/products/ProductFilters/types.ts
// Product Filter Types
// ============================================================================

import type { DateRange } from 'react-day-picker'

export interface ProductFilterValues {
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
  [key: string]: string | number | boolean | undefined // Index signature for dynamic access
}

export interface PriceRange {
  min?: number
  max?: number
}
