// FILE: src/components/customer/CustomerForm/sections/BasicInfoSection.tsx
// Basic Information Section


import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormDatePicker } from '@/components/forms/FormDatePicker'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const genderOptions = [
    { value: 'male', label: t('customer.gender.male') },
    { value: 'female', label: t('customer.gender.female') },
    { value: 'other', label: t('customer.gender.other') },
  ]

  return (
    <div className="space-y-4">
      <FormInput
        name="firstName"
        label={t('customer.firstName')}
        value={data.firstName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.firstName}
        placeholder={t('customer.firstNamePlaceholder')}
        required
        disabled={disabled}
        maxLength={50}
      />

      <FormInput
        name="lastName"
        label={t('customer.lastName')}
        value={data.lastName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.lastName}
        placeholder={t('customer.lastNamePlaceholder')}
        disabled={disabled}
        maxLength={50}
      />

      <FormDatePicker
        name="dateOfBirth"
        label={t('customer.dateOfBirth')}
        value={data.dateOfBirth || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.dateOfBirth}
        placeholder={t('customer.selectDate')}
        disabled={disabled}
        maxDate={new Date()}
      />

      <FormSelect
        name="gender"
        label={t('customer.customergender')}
        value={data.gender || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.gender}
        placeholder={t('customer.selectGender')}
        options={genderOptions}
        disabled={disabled}
      />

      <FormDatePicker
        name="anniversaryDate"
        label={t('customer.anniversaryDate')}
        value={data.anniversaryDate || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.anniversaryDate}
        placeholder={t('customer.selectDate')}
        disabled={disabled}
      />
    </div>
  )
}
