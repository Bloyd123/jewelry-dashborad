
// FILE: src/components/purchase/PurchaseForm/PurchaseForm.types.ts
// PurchaseForm Types and Interfaces


import type {
  IPurchaseItem,
  PurchaseType,
  PaymentMode,
} from '@/types/purchase.types'

export interface PurchaseFormData {
  // Basic Info
  supplierId: string
  purchaseDate: string
  purchaseType: PurchaseType

  // Items
  items: IPurchaseItem[]

  // Payment
  paymentMode: PaymentMode
  paidAmount: number
  paymentTerms?: string
  dueDate?: string

  // Delivery
  expectedDate?: string
  deliveryAddress?: string

  // Additional
  notes?: string
  internalNotes?: string
  tags?: string[]
}

export interface PurchaseFormProps {
  initialData?: Partial<PurchaseFormData>
  shopId: string
  purchaseId?: string
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

export interface FormSectionProps {
  data: Partial<PurchaseFormData>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}
