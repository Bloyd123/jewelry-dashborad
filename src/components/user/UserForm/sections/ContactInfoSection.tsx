// FILE: src/components/user/UserForm/sections/ContactInfoSection.tsx
// Contact Information Section - Phone

import { useTranslation } from 'react-i18next'
import { FormPhoneInput } from '@/components/forms/FormPhoneInput'
import type { FormSectionProps } from '../UserForm.types'

export const ContactInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <FormPhoneInput
        name="phone"
        label={t('user.phone')}
        value={data.phone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.phone}
        placeholder="9876543210"
        disabled={disabled}
        helpText={t('user.phoneHelpText')}
      />
    </div>
  )
}