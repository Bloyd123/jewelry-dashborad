// 
// FILE: src/components/shop/ShopForm/ShopForm.types.ts
// ShopForm Types and Interfaces
// 

import type { Shop } from '@/types'

export interface ShopFormProps {
  initialData?: Partial<Shop>
  shopId?: string // For edit mode
  organizationId?: string // Required for create
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

export interface FormSectionProps {
  data: Partial<Shop>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}

export interface BankDetailFormData {
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolderName: string
  branchName?: string
  accountType?: 'savings' | 'current'
  isPrimary?: boolean
}

export interface UpiDetailFormData {
  upiId: string
  name?: string
  isPrimary?: boolean
}
