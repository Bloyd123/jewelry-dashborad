// FILE: src/components/customer/CustomerForm/CustomerForm.types.ts
// CustomerForm Types and Interfaces

import type { CreateCustomerInput } from '@/validators/customerValidation'

export interface CustomerFormProps {
  /**
   * Shop ID (required)
   */
  shopId: string

  /**
   * Customer ID (only for edit mode)
   */
  customerId?: string

  /**
   * Initial form data (for edit mode)
   */
  initialData?: Partial<CreateCustomerInput>

  /**
   * Callback when form is successfully submitted
   */
  onSuccess?: () => void

  /**
   * Callback when form is cancelled
   */
  onCancel?: () => void

  /**
   * Form mode: create or edit
   */
  mode?: 'create' | 'edit'
}
export interface FormSectionProps {
  data: Partial<CreateCustomerInput>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}
