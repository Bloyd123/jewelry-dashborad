// ============================================================================
// FILE: src/components/sales/SaleForm/SaleForm.types.ts
// SaleForm Types and Interfaces
// ============================================================================

import type {
  SaleItem,
  OldGoldItem,
  PaymentMode,
  DeliveryType,
  SaleType,
} from '@/types/sale.types'

// ============================================================================
// FORM DATA INTERFACE
// ============================================================================

export interface SaleFormData {
  // Customer Info
  customerId: string

  // Sale Details
  saleType: SaleType
  saleDate: string

  // Items
  items: SaleFormItem[]

  // Old Gold Exchange
  oldGoldExchange: {
    hasExchange: boolean
    items: OldGoldFormItem[]
  }

  // Payment
  payment: {
    paymentMode: PaymentMode
    paidAmount: number
    dueDate?: string
  }

  // Delivery
  delivery: {
    deliveryType: DeliveryType
    deliveryDate?: string
    deliveryAddress?: string
  }

  // Additional
  notes?: string
  tags?: string[]
}

// ============================================================================
// ITEM INTERFACES
// ============================================================================

export interface SaleFormItem {
  productId?: string
  productName: string
  productCode?: string
  category?: string
  metalType: string
  purity: string
  grossWeight: number
  stoneWeight: number
  ratePerGram: number
  stoneValue: number
  makingCharges: number
  makingChargesType: 'per_gram' | 'flat' | 'percentage'
  otherCharges: number
  gstPercentage: number
  discount: {
    type: 'percentage' | 'flat' | 'none'
    value: number
  }
  quantity: number
  huid?: string
  isHallmarked: boolean
  warrantyPeriod?: number
  notes?: string
}

export interface OldGoldFormItem {
  metalType: string
  purity: string
  grossWeight: number
  stoneWeight: number
  ratePerGram: number
  description?: string
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface SaleFormProps {
  initialData?: Partial<SaleFormData>
  shopId: string
  saleId?: string // For edit mode
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

export interface FormSectionProps {
  data: Partial<SaleFormData>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}

// ============================================================================
// VALIDATION RESULT
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const defaultSaleFormData: SaleFormData = {
  customerId: '',
  saleType: 'retail',
  saleDate: new Date().toISOString(),
  items: [],
  oldGoldExchange: {
    hasExchange: false,
    items: [],
  },
  payment: {
    paymentMode: 'cash',
    paidAmount: 0,
  },
  delivery: {
    deliveryType: 'immediate',
  },
  notes: '',
  tags: [],
}

export const defaultSaleItem: SaleFormItem = {
  productName: '',
  metalType: 'gold',
  purity: '22K',
  grossWeight: 0,
  stoneWeight: 0,
  ratePerGram: 0,
  stoneValue: 0,
  makingCharges: 0,
  makingChargesType: 'flat',
  otherCharges: 0,
  gstPercentage: 3,
  discount: {
    type: 'none',
    value: 0,
  },
  quantity: 1,
  isHallmarked: false,
}

export const defaultOldGoldItem: OldGoldFormItem = {
  metalType: 'gold',
  purity: '22K',
  grossWeight: 0,
  stoneWeight: 0,
  ratePerGram: 0,
  description: '',
}
