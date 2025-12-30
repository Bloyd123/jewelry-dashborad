// ============================================================================
// FILE: src/components/shop/ShopForm/sections/AddressSection.tsx
// Address Information Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import type { FormSectionProps } from '../shopForm.types'

export const AddressSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleAddressChange = (field: string, value: string | number) => {
    onChange('address', {
      ...data.address,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      {/* Street Address */}
      <FormTextarea
        name="address.street"
        label={t('shops.form.street')}
        value={data.address?.street || ''}
        onChange={(_, value) => handleAddressChange('street', value)}
        onBlur={() => onBlur?.('address.street')}
        error={errors['address.street']}
        placeholder={t('shops.form.streetPlaceholder')}
        required
        disabled={disabled}
        rows={2}
      />

      {/* Landmark */}
      <FormInput
        name="address.landmark"
        label={t('shops.form.landmark')}
        value={data.address?.landmark || ''}
        onChange={(_, value) => handleAddressChange('landmark', value)}
        onBlur={() => onBlur?.('address.landmark')}
        error={errors['address.landmark']}
        placeholder={t('shops.form.landmarkPlaceholder')}
        disabled={disabled}
      />

      {/* City & State */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          name="address.city"
          label={t('shops.form.city')}
          value={data.address?.city || ''}
          onChange={(_, value) => handleAddressChange('city', value)}
          onBlur={() => onBlur?.('address.city')}
          error={errors['address.city']}
          placeholder={t('shops.form.cityPlaceholder')}
          required
          disabled={disabled}
        />

        <FormInput
          name="address.state"
          label={t('shops.form.state')}
          value={data.address?.state || ''}
          onChange={(_, value) => handleAddressChange('state', value)}
          onBlur={() => onBlur?.('address.state')}
          error={errors['address.state']}
          placeholder={t('shops.form.statePlaceholder')}
          required
          disabled={disabled}
        />
      </div>

      {/* Pincode & Country */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          name="address.pincode"
          label={t('shops.form.pincode')}
          value={data.address?.pincode || ''}
          onChange={(_, value) => handleAddressChange('pincode', value)}
          onBlur={() => onBlur?.('address.pincode')}
          error={errors['address.pincode']}
          placeholder="400001"
          required
          disabled={disabled}
          maxLength={6}
        />

        <FormInput
          name="address.country"
          label={t('shops.form.country')}
          value={data.address?.country || 'India'}
          onChange={(_, value) => handleAddressChange('country', value)}
          onBlur={() => onBlur?.('address.country')}
          error={errors['address.country']}
          placeholder="India"
          disabled={disabled}
        />
      </div>
    </div>
  )
}