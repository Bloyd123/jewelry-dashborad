// FILE: src/components/sales/SaleForm/SaleForm.types.ts

import type {
  OldGoldItem,
  PaymentMode,
  DeliveryType,
  SaleType,
  MetalType,          
  MakingChargesType,  
  DiscountType,
  WeightUnit,
} from '@/types/sale.types'



export interface SaleFormData {
  customerId: string
  saleType: SaleType
  saleDate: string
  items: SaleFormItem[]
  oldGoldExchange: {
    hasExchange: boolean
    items: OldGoldFormItem[]
  }
  payment: {
    paymentMode: PaymentMode
    paidAmount: number
    dueDate?: string
  }
  delivery: {
    deliveryType: DeliveryType
    deliveryDate?: string
    deliveryAddress?: string
  }
  notes?: string
  tags?: string[]
}

export interface SaleFormItem {
  productId?: string
  productName: string
  productCode?: string
  category?: string
  metalType: MetalType          // ← string → MetalType
  purity?: string
  grossWeight: number
  stoneWeight: number
  weightUnit: WeightUnit        // ← 'gram'|'kg'|'tola' → WeightUnit
  ratePerGram: number
  stoneValue: number
  makingCharges: number
  makingChargesType: MakingChargesType  // ← inline type → MakingChargesType
  otherCharges: number
  gstPercentage: number
  discount: {
    type:   DiscountType        // ← inline type → DiscountType
    value:  number
    amount: number
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
  netWeight: number
  ratePerGram: number
  totalValue: number
  description?: string
}


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


export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}


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
  productName:       '',
  metalType:         'gold',
  purity:            '22K',
  grossWeight:       0,
  stoneWeight:       0,
  weightUnit:        'gram',
  ratePerGram:       0,
  stoneValue:        0,
  makingCharges:     0,
  makingChargesType: 'flat',
  otherCharges:      0,
  gstPercentage:     3,
  discount: {
    type:   'none',
    value:  0,
    amount: 0,
  },
  quantity:     1,
  isHallmarked: false,
}

export const defaultOldGoldItem: OldGoldFormItem = {
  metalType:   'gold',
  purity:      '22K',
  grossWeight: 0,
  stoneWeight: 0,
  netWeight:   0,
  ratePerGram: 0,
  totalValue:  0,
  description: '',
}
