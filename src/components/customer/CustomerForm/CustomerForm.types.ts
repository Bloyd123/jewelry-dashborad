// FILE: src/components/customer/CustomerForm/CustomerForm.types.ts

import type { CreateCustomerInput } from '@/validators/customerValidation'

export interface CustomerFormProps {
  shopId: string

  customerId?: string

  initialData?: Partial<CreateCustomerInput>

  onSuccess?: () => void

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
