// FILE: src/components/scheme/SchemeForm/sections/BasicInfoSection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }    from '@/components/forms/FormInput'
import { FormSelect }   from '@/components/forms/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea'
import type { FormSectionProps } from '../SchemeForm.types'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const schemeTypeOptions = [
    { value: 'gold_saving',     label: t('scheme.type.goldSaving')     },
    { value: 'installment',     label: t('scheme.type.installment')     },
    { value: 'advance_booking', label: t('scheme.type.advanceBooking')  },
    { value: 'festival_scheme', label: t('scheme.type.festival')        },
    { value: 'custom',          label: t('scheme.type.custom')          },
  ]

  return (
    <div className="space-y-4">
      <FormInput
        name="schemeName"
        label={t('scheme.schemeName')}
        value={data.schemeName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.schemeName}
        placeholder={t('scheme.schemeNamePlaceholder')}
        required
        disabled={disabled}
        maxLength={100}
      />

      <FormSelect
        name="schemeType"
        label={t('scheme.schemeType')}
        value={data.schemeType || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.schemeType}
        placeholder={t('scheme.selectSchemeType')}
        options={schemeTypeOptions}
        required
        disabled={disabled}
      />

      <FormTextarea
        name="description"
        label={t('scheme.description')}
        value={data.description || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.description}
        placeholder={t('scheme.descriptionPlaceholder')}
        disabled={disabled}
        maxLength={1000}
        rows={3}
        showCharCount
      />

      <FormInput
        name="notes"
        label={t('scheme.notes')}
        value={data.notes || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.notes}
        placeholder={t('scheme.notesPlaceholder')}
        disabled={disabled}
        maxLength={1000}
      />
    </div>
  )
}