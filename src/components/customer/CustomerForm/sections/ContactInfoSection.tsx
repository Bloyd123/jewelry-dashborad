// ============================================================================
// FILE: src/components/customer/CustomerForm/sections/ContactInfoSection.tsx
// Contact Information Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { FormPhoneInput } from '@/components/forms/FormPhoneInput'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'

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
        label={t('customer.phone')}
        value={data.phone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.phone}
        placeholder="9876543210"
        required
        disabled={disabled}
      />

      <FormPhoneInput
        name="alternatePhone"
        label={t('customer.alternatePhone')}
        value={data.alternatePhone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.alternatePhone}
        placeholder="9876543210"
        disabled={disabled}
      />

      <FormPhoneInput
        name="whatsappNumber"
        label={t('customer.whatsappNumber')}
        value={data.whatsappNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.whatsappNumber}
        placeholder="9876543210"
        disabled={disabled}
      />

      <FormInput
        name="email"
        label={t('customer.email')}
        type="email"
        value={data.email || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.email}
        placeholder="customer@example.com"
        disabled={disabled}
      />
    </div>
  )
}