// FILE: src/components/customer/CustomerForm/CustomerForm.types.ts
// CustomerForm Types and Interfaces

import type { CreateCustomerInput } from '@/validators/customerValidation'

export interface CustomerFormProps {
  initialData?: Partial<CreateCustomerInput>
  shopId: string // Required
  customerId?: string // For edit mode
  onSuccess?: () => void // Callback
  onCancel?: () => void
  mode?: 'create' | 'edit'
}
export interface FormSectionProps {
  data: Partial<CreateCustomerInput>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}
