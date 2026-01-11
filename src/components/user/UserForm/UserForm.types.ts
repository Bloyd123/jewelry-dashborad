// FILE: src/components/user/UserForm/UserForm.types.ts
// UserForm Types and Interfaces

import type { CreateUserInput } from '@/validators/userValidator'

/**
 * UserForm Props
 */
export interface UserFormProps {
  initialData?: Partial<CreateUserInput>
  organizationId?: string // For org_admin creating users
  userId?: string // For edit mode
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

/**
 * Form Section Props (Reusable)
 */
export interface FormSectionProps {
  data: Partial<CreateUserInput>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}