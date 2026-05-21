// FILE: src/components/scheme/SchemeForm/sections/LimitsSection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import type { FormSectionProps } from '../SchemeForm.types'

export const LimitsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleLimitsChange = (field: string, value: any) => {
    onChange('limits', {
      ...data.limits,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <FormInput
        name="limits.maxEnrollments"
        label={t('scheme.limits1.maxEnrollments')}
        type="number"
        value={data.limits?.maxEnrollments || ''}
        onChange={(_, value) =>
          handleLimitsChange('maxEnrollments', value ? Number(value) : null)
        }
        onBlur={() => onBlur?.('limits.maxEnrollments')}
        error={errors['limits.maxEnrollments']}
        placeholder={t('scheme.limits1.unlimited')}
        disabled={disabled}
        min={1}
      />

      <FormInput
        name="limits.maxEnrollmentsPerCustomer"
        label={t('scheme.limits1.maxEnrollmentsPerCustomer')}
        type="number"
        value={data.limits?.maxEnrollmentsPerCustomer ?? 3}
        onChange={(_, value) =>
          handleLimitsChange('maxEnrollmentsPerCustomer', Number(value))
        }
        onBlur={() => onBlur?.('limits.maxEnrollmentsPerCustomer')}
        error={errors['limits.maxEnrollmentsPerCustomer']}
        placeholder="3"
        disabled={disabled}
        min={1}
      />
    </div>
  )
}