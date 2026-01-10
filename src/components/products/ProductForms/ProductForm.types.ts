// FILE: src/components/products/ProductForm/ProductForm.types.ts
// ProductForm Types and Interfaces

import type {
  Metal,
  Weight,
  Stone,
  MakingCharges,
  Pricing,
  Stock,
  ProductImage,
  Hallmarking,
  Size,
  Dimensions,
  ProductType,
  Gender,
  OccasionType,
} from '@/types/product.types'

// Extended form data with all fields
export interface ProductFormData {
  // Identification
  productCode?: string
  barcode?: string
  sku?: string
  huid?: string

  // Basic Info
  name: string
  description?: string

  // Category
  categoryId: string
  subCategoryId?: string
  productType: ProductType

  // Product Details
  metal: Metal
  weight: Weight
  stones?: Stone[]
  makingCharges: MakingCharges
  pricing: Partial<Pricing>
  stock: Stock

  // Physical Attributes
  size?: Size
  dimensions?: Dimensions
  hallmarking?: Hallmarking

  // Media
  images?: ProductImage[]

  // Classification
  gender: Gender
  occasion?: OccasionType[]

  // Status
  isActive?: boolean
  isFeatured?: boolean
  isNewArrival?: boolean
  isBestseller?: boolean

  // Search & Tags
  tags?: string[]
  keywords?: string[]

  // Notes
  notes?: string
  internalNotes?: string
}

export interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  shopId: string
  productId?: string // For edit mode
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

export interface FormSectionProps {
  data: Partial<ProductFormData>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}

export interface StoneFormData {
  _id?: string
  stoneType: string
  stoneName?: string
  stoneQuality?: string
  stoneColor?: string
  stoneShape?: string
  stoneCut?: string
  stoneClarity?: string
  caratWeight?: number
  stoneWeight?: number
  pieceCount: number
  stonePrice: number
  totalStonePrice: number
}

export interface PriceBreakdown {
  metalRate: number
  metalValue: number
  stoneValue: number
  makingCharges: number
  otherCharges: number
  subtotal: number
  gstAmount: number
  totalPrice: number
  discount: number
  sellingPrice: number
}
