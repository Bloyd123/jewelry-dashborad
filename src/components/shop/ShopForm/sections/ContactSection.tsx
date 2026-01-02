// 
// FILE: src/components/shop/ShopForm/sections/ContactSection.tsx
// Contact Information Section
// 

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormPhoneInput } from '@/components/forms/FormPhoneInput/FormPhoneInput'
import type { FormSectionProps } from '../shopForm.types'

export const ContactSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Email */}
      <FormInput
        name="email"
        label={t('shops.form.email')}
        type="email"
        value={data.email || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.email}
        placeholder="shop@example.com"
        disabled={disabled}
      />

      {/* Phone */}
      <FormPhoneInput
        name="phone"
        label={t('shops.form.phone')}
        value={data.phone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.phone}
        placeholder="9876543210"
        required
        disabled={disabled}
      />

      {/* Alternate Phone */}
      <FormPhoneInput
        name="alternatePhone"
        label={t('shops.form.alternatePhone')}
        value={data.alternatePhone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.alternatePhone}
        placeholder="9876543211"
        disabled={disabled}
      />

      {/* WhatsApp Number */}
      <FormPhoneInput
        name="whatsappNumber"
        label={t('shops.form.whatsappNumber')}
        value={data.whatsappNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.whatsappNumber}
        placeholder="9876543210"
        disabled={disabled}
      />

      {/* Website */}
      <FormInput
        name="website"
        label={t('shops.form.website')}
        type="url"
        value={data.website || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.website}
        placeholder="www.yourshop.com"
        disabled={disabled}
      />
    </div>
  )
}
