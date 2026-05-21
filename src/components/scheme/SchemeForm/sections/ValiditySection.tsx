// FILE: src/components/scheme/SchemeForm/sections/ValiditySection.tsx

import { useTranslation } from 'react-i18next'
import { FormDatePicker } from '@/components/forms/FormDatePicker'
import type { FormSectionProps } from '../SchemeForm.types'

export const ValiditySection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleValidityChange = (field: string, value: string) => {
    onChange('validity', {
      ...data.validity,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <FormDatePicker
        name="validity.startDate"
        label={t('scheme.validity.startDate')}
        value={data.validity?.startDate || ''}
        onChange={(_, value) => handleValidityChange('startDate', value)}
        onBlur={() => onBlur?.('validity.startDate')}
        error={errors['validity.startDate']}
        placeholder={t('common.selectDate')}
        required
        disabled={disabled}
      />

      <FormDatePicker
        name="validity.endDate"
        label={t('scheme.validity.endDate')}
        value={data.validity?.endDate || ''}
        onChange={(_, value) => handleValidityChange('endDate', value)}
        onBlur={() => onBlur?.('validity.endDate')}
        error={errors['validity.endDate']}
        placeholder={t('common.selectDate')}
        required
        disabled={disabled}
        minDate={
          data.validity?.startDate
            ? new Date(data.validity.startDate)
            : undefined
        }
      />

      <FormDatePicker
        name="validity.enrollmentDeadline"
        label={t('scheme.validity.enrollmentDeadline')}
        value={data.validity?.enrollmentDeadline || ''}
        onChange={(_, value) =>
          handleValidityChange('enrollmentDeadline', value)
        }
        onBlur={() => onBlur?.('validity.enrollmentDeadline')}
        error={errors['validity.enrollmentDeadline']}
        placeholder={t('scheme.validity.enrollmentDeadlinePlaceholder')}
        disabled={disabled}
        maxDate={
          data.validity?.endDate
            ? new Date(data.validity.endDate)
            : undefined
        }
      />
    </div>
  )
}