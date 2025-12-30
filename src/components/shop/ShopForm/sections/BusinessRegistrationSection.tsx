// ============================================================================
// FILE: src/components/shop/ShopForm/sections/BusinessRegistrationSection.tsx
// Business Registration Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import type { FormSectionProps } from '../shopForm.types'

export const BusinessRegistrationSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleGSTChange = (name: string, value: string | number) => {
    onChange(name, String(value).toUpperCase())
  }

  const handlePANChange = (name: string, value: string | number) => {
    onChange(name, String(value).toUpperCase())
  }

  return (
    <div className="space-y-4">
      {/* GST Number */}
      <FormInput
        name="gstNumber"
        label={t('shops.form.gstNumber')}
        value={data.gstNumber || ''}
        onChange={handleGSTChange}
        onBlur={onBlur}
        error={errors.gstNumber}
        placeholder="24AAACP1234A1Z5"
        disabled={disabled}
        maxLength={15}
      />

      {/* PAN Number */}
      <FormInput
        name="panNumber"
        label={t('shops.form.panNumber')}
        value={data.panNumber || ''}
        onChange={handlePANChange}
        onBlur={onBlur}
        error={errors.panNumber}
        placeholder="AAACP1234A"
        disabled={disabled}
        maxLength={10}
      />

      {/* TAN Number */}
      <FormInput
        name="tanNumber"
        label={t('shops.form.tanNumber')}
        value={data.tanNumber || ''}
        onChange={(name, value) => onChange(name, String(value).toUpperCase())}
        onBlur={onBlur}
        error={errors.tanNumber}
        placeholder="ABCD12345E"
        disabled={disabled}
        maxLength={10}
      />
    </div>
  )
}
