// FILE: src/components/scheme/SchemeForm/SchemeForm.types.ts

import type { CreateSchemeInput } from '@/validators/schemeValidation'

export interface SchemeFormProps {
  shopId:       string
  schemeId?:    string
  initialData?: Partial<CreateSchemeInput>
  onSuccess?:   () => void
  onCancel?:    () => void
  mode?:        'create' | 'edit'
}

export interface FormSectionProps {
  data:      Partial<CreateSchemeInput>
  errors:    Record<string, string>
  onChange:  (name: string, value: any) => void
  onBlur?:   (name: string) => void
  disabled?: boolean
}